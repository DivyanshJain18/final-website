import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArrowLeft, Check, Send, Package, Building2, Zap } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { fetchProductBySlug, submitInquiry, Product } from '../services/productService';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug)
        .then(data => {
          setProduct(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Validate that at least one of email or phone is provided
    if (!clientEmail.trim() && !clientPhone.trim()) {
      setError('Please provide either an email address or a phone number so we can reach you.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await submitInquiry({
        productId: product.id,
        productName: product.name,
        clientName,
        clientEmail,
        clientPhone,
        quantity,
        message
      });

      setSubmitted(true);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setMessage('');
      setQuantity(1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-8 glass-panel w-1/3 mb-8 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 glass-panel rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 glass-panel w-3/4 rounded"></div>
              <div className="h-4 glass-panel w-1/2 rounded"></div>
              <div className="h-32 glass-panel rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-electric-blue hover:underline">Back to Shop</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <Link to="/shop" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Info */}
          <Reveal width="100%">
            <div className="space-y-8">
              <div className="glass-panel overflow-hidden p-8 flex items-center justify-center">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="max-w-full max-h-96 object-contain rounded-lg hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-electric-blue uppercase bg-electric-blue/10 rounded-full border border-electric-blue/20">
                    {product.category_name}
                  </span>
                  {product.subcategory_name && (
                    <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-purple-400 uppercase bg-purple-500/10 rounded-full border border-purple-500/20">
                      {product.subcategory_name}
                    </span>
                  )}
                  {product.subsubcategory_name && (
                    <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-pink-400 uppercase bg-pink-500/10 rounded-full border border-pink-500/20">
                      {product.subsubcategory_name}
                    </span>
                  )}
                  {product.nested_subcategory_name && (
                    <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-amber-400 uppercase bg-amber-500/10 rounded-full border border-amber-500/20">
                      {product.nested_subcategory_name}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>
                <div className="mb-6">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg line-through text-slate-500">₹{product.originalPrice.toFixed(2)}</span>
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/20">
                        SAVE RS. {(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">₹{product.price.toFixed(2)}</span>
                    {product.unit && <span className="text-lg text-slate-400 mb-1">/ {product.unit}</span>}
                  </div>
                  {product.taxText && (
                    <p className="text-sm text-slate-500 mt-2">{product.taxText}</p>
                  )}
                  
                  <div className="mt-4 flex items-center">
                    {product.stock > 0 ? (
                      <span className="text-sm font-medium text-green-400 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        In Stock
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-red-400">Out of Stock</span>
                    )}
                  </div>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Inquiry Form */}
          <Reveal width="100%" delay={0.2}>
            <div className="glass-panel p-8 h-fit sticky top-24">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <Check className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Request Sent!</h2>
                  <p className="text-slate-400 mb-6">
                    Thank you for your inquiry. Our team will review your request and get back to you shortly with a quote.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-electric-blue font-medium hover:underline"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2">Request a Quote</h2>
                  <p className="text-slate-400 mb-6 text-sm">
                    Fill out the form below to request pricing and availability for this product.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-900/20 text-red-400 p-4 rounded-lg text-sm border border-red-800">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Additional Message (Optional)</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                        placeholder="Any specific requirements or questions?"
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-glow flex-1 text-white py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center"
                      >
                        {isSubmitting ? 'Sending...' : (
                          <>
                            Submit Request <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </button>
                      
                      <a
                        href={`https://wa.me/919817056538?text=Hi%20Mechafy%20Global,%20I%20would%20like%20to%20request%20a%20quote%20for%20${quantity}%20units%20of%20${encodeURIComponent(product.name)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                        WhatsApp Quote
                      </a>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-4 h-4" />
                        <span>Bulk Volume Discounts</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        <span>GST Billing Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4" />
                        <span>24-Hour Custom Pricing</span>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
