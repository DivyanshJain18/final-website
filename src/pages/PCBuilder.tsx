import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { fetchProducts, Product } from '../services/productService';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, HardDrive, Fan, Monitor, Cpu as GpuIcon, Box, Zap, MemoryStick, Send, Mail, X, CheckCircle, Smartphone } from 'lucide-react';
import { Reveal } from '../components/Reveal';

interface BuilderCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  categoryKeywords: string[];
}

const BUILDER_CATEGORIES: BuilderCategory[] = [
  { id: 'processor', name: 'Processor (CPU)', icon: Cpu, categoryKeywords: ['processor', 'cpu'] },
  { id: 'motherboard', name: 'Motherboard', icon: Box, categoryKeywords: ['motherboard', 'mainboard'] },
  { id: 'ram', name: 'RAM (Memory)', icon: MemoryStick, categoryKeywords: ['ram', 'memory'] },
  { id: 'gpu', name: 'Graphics Card (GPU)', icon: GpuIcon, categoryKeywords: ['graphic', 'gpu', 'video card', 'vga'] },
  { id: 'storage', name: 'Storage (SSD/HDD)', icon: HardDrive, categoryKeywords: ['ssd', 'hdd', 'storage', 'hard drive', 'nvme', 'solid state'] },
  { id: 'psu', name: 'Power Supply (PSU)', icon: Zap, categoryKeywords: ['power supply', 'psu', 'smps'] },
  { id: 'cabinet', name: 'Cabinet / Case', icon: Box, categoryKeywords: ['cabinet', 'case', 'chassis', 'tower'] },
  { id: 'cooler', name: 'CPU Cooler', icon: Fan, categoryKeywords: ['cooler', 'liquid cooling', 'aio', 'air cooler', 'fan'] },
  { id: 'os', name: 'Operating System', icon: Monitor, categoryKeywords: ['windows', 'os', 'operating system', 'software', 'ubuntu'] },
];

