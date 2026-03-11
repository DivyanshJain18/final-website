import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArrowLeft, Check, Send } from 'lucide-react';
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

    setIsSubmitting(true);
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
    } catch (error) {
      console.error(error);
      alert('Failed to submit inquiry. Please try again.');
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
                <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-electric-blue uppercase bg-electric-blue/10 rounded-full mb-4 border border-electric-blue/20">
                  {product.category_name}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-bold text-white">₹{product.price.toFixed(2)}</span>
                  {product.stock > 0 ? (
                    <span className="ml-4 text-sm font-medium text-green-400 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      In Stock
                    </span>
                  ) : (
                    <span className="ml-4 text-sm font-medium text-red-400">Out of Stock</span>
                  )}
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
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
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
                      <label className="block text-sm font-medium text-slate-300 mb-1">Additional Message</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                        placeholder="Any specific requirements or questions?"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-glow w-full text-white py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center"
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>
                          Submit Request <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
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
