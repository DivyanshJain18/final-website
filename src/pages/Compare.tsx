import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { ArrowLeftRight, Trash2, ShoppingCart, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useState } from 'react';

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: any) => {
    addToCart(product);
    const key = product.id || product.slug;
    setAddedItemIds(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center space-x-2">
          <Link to="/" className="hover:text-electric-blue transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-electric-blue transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white font-medium">Product Comparison</span>
        </nav>

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-electric-blue/15 text-electric-blue border border-electric-blue/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <span>Product Comparison</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5">
              {compareList.length > 0 ? (
                <>Comparing <strong className="text-white">{compareList.length}</strong> of max 4 products side-by-side.</>
              ) : (
                'Select up to 4 products from our catalog to compare specifications, pricing, and availability.'
              )}
            </p>
          </div>

          {compareList.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="text-xs px-3.5 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
              <Link
                to="/shop"
                className="text-xs px-3.5 py-2 rounded-lg bg-electric-blue/15 hover:bg-electric-blue/30 text-electric-blue border border-electric-blue/30 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <span>Add More Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Empty State */}
        {compareList.length === 0 ? (
          <Reveal duration={0.4}>
            <div className="text-center py-20 px-4 glass-panel rounded-3xl border border-white/10 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <ArrowLeftRight className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Products to Compare</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Click the compare icon on any product page to compare items side-by-side and choose the perfect component for your build.
              </p>
              <Link
                to="/shop"
                className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-sm transition-all"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        ) : (
          /* Side-by-Side Comparison Table */
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 w-44 text-xs font-bold uppercase tracking-wider text-slate-400 bg-navy-950/60 sticky left-0 z-10 backdrop-blur-md">
                      Product
                    </th>
                    {compareList.map((product) => {
                      const key = product.id || product.slug;
                      return (
                        <th key={key} className="p-4 min-w-[240px] max-w-[280px] align-top text-left">
                          <div className="relative flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/10 group">
                            {/* Remove button */}
                            <button
                              onClick={() => removeFromCompare(key)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-navy-950/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                              title="Remove from comparison"
                              aria-label={`Remove ${product.name} from compare`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            <Link to={`/product/${product.slug}`} className="block relative w-36 h-36 mb-3 p-2 bg-white/5 rounded-lg overflow-hidden">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </Link>

                            <Link
                              to={`/product/${product.slug}`}
                              className="font-bold text-white hover:text-electric-blue text-sm line-clamp-2 transition-colors min-h-[2.5rem]"
                            >
                              {product.name}
                            </Link>

                            <div className="mt-3 flex items-center justify-center gap-2">
                              <span className="text-lg font-extrabold text-white">₹{product.price.toFixed(2)}</span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xs line-through text-slate-500">₹{product.originalPrice.toFixed(2)}</span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock <= 0}
                              className="mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold text-white btn-glow flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                            >
                              {addedItemIds[key] ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-green-400" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>Add to Cart</span>
                                </>
                              )}
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {/* SKU Row */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-slate-300 bg-navy-950/60 sticky left-0 z-10 backdrop-blur-md">
                      SKU
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id || product.slug} className="p-4 font-mono text-xs text-white">
                        {product.sku ? (
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{product.sku}</span>
                        ) : (
                          <span className="text-amber-400 text-xs italic">Unavailable</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Category Row */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-slate-300 bg-navy-950/60 sticky left-0 z-10 backdrop-blur-md">
                      Category
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id || product.slug} className="p-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-electric-blue/10 text-electric-blue text-xs border border-electric-blue/20">
                          {product.category_name || 'General'}
                        </span>
                        {product.subcategory_name && (
                          <span className="inline-block ml-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                            {product.subcategory_name}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Brand / Model */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-slate-300 bg-navy-950/60 sticky left-0 z-10 backdrop-blur-md">
                      Brand / Model
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id || product.slug} className="p-4 text-xs text-slate-200">
                        {product.brand ? (
                          <span>{product.brand} {product.model ? `(${product.model})` : ''}</span>
                        ) : (
                          <span className="text-slate-500">Mechafy Standard</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Stock Availability */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-slate-300 bg-navy-950/60 sticky left-0 z-10 backdrop-blur-md">
                      Availability
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id || product.slug} className="p-4 text-xs">
                        {product.stock > 0 ? (
                          <span className="text-green-400 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            In Stock ({product.stock} units)
                          </span>
                        ) : (
                          <span className="text-red-400 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Out of Stock
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Tax Text */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-slate-300 bg-navy-950/60 sticky left-0 z-10 backdrop-blur-md">
                      Taxes & Pricing
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id || product.slug} className="p-4 text-xs text-slate-400">
                        {product.taxText || 'Incl. GST (No Hidden Charges)'}
                      </td>
                    ))}
                  </tr>

                  {/* Description Overview */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-slate-300 bg-navy-950/60 sticky left-0 z-10 backdrop-blur-md align-top">
                      Description
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id || product.slug} className="p-4 text-xs text-slate-300 leading-relaxed align-top">
                        <p className="line-clamp-4">{product.description}</p>
                        <Link
                          to={`/product/${product.slug}`}
                          className="inline-block mt-2 text-electric-blue hover:underline font-medium"
                        >
                          View Full Specs &amp; Inquiry &rarr;
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
