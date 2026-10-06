import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingCart, ArrowRight, Box, Check, ArrowLeft } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { Reveal } from '../components/Reveal';
import { useState } from 'react';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, items: cartItems } = useCart();
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: any) => {
    addToCart(product);
    const key = product.id || product.slug;
    setAddedItemIds(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const isItemInCart = (productId: string | number) => {
    return cartItems.some(i => i.id === productId);
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center space-x-2">
          <Link to="/" className="hover:text-electric-blue transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-electric-blue transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white font-medium">My Wishlist</span>
        </nav>

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Heart className="w-7 h-7 text-pink-500 fill-pink-500/30" />
              <span>My Wishlist</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {wishlist.length > 0 ? (
                <>You have <strong className="text-white">{wishlist.length}</strong> {wishlist.length === 1 ? 'item' : 'items'} saved for later.</>
              ) : (
                'Save items you want to purchase or request a quote for later.'
              )}
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Wishlist</span>
              </button>
              <Link
                to="/shop"
                className="text-xs px-3 py-2 rounded-lg bg-electric-blue/15 hover:bg-electric-blue/30 text-electric-blue border border-electric-blue/30 transition-colors flex items-center gap-1.5 font-medium"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Wishlist Items List */}
        {wishlist.length === 0 ? (
          /* Empty State */
          <Reveal duration={0.4}>
            <div className="text-center py-20 px-4 glass-panel rounded-3xl border border-white/10 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                <Heart className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Save products you love and come back to them later. Browse our wide selection of microcontrollers, robotics, 3D printers, and PC components!
              </p>
              <Link
                to="/shop"
                className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-sm transition-all"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.06}>
            {wishlist.map(product => {
              const key = product.id || product.slug;
              const isAdded = addedItemIds[key];
              const inCart = isItemInCart(product.id || '');

              return (
                <StaggerItem key={key}>
                  <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group hover:border-pink-500/30 transition-all duration-300">
                    {/* Image Area */}
                    <div className="relative h-52 bg-white/[0.02] border-b border-white/5 p-4 flex items-center justify-center overflow-hidden">
                      <Link to={`/product/${product.slug}`} className="flex items-center justify-center w-full h-full">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Box className="w-12 h-12" />
                          </div>
                        )}
                      </Link>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(product.id || product.slug)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-navy-950/80 hover:bg-rose-500 text-slate-300 hover:text-white border border-white/15 backdrop-blur-md transition-all shadow-md cursor-pointer"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Stock Status */}
                      <div className="absolute top-3 left-3">
                        {product.stock > 0 ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="text-xs font-semibold uppercase tracking-wider text-electric-blue mb-1">
                        {product.category_name || 'Hardware'}
                      </div>

                      <Link
                        to={`/product/${product.slug}`}
                        className="text-base font-bold text-white mb-2 hover:text-pink-400 line-clamp-2 transition-colors"
                      >
                        {product.name}
                      </Link>

                      {product.sku && (
                        <p className="text-[11px] text-slate-500 font-mono mb-2">SKU: {product.sku}</p>
                      )}

                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Price Section */}
                      <div className="mt-auto pt-4 border-t border-white/10">
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs line-through text-slate-500">₹{product.originalPrice.toFixed(2)}</span>
                            <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              SAVE ₹{(product.originalPrice - product.price).toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-baseline justify-between mb-4">
                          <div>
                            <span className="text-xl font-extrabold text-white">₹{product.price.toFixed(2)}</span>
                            {product.unit && <span className="text-xs text-slate-400 ml-1">/ {product.unit}</span>}
                          </div>
                        </div>

                        {/* Action Buttons: Add to Cart & View Product */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-500 text-white'
                                : inCart
                                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                : 'btn-glow text-white'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>{inCart ? 'Add More' : 'Add to Cart'}</span>
                              </>
                            )}
                          </button>

                          <Link
                            to={`/product/${product.slug}`}
                            className="py-2 px-3 rounded-xl text-xs font-semibold text-center text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </Layout>
  );
}
