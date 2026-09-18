import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { fetchProducts, Product } from '../services/productService';
import { Link } from 'react-router-dom';
import { Layers, Cuboid, Zap, Settings, ArrowRight, ShieldCheck, Headphones, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ThreeDPrintersFilaments() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [showAllPrinters, setShowAllPrinters] = useState(false);
  const [showAllFilaments, setShowAllFilaments] = useState(false);

  const HERO_SLIDES = [
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1920", // Industrial / Engineering
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1920", // 3D Printer nozzle close up
    "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?auto=format&fit=crop&q=80&w=1920"  // Tech / Filament
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [HERO_SLIDES.length]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        
        // Filter products for 3D Printers, Filaments, or related categories
        const filtered = allProducts.filter(p => {
          const cat = (p.category_name || '').toLowerCase();
          const sub = (p.subcategory_name || '').toLowerCase();
          const subsub = (p.subsubcategory_name || '').toLowerCase();
          const nested = (p.nested_subcategory_name || '').toLowerCase();
          
          return cat.includes('3d') || sub.includes('3d') || subsub.includes('3d') || nested.includes('3d')
                 || cat.includes('filament') || sub.includes('filament');
        });
        
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to load 3D printing products", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const printers = products.filter(p => (p.category_name || '').toLowerCase().includes('printer') || (p.subcategory_name || '').toLowerCase().includes('printer'));
  const filaments = products.filter(p => (p.category_name || '').toLowerCase().includes('filament') || (p.subcategory_name || '').toLowerCase().includes('filament'));
  const otherProducts = products.filter(p => !printers.includes(p) && !filaments.includes(p));

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] md:min-h-[600px] flex items-center py-20 overflow-hidden glass-panel rounded-3xl mb-16">
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 animate-subtle-zoom' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${slide}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-900/60 z-10" />
          <div className="absolute inset-0 bg-electric-blue/5 mix-blend-overlay z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent z-10" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-3xl">
            {/* Mechafy Logo */}
            <Reveal>
              <div className="mb-6 flex items-center justify-center md:justify-start gap-3 relative z-10">
                <img 
                  src="https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg" 
                  alt="Mechafy Global Logo" 
                  className="w-10 h-10 md:w-12 md:h-12 rounded shadow-lg object-cover border border-white/10"
                />
                <span className="text-sm md:text-base font-bold text-electric-blue uppercase tracking-widest drop-shadow">Mechafy Global</span>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 md:mb-8 tracking-tight drop-shadow-lg relative z-10">
                Precision 3D Printing <span className="text-electric-blue">& Materials</span>
              </h1>
            </Reveal>
            
            <Reveal delay={0.4}>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed drop-shadow">
                From high-speed prototyping to industrial manufacturing. Explore our curated selection of professional 3D printers, advanced filaments, and comprehensive solutions designed to bring your boldest ideas to life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-10 text-sm font-medium text-slate-300 drop-shadow">
                <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-electric-blue" /> Industrial Grade</div>
                <div className="hidden sm:block text-slate-600">•</div>
                <div className="flex items-center gap-2"><Layers className="h-5 w-5 text-purple-400" /> Premium Filaments</div>
                <div className="hidden sm:block text-slate-600">•</div>
                <div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-electric-blue" /> Expert Support</div>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <div className="flex flex-wrap gap-4">
                <a href="#featured-printers" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-center w-full sm:w-auto">
                  Explore Printers
                </a>
                <a href="#filaments" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-center w-full sm:w-auto">
                  View Filaments
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE MECHAFY FOR 3D PRINTING */}
      <section className="pt-16 pb-8 relative overflow-hidden bg-gradient-to-b from-navy-950 to-navy-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow">The Digital-to-Physical Advantage</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Experience unmatched precision, reliability, and support with Mechafy Global's 3D printing ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 text-center group hover:border-electric-blue/50 transition-colors bg-white/5 backdrop-blur-md">
              <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Zap className="h-8 w-8 text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">High-Speed Precision</h3>
              <p className="text-slate-400">Industry-leading printing speeds without compromising on microscopic detail and layer adhesion.</p>
            </div>
            
            <div className="glass-panel p-8 text-center group hover:border-purple-500/50 transition-colors bg-white/5 backdrop-blur-md">
              <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <Layers className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Materials</h3>
              <p className="text-slate-400">From standard PLA to engineering-grade Nylon and Carbon Fiber, our filaments ensure flawless extrusion.</p>
            </div>
            
            <div className="glass-panel p-8 text-center group hover:border-electric-blue/50 transition-colors bg-white/5 backdrop-blur-md">
              <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Settings className="h-8 w-8 text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Support</h3>
              <p className="text-slate-400">Our technical team provides comprehensive setup guidance, calibration help, and troubleshooting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRINTERS SECTION */}
      <section id="featured-printers" className="pt-8 pb-16 relative overflow-hidden bg-navy-900">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-electric-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Professional Printers</h2>
                <p className="text-slate-400">Desktop and industrial solutions for every scale.</p>
              </div>
              {!showAllPrinters && printers.length > 4 && (
                <button onClick={() => setShowAllPrinters(true)} className="flex items-center text-electric-blue hover:text-blue-400 transition-colors font-semibold cursor-pointer">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </Reveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
            </div>
          ) : printers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {printers.slice(0, showAllPrinters ? printers.length : 4).map((product, index) => (
                <Reveal key={product.id} delay={index * 0.05}>
                  <div className="glass-panel group flex flex-col h-full overflow-hidden hover:border-electric-blue/50 transition-all duration-300">
                    <Link to={`/product/${product.slug}`} className="block relative h-56 bg-white/5 p-6 overflow-hidden shrink-0">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <Link to={`/product/${product.slug}`} className="text-lg font-bold text-white mb-2 hover:text-electric-blue line-clamp-2 transition-colors min-h-[3.5rem]">
                        {product.name}
                      </Link>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-3 flex-grow">{product.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 shrink-0">
                        <div className="flex items-center">
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs line-through text-slate-500 mr-2">₹{product.originalPrice.toFixed(2)}</span>
                          )}
                          <span className="text-xl font-bold text-white">₹{product.price.toFixed(2)}</span>
                        </div>
                        <button 
                          onClick={() => addItem(product)}
                          disabled={product.stock <= 0}
                          className="p-2.5 bg-white/5 hover:bg-electric-blue text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-electric-blue"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-navy-900/50 rounded-2xl border border-dashed border-white/20">
              <Cuboid className="mx-auto h-16 w-16 text-slate-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Expanding Our Catalog</h3>
              <p className="text-slate-400 max-w-md mx-auto">We are currently updating our 3D printer inventory in the database. Please check back soon.</p>
              <Link to="/contact" className="inline-block mt-8 px-6 py-3 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors">
                Contact Sales Team
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FILAMENTS SECTION */}
      <section id="filaments" className="pt-8 pb-16 relative overflow-hidden bg-navy-900 border-t border-white/5">
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Premium Filaments</h2>
                <p className="text-slate-400">High-quality materials for perfect prints every time.</p>
              </div>
              {!showAllFilaments && filaments.length > 8 && (
                <button onClick={() => setShowAllFilaments(true)} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors font-semibold cursor-pointer">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </Reveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : filaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filaments.slice(0, showAllFilaments ? filaments.length : 8).map((product, index) => (
                <Reveal key={product.id} delay={index * 0.05}>
                  <div className="glass-panel group flex flex-col h-full overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                    <Link to={`/product/${product.slug}`} className="block relative h-48 bg-white/5 p-4 overflow-hidden shrink-0">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <Link to={`/product/${product.slug}`} className="text-md font-bold text-white mb-1 hover:text-purple-400 line-clamp-2 transition-colors min-h-[3rem]">
                        {product.name}
                      </Link>
                      <span className="text-xs text-slate-400 mb-4 block">{product.subcategory_name || 'Filament'}</span>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 shrink-0">
                        <span className="text-lg font-bold text-white">₹{product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addItem(product)}
                          disabled={product.stock <= 0}
                          className="p-2.5 bg-white/5 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-purple-500"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-navy-800/50 rounded-2xl border border-dashed border-white/20">
              <Layers className="mx-auto h-16 w-16 text-slate-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Expanding Our Materials</h3>
              <p className="text-slate-400 max-w-md mx-auto">Our filament catalog is currently being updated with new colors and materials.</p>
            </div>
          )}
        </div>
      </section>

      {/* OTHER ACCESSORIES & PARTS */}
      {!loading && otherProducts.length > 0 && (
        <section className="pt-8 pb-16 relative overflow-hidden bg-navy-900 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal>
              <div className="mb-10 border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Parts & Accessories</h2>
                <p className="text-slate-400">Enhance and maintain your 3D printing setup.</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherProducts.slice(0, 4).map((product, index) => (
                <Reveal key={product.id} delay={index * 0.1}>
                   <div className="glass-panel p-4 flex items-center gap-4 hover:border-electric-blue/50 transition-colors h-full">
                     <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden shrink-0 p-2">
                       <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                     </div>
                     <div className="flex flex-col flex-grow">
                       <Link to={`/product/${product.slug}`} className="text-sm font-bold text-white hover:text-electric-blue line-clamp-2 min-h-[2.5rem]">
                         {product.name}
                       </Link>
                       <div className="text-electric-blue font-bold text-sm mt-1">₹{product.price.toFixed(2)}</div>
                     </div>
                   </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-navy-900 to-navy-950 border-t border-electric-blue/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-electric-blue/5 rounded-[100%] blur-[80px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">Need a Custom 3D Printing Solution?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">From industrial farm setups to specialized educational packages, our team is ready to design the perfect ecosystem for your needs.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="px-8 py-4 rounded-lg font-bold text-lg text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-center w-full sm:w-auto">
                Talk to an Expert
              </Link>
              <Link to="/shop" className="px-8 py-4 rounded-lg font-bold text-lg text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-center w-full sm:w-auto">
                Browse Full Catalog
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
