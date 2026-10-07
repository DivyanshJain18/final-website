import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { 
  ArrowLeft, ArrowRight, Check, Send, Package, Building2, Zap, 
  Heart, ArrowLeftRight, MapPin, 
  ShoppingCart, Minus, Plus, X 
} from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { fetchProductBySlug, submitInquiry, Product } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { ProductWhatsAppEnquiry } from '../components/ProductWhatsAppEnquiry';
import { getProductWhatsAppUrl } from '../services/whatsappService';
import { FrequentlyBoughtTogether } from '../components/FrequentlyBoughtTogether';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { recordRecentlyViewed } from '../services/recentlyViewedService';
import { SEO } from '../components/SEO';
import { Breadcrumb, generateBreadcrumbSchema, BreadcrumbItem } from '../components/Breadcrumb';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist: contextToggleWishlist, wishlistCount } = useWishlist();
  const { isInCompare, toggleCompare: contextToggleCompare, compareCount } = useCompare();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Purchase controls state
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Notification message / toast state for wishlist & compare
  const [toast, setToast] = useState<{
    type: 'wishlist' | 'compare';
    action: 'added' | 'removed' | 'limit';
    message: string;
  } | null>(null);

  // Delivery PIN code checker state
  const [pincode, setPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ pincode: string } | null>(null);

  // Inquiry Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug)
        .then(data => {
          setProduct(data);
          if (data) {
            recordRecentlyViewed(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [slug]);

  // Auto-dismiss toast notification after 4.5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const isWishlisted = product ? isInWishlist(product.id || product.slug) : false;
  const isCompared = product ? isInCompare(product.id || product.slug) : false;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    const willBeAdded = !isWishlisted;
    contextToggleWishlist(product);

    setToast({
      type: 'wishlist',
      action: willBeAdded ? 'added' : 'removed',
      message: willBeAdded
        ? 'Product added to wishlist'
        : 'Product removed from wishlist'
    });
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    const result = contextToggleCompare(product);

    if (result.limitReached) {
      setToast({
        type: 'compare',
        action: 'limit',
        message: 'Comparison limit reached (max 4 products)'
      });
    } else if (result.added) {
      setToast({
        type: 'compare',
        action: 'added',
        message: 'Product added to compare'
      });
    } else {
      setToast({
        type: 'compare',
        action: 'removed',
        message: 'Product removed from compare'
      });
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);
    if (pincodeError) setPincodeError('');
    if (pincodeResult) setPincodeResult(null);
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = pincode.trim();
    if (!trimmed) {
      setPincodeError('Please enter a 6-digit Indian PIN code.');
      setPincodeResult(null);
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(trimmed)) {
      setPincodeError('Invalid PIN code. Please enter a valid 6-digit Indian postal code (e.g. 110001).');
      setPincodeResult(null);
      return;
    }

    setPincodeError('');
    setPincodeResult({ pincode: trimmed });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

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
        productSku: product.sku || null,
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
    <Layout showAnnouncement={true}>
      {/* Prominent Floating Toast Notification (when Wishlist or Compare is clicked) */}
      {toast && (
        <div 
          className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200"
          role="status"
          aria-live="polite"
        >
          <div 
            className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-sm ${
              toast.type === 'wishlist'
                ? 'bg-navy-950/95 border-pink-500/50 text-white shadow-[0_10px_30px_rgba(236,72,153,0.3)]'
                : toast.action === 'limit'
                ? 'bg-navy-950/95 border-amber-500/50 text-white shadow-[0_10px_30px_rgba(245,158,11,0.25)]'
                : 'bg-navy-950/95 border-electric-blue/50 text-white shadow-[0_10px_30px_rgba(59,130,246,0.3)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${
                toast.type === 'wishlist' ? 'bg-pink-500/20 text-pink-400' : 'bg-electric-blue/20 text-electric-blue'
              }`}>
                {toast.type === 'wishlist' ? (
                  <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                ) : (
                  <ArrowLeftRight className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-bold text-white text-xs sm:text-sm">{toast.message}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {toast.type === 'wishlist' ? 'Saved to your personal collection' : 'Added to side-by-side comparison'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.type === 'wishlist' ? (
                <Link
                  to="/wishlist"
                  className="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs transition-colors shadow-md whitespace-nowrap cursor-pointer"
                >
                  View Wishlist &rarr;
                </Link>
              ) : (
                <Link
                  to="/compare"
                  className="px-3 py-1.5 rounded-lg bg-electric-blue hover:bg-cyan-400 text-navy-950 font-bold text-xs transition-colors shadow-md whitespace-nowrap cursor-pointer"
                >
                  View Compare &rarr;
                </Link>
              )}
              <button
                onClick={() => setToast(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Dynamic SEO & Schema.org Product / Breadcrumb JSON-LD */}
        {(() => {
          const breadcrumbs: BreadcrumbItem[] = [
            { name: 'Shop', url: '/shop' },
            ...(product.category_name ? [{ 
              name: product.category_name, 
              url: `/shop?category=${encodeURIComponent(product.category_slug || product.category_name.toLowerCase())}` 
            }] : []),
            ...(product.subcategory_name ? [{ 
              name: product.subcategory_name, 
              url: `/shop?subcategory=${encodeURIComponent(product.subcategory_slug || product.subcategory_name.toLowerCase())}` 
            }] : []),
            { name: product.name }
          ];

          const productSchema = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.image_url ? [product.image_url] : [],
            description: product.description || `${product.name} available at Mechafy Global. Genuine components with verified quality.`,
            sku: product.sku || product.id,
            mpn: product.model || product.sku || product.id,
            brand: {
              '@type': 'Brand',
              name: product.brand || 'Mechafy'
            },
            offers: {
              '@type': 'Offer',
              url: typeof window !== 'undefined' ? window.location.href : `https://www.mechafyglobal.com/product/${product.slug}`,
              priceCurrency: 'INR',
              price: product.price,
              priceValidUntil: '2027-12-31',
              itemCondition: 'https://schema.org/NewCondition',
              availability: product.stock > 0 
                ? 'https://schema.org/InStock' 
                : 'https://schema.org/OutOfStock',
              seller: {
                '@type': 'Organization',
                name: 'Mechafy Global'
              }
            }
          };

          const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

          return (
            <>
              <SEO 
                title={`${product.name} | Buy Online at Best Price`}
                description={product.description?.slice(0, 155) || `Buy ${product.name} online at Mechafy Global. Fast shipping across India, authentic robotics, 3D printers, and PC hardware.`}
                canonicalPath={`/product/${product.slug}`}
                type="product"
                image={product.image_url}
                keywords={[
                  product.name,
                  product.category_name || '',
                  product.brand || '',
                  product.sku || '',
                  'Mechafy Global',
                  'Buy online India'
                ].filter(Boolean)}
                structuredData={[productSchema, breadcrumbSchema]}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Breadcrumb items={breadcrumbs} />
                <Link to="/shop" className="inline-flex items-center text-xs text-slate-400 hover:text-electric-blue transition-colors self-start sm:self-auto">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Catalogue
                </Link>
              </div>
            </>
          );
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Info Column */}
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

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{product.name}</h1>

                {/* SKU, Brand, Condition & Warranty Display */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-5">
                  {/* Condition Badge - Never hidden */}
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${
                    (product.condition || 'New') === 'New'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : (product.condition === 'Open Box')
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : (product.condition === 'Refurbished')
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                      : 'bg-slate-500/10 text-slate-300 border-slate-500/30'
                  }`}>
                    Condition: {product.condition || 'New'}
                  </span>

                  {product.brand && (
                    <span className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                      Brand: <strong className="text-white">{product.brand}</strong>
                    </span>
                  )}

                  {product.warranty && (
                    <span className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                      Warranty: <strong className="text-electric-blue">{product.warranty}</strong>
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-slate-400">SKU:</span>
                    {product.sku ? (
                      <span className="font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/10 font-semibold">
                        {product.sku}
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium italic">
                        MFG-GEN
                      </span>
                    )}
                  </div>
                </div>

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
                  
                  {/* Availability / Stock Status */}
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

                  {/* Bulk Orders / B2B Email Directly Under Availability */}
                  <div className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                    For bulk orders or B2B inquiries, email us:{' '}
                    <a 
                      href="mailto:sales@mechafyglobal.com" 
                      className="text-electric-blue hover:underline font-medium break-all"
                    >
                      sales@mechafyglobal.com
                    </a>
                  </div>
                </div>

                <p className="text-slate-300 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Purchase & Inquiry Section */}
          <Reveal width="100%" delay={0.2}>
            <div className="glass-panel p-8 h-fit sticky top-24 space-y-6">
              
              {/* Notification Banner / Toast when Wishlist or Compare is clicked */}
              {toast && (
                <div 
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all duration-200 animate-in fade-in slide-in-from-top-2 shadow-lg ${
                    toast.type === 'wishlist'
                      ? 'bg-pink-950/90 border-pink-500/40 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
                      : toast.action === 'limit'
                      ? 'bg-amber-950/90 border-amber-500/40 text-amber-100'
                      : 'bg-navy-950/95 border-electric-blue/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-2.5">
                    {toast.type === 'wishlist' ? (
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400 shrink-0" />
                    ) : (
                      <ArrowLeftRight className="w-4 h-4 text-electric-blue shrink-0" />
                    )}
                    <span className="font-semibold">{toast.message}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {toast.type === 'wishlist' ? (
                      <Link
                        to="/wishlist"
                        className="px-2.5 py-1 rounded-md bg-pink-500 text-white font-bold text-[11px] hover:bg-pink-400 transition-colors"
                      >
                        View Wishlist &rarr;
                      </Link>
                    ) : (
                      <Link
                        to="/compare"
                        className="px-2.5 py-1 rounded-md bg-electric-blue text-navy-950 font-bold text-[11px] hover:bg-cyan-400 transition-colors"
                      >
                        View Compare &rarr;
                      </Link>
                    )}
                    <button
                      onClick={() => setToast(null)}
                      className="p-1 hover:bg-white/10 rounded cursor-pointer text-slate-400 hover:text-white transition-colors"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Purchase Controls Area */}
              <div className="space-y-4 pb-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quantity</span>
                  <span className="text-xs text-slate-400">
                    Total: <span className="text-white font-bold">₹{(product.price * quantity).toFixed(2)}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden h-12">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 h-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock > 0 ? product.stock : 999}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1) setQuantity(val);
                      }}
                      className="w-14 h-full bg-transparent text-center text-white font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      aria-label="Product quantity"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 h-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wishlist Heart Icon (Heart Icon ONLY, toggle state, keyboard accessible) */}
                  <button
                    type="button"
                    onClick={handleWishlistClick}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      isWishlisted
                        ? "bg-red-500/15 border-red-500/50 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    <Heart className={`w-5 h-5 transition-transform ${isWishlisted ? "fill-red-500 text-red-500 scale-110" : ""}`} />
                  </button>

                  {/* Compare Products Icon (Icon ONLY, toggle state, accessible) */}
                  <button
                    type="button"
                    onClick={handleCompareClick}
                    aria-label={isCompared ? "Remove from compare" : "Add to compare"}
                    title={isCompared ? "Remove from compare" : "Add to compare"}
                    className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      isCompared
                        ? "bg-electric-blue/20 border-electric-blue text-electric-blue shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                        : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    <ArrowLeftRight className={`w-5 h-5 transition-transform ${isCompared ? "scale-110 text-electric-blue" : ""}`} />
                  </button>
                </div>

                {/* Where person can see wishlist & compare list */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <Link
                    to="/wishlist"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition-all font-semibold cursor-pointer"
                    title="View all saved items in My Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-pink-400'}`} />
                    <span>View Wishlist ({wishlistCount}) &rarr;</span>
                  </Link>
                  <Link
                    to="/compare"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-electric-blue/10 hover:bg-electric-blue/20 text-blue-300 border border-electric-blue/30 transition-all font-semibold cursor-pointer"
                    title="View side-by-side product comparison"
                  >
                    <ArrowLeftRight className={`w-3.5 h-3.5 ${isCompared ? 'text-electric-blue' : 'text-slate-400'}`} />
                    <span>View Compare ({compareCount}) &rarr;</span>
                  </Link>
                </div>

                {/* Purchase Buttons: Add to Cart & Buy Now */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="btn-glow py-3 px-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {addedFeedback ? "Added to Cart!" : "Add to Cart"}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Zap className="w-5 h-5" />
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Delivery PIN Code Checker */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <MapPin className="w-4 h-4 text-electric-blue" />
                  <span>Check estimated delivery</span>
                </div>

                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={pincode}
                    onChange={handlePincodeChange}
                    placeholder="Enter 6-digit pincode"
                    className="flex-1 px-3.5 py-2.5 bg-navy-950/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm text-navy-950 bg-electric-blue hover:bg-cyan-400 transition-colors cursor-pointer shrink-0"
                  >
                    Check
                  </button>
                </form>

                {pincodeError && (
                  <p className="text-xs text-red-400 font-medium">{pincodeError}</p>
                )}

                {pincodeResult && (
                  <div className="p-3 bg-navy-950/80 border border-white/10 rounded-xl text-xs space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      PIN Code: <span className="font-mono text-cyan-300">{pincodeResult.pincode}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Delivery serviceability and courier transit schedules for this location are confirmed directly with our dispatch team upon order placement.
                    </p>
                    <p className="text-slate-400">
                      For immediate dispatch estimates or express delivery options, contact our sales team at{' '}
                      <a href="mailto:sales@mechafyglobal.com" className="text-electric-blue hover:underline">sales@mechafyglobal.com</a>{' '}
                      or WhatsApp{' '}
                      <a href="https://wa.me/919817056538" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">+91 9817056538</a>.
                    </p>
                  </div>
                )}
              </div>

              {/* Contextual WhatsApp Product Inquiry (Phase 9) */}
              <ProductWhatsAppEnquiry 
                product={product} 
                quantity={quantity} 
              />

              {/* Inquiry & WhatsApp Quote */}
              <div className="pt-2 border-t border-white/10">
                {submitted ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/30">
                      <Check className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Request Sent!</h2>
                    <p className="text-slate-400 mb-4 text-xs">
                      Thank you for your inquiry. Our team will review your request and get back to you shortly with a quote.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-electric-blue text-sm font-medium hover:underline cursor-pointer"
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-white mb-1">Request a Custom Quote</h2>
                    <p className="text-slate-400 mb-4 text-xs">
                      Fill out the form below or connect via WhatsApp for high-volume orders and specialized B2B pricing.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-xs border border-red-800">
                          {error}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Inquiry Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Additional Message (Optional)</label>
                        <textarea
                          rows={2}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                          placeholder="Any specific technical requirements or delivery notes?"
                        ></textarea>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-glow flex-1 text-white py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center cursor-pointer text-sm"
                        >
                          {isSubmitting ? 'Sending...' : (
                            <>
                              Submit Request <Send className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </button>
                        
                        <a
                          href={getProductWhatsAppUrl({
                            productName: product.name,
                            sku: product.sku,
                            quantity,
                            type: 'bulk_quote'
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 transition-colors text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                          </svg>
                          WhatsApp Quote
                        </a>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {product && (
        <div className="max-w-6xl mx-auto">
          <FrequentlyBoughtTogether currentProduct={product} />
        </div>
      )}

      {/* Recently Viewed Products */}
      {product && (
        <div className="max-w-6xl mx-auto">
          <RecentlyViewed 
            excludeSlug={product.slug} 
            title="Recently Viewed Products" 
            subtitle="Pick up where you left off" 
            limit={6} 
          />
        </div>
      )}

      {/* Floating Bottom Quick Access Bar for Wishlist & Compare */}
      {(wishlistCount > 0 || compareCount > 0) && (
        <aside 
          aria-label="Wishlist and Compare quick access"
          className="fixed bottom-5 left-5 z-40 bg-navy-950/95 border border-white/15 rounded-2xl shadow-2xl p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200"
        >
          {wishlistCount > 0 && (
            <Link
              to="/wishlist"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-200 text-xs font-bold transition-colors cursor-pointer"
              title="View your saved Wishlist items"
            >
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
          )}

          {compareCount > 0 && (
            <Link
              to="/compare"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-electric-blue hover:bg-cyan-400 text-navy-950 text-xs font-bold transition-colors shadow-sm cursor-pointer"
              title="View compared products side-by-side"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Compare ({compareCount})</span>
            </Link>
          )}
        </aside>
      )}
    </Layout>
  );
}