export default function PCBuilder() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('processor');
  const [selectedParts, setSelectedParts] = useState<Record<string, Product>>({});
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Quote Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Fetch all products so we can search/filter them locally
    fetchProducts()
      .then((data) => {
        setAllProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products", err);
        setIsLoading(false);
      });
  }, []);

  const totalCost = Object.values(selectedParts).reduce((sum, part) => sum + (part?.price || 0), 0);

  // Filter products for the active category using strict mapping rules
  const activeProducts = useMemo(() => {
    const categoryDef = BUILDER_CATEGORIES.find(c => c.id === activeCategory);
    if (!categoryDef) return [];
    
    return allProducts.filter(p => {
      // 1. Build a strict string composed ONLY of the actual backend category mappings
      const categoryPath = `${p.category_name || ''} | ${p.subcategory_name || ''} | ${p.subsubcategory_name || ''} | ${p.nested_subcategory_name || ''}`.toLowerCase();
      
      // 2. See if the product's assigned categories match any of the component's required keywords
      const matchesCategoryPath = categoryDef.categoryKeywords.some(keyword => categoryPath.includes(keyword));
      
      if (matchesCategoryPath) return true;

      // 3. Fallback logic: check the product name only if the categories were blank/unmapped,
      // but enforce strict boundary checks to prevent cross-contamination (e.g., motherboards with "Intel" in them)
      const productName = (p.name || '').toLowerCase();
      
      // Negative exclusions to prevent mismatch
      if (categoryDef.id === 'processor' && productName.includes('motherboard')) return false;
      if (categoryDef.id === 'motherboard' && productName.includes('processor')) return false;

      // Check product name with strict word boundaries
      return categoryDef.categoryKeywords.some(keyword => new RegExp(`\\b${keyword}\\b`).test(productName));
    });
  }, [allProducts, activeCategory]);

  const handleSelectPart = (categoryId: string, product: Product) => {
    setSelectedParts(prev => ({
      ...prev,
      [categoryId]: product
    }));
    // Move to next empty category
    const currentIndex = BUILDER_CATEGORIES.findIndex(c => c.id === categoryId);
    let nextIndex = currentIndex + 1;
    while (nextIndex < BUILDER_CATEGORIES.length) {
      const nextCatId = BUILDER_CATEGORIES[nextIndex].id;
      if (!selectedParts[nextCatId]) {
        setActiveCategory(nextCatId);
        break;
      }
      nextIndex++;
    }
  };

  const handleRemovePart = (categoryId: string) => {
    setSelectedParts(prev => {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    });
  };

  const generateEmailBody = () => {
    let body = `Hello Mechafy Global team,\n\nI would like to request a quote for the following Custom PC Build:\n\n`;
    
    BUILDER_CATEGORIES.forEach(cat => {
      const part = selectedParts[cat.id];
      if (part) {
        body += `- ${cat.name}: ${part.name} (Est. ${part.price.toFixed(2)})\n`;
      }
    });

    body += `\nEstimated Total Budget: ₹${totalCost.toFixed(2)}\n\n`;
    body += `Looking forward to your best quote.`;
    return encodeURIComponent(body);
  };

  const handleEmailRequest = () => {
    window.location.href = `mailto:sales@mechafyglobal.com?subject=Custom PC Build Quote Request&body=${generateEmailBody()}`;
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const partsMap = Object.entries(selectedParts).map(([catId, part]) => ({
        categoryId: catId,
        categoryName: BUILDER_CATEGORIES.find(c => c.id === catId)?.name || catId,
        productId: part.id,
        productName: part.name,
        price: part.price
      }));

      await addDoc(collection(db, 'custom_pc_quotes'), {
        ...formData,
        parts: partsMap,
        totalEstimatedPrice: totalCost,
        createdAt: serverTimestamp(),
      });

      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error submitting quote", err);
      alert("There was an error submitting your request. Please try emailing us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategoryDef = BUILDER_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Custom <span className="text-electric-blue">PC Builder</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Select your components step-by-step and instantly generate a custom quote. Our team will review your build for compatibility and offer you the best competitive pricing.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Category Selection Accordion */}
          <div className="flex-1 space-y-4">
            {BUILDER_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              const selectedPart = selectedParts[category.id];

              return (
                <div 
                  key={category.id} 
                  className={`glass-panel border-l-4 transition-all duration-300 ${isActive ? 'border-electric-blue shadow-[0_0_15px_rgba(59,130,246,0.2)]' : selectedPart ? 'border-green-500' : 'border-white/10 hover:border-white/30'} rounded-xl overflow-hidden`}
                >
                  {/* Category Header */}
                  <button 
                    onClick={() => setActiveCategory(isActive ? '' : category.id)}
                    className="w-full flex items-center justify-between p-4 focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-electric-blue/20 text-electric-blue' : selectedPart ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-slate-400'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h3 className={`font-semibold ${isActive || selectedPart ? 'text-white' : 'text-slate-400'}`}>{category.name}</h3>
                        {selectedPart ? (
                          <p className="text-sm text-green-400 line-clamp-1 mt-0.5">{selectedPart.name}</p>
                        ) : (
                          <p className="text-xs text-slate-500 mt-0.5">Select a component</p>
                        )}
                      </div>
                    </div>
                    {selectedPart && !isActive && (
                      <div className="text-right">
                        <p className="text-white font-medium">₹{selectedPart.price.toFixed(2)}</p>
                        <span 
                          onClick={(e) => { e.stopPropagation(); handleRemovePart(category.id); }}
                          className="text-xs text-red-400 hover:text-red-300 uppercase tracking-widest mt-1 inline-block cursor-pointer"
                        >
                          Remove
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Active Category Product Selection */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5"
                      >
                        <div className="p-4 bg-navy-900/40">
                          {isLoading ? (
                            <div className="animate-pulse flex space-x-4">
                              <div className="flex-1 space-y-4 py-1">
                                <div className="h-20 bg-white/5 rounded"></div>
                                <div className="h-20 bg-white/5 rounded"></div>
                              </div>
                            </div>
                          ) : activeProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                              {activeProducts.map(product => (
                                <div 
                                  key={product.id}
                                  onClick={() => handleSelectPart(category.id, product)}
                                  className={`flex items-start gap-4 p-3 rounded-lg border cursor-pointer transition-all ${selectedPart?.id === product.id ? 'border-electric-blue bg-electric-blue/10' : 'border-white/10 bg-white/5 hover:border-electric-blue/50'}`}
                                >
                                  <div className="w-16 h-16 rounded-md overflow-hidden bg-navy-900 shrink-0">
                                    {product.image_url ? (
                                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <Box className="w-full h-full p-4 text-slate-500" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-white line-clamp-2">{product.name}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                      <p className="text-electric-blue font-bold">₹{product.price.toFixed(2)}</p>
                                      {selectedPart?.id === product.id && (
                                        <CheckCircle className="w-4 h-4 text-electric-blue" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-400">
                              <p>No products found actively matching this category.</p>
                              <p className="text-sm mt-2">Feel free to skip this part or contact us.</p>
                              <button onClick={() => {
                                // proceed to next
                                const currentIndex = BUILDER_CATEGORIES.findIndex(c => c.id === activeCategory);
                                if(currentIndex < BUILDER_CATEGORIES.length - 1) {
                                  setActiveCategory(BUILDER_CATEGORIES[currentIndex + 1].id);
                                } else {
                                  setActiveCategory('');
                                }
                              }} className="btn-glow text-xs py-2 px-4 mt-4">
                                Skip Category
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Side: Build Summary Sidebar */}
          <div className="w-full lg:w-96 shrink-0 relative mt-8 lg:mt-0">
            <div className="glass-panel p-6 rounded-xl sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                <Box className="text-electric-blue" /> Build Summary
              </h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] lg:max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {BUILDER_CATEGORIES.map(cat => {
                  const part = selectedParts[cat.id];
                  if (!part) return null;
                  return (
                    <div key={cat.id} className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div className="pr-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{cat.name}</p>
                        <p className="text-sm text-white line-clamp-2">{part.name}</p>
                      </div>
                      <p className="text-sm font-medium text-electric-blue whitespace-nowrap shrink-0">₹{part.price.toFixed(2)}</p>
                    </div>
                  );
                })}

                {Object.keys(selectedParts).length === 0 && (
                  <div className="text-center py-8 text-slate-500 border border-dashed border-white/10 rounded-lg">
                    Select components from the left to start building your PC.
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <p className="text-slate-400">Estimated Total</p>
                  <p className="text-3xl font-bold text-white">₹{totalCost.toFixed(2)}</p>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-right">Taxes and shipping may apply.</p>
              </div>

              <button 
                onClick={() => setIsQuoteModalOpen(true)}
                disabled={Object.keys(selectedParts).length === 0}
                className="w-full py-4 bg-electric-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1"
              >
                Get Quote for Build
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar Summary (Visible only on small screens when selecting) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-navy-900/95 backdrop-blur-md border-t border-white/10 z-40">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Est. Total ({Object.keys(selectedParts).length} Parts)</p>
            <p className="text-xl font-bold text-white">₹{totalCost.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => setIsQuoteModalOpen(true)}
            disabled={Object.keys(selectedParts).length === 0}
            className="px-6 py-3 bg-electric-blue text-white font-bold rounded-lg disabled:opacity-50"
          >
            Get Quote
          </button>
        </div>
      </div>

      {/* Quote Selection/Form Modal */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && !submitSuccess && setIsQuoteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-navy-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 lg:p-8"
            >
              {!submitSuccess && (
                <button 
                  onClick={() => setIsQuoteModalOpen(false)} 
                  disabled={isSubmitting}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              )}

              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Quote Requested!</h3>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Thank you. We have received your custom PC configuration and will get back to you with the best pricing and availability shortly.
                  </p>
                  <button 
                    onClick={() => {
                      setIsQuoteModalOpen(false);
                      setSubmitSuccess(false);
                      setSelectedParts({});
                      setActiveCategory('processor');
                    }}
                    className="btn-glow px-8 py-3"
                  >
                    Start a New Build
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">Request Custom Quote</h3>
                  <p className="text-slate-400 mb-8">Choose how you would like to send your configuration to us.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button 
                      onClick={handleEmailRequest}
                      className="p-6 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 hover:border-electric-blue/50 text-left transition-all group"
                    >
                      <Mail className="w-8 h-8 text-electric-blue mb-4 group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold text-white mb-1">Send via Email</h4>
                      <p className="text-xs text-slate-400">Opens your default email app with the parts list pre-filled.</p>
                    </button>
                    <div className="p-6 border border-electric-blue/30 rounded-xl bg-electric-blue/10 relative">
                      <div className="absolute top-0 right-0 bg-electric-blue text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">Recommended</div>
                      <Send className="w-8 h-8 text-electric-blue mb-4" />
                      <h4 className="font-bold text-white mb-1">Submit Form Here</h4>
                      <p className="text-xs text-blue-200/70">Fill out the form below to send it directly to our sales team.</p>
                    </div>
                  </div>

                  <form onSubmit={handleQuoteSubmit} className="space-y-4 border-t border-white/10 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-navy-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-electric-blue outline-none" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-navy-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-electric-blue outline-none" placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                        <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-navy-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-electric-blue outline-none" placeholder="+91 9000000000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">City / Location</label>
                        <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-navy-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-electric-blue outline-none" placeholder="New Delhi, India" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Special Requirements / Notes (Optional)</label>
                      <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-navy-800 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-electric-blue outline-none h-24 resize-none" placeholder="E.g., I need this primarily for 4K video editing, preferably an all-white build."></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-electric-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50 flex justify-center items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit Quote Request"
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </Layout>
  );
}
