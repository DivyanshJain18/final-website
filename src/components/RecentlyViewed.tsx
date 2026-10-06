import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShoppingCart, Check, Trash2, ArrowRight } from 'lucide-react';
import { getRecentlyViewed, clearRecentlyViewed } from '../services/recentlyViewedService';
import { Product, getProductPath } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Reveal } from './Reveal';

interface RecentlyViewedProps {
  excludeSlug?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
}

export function RecentlyViewed({
  excludeSlug,
  title = "Recently Viewed",
  subtitle = "Pick up where you left off",
  limit = 6,
  className = ""
}: RecentlyViewedProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const { addToCart } = useCart();

  const loadItems = () => {
    const list = getRecentlyViewed(excludeSlug);
    setItems(list.slice(0, limit));
  };

  useEffect(() => {
    loadItems();

    const handleUpdate = () => {
      loadItems();
    };

    window.addEventListener('mechafy:recently-viewed-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('mechafy:recently-viewed-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [excludeSlug, limit]);

  if (items.length === 0) {
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
    const key = product.slug || product.id || '';
    setAddedMap(prev => ({ ...prev, [key]: true }));

    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <section aria-labelledby="recently-viewed-heading" className={`py-8 ${className}`}>
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-electric-blue/15 text-electric-blue">
                <Clock className="w-4 h-4" />
              </span>
              <h2 id="recently-viewed-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={() => clearRecentlyViewed()}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-white/5"
            title="Clear recently viewed history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {items.map((product) => {
            const key = product.slug || product.id || '';
            const isAdded = addedMap[key];

            return (
              <div 
                key={key}
                className="group relative flex flex-col glass-card rounded-2xl p-3 border border-white/10 hover:border-electric-blue/40 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] bg-navy-950/60 backdrop-blur-md"
              >
                {/* Link wrapper */}
                <Link 
                  to={getProductPath(product)} 
                  className="flex flex-col flex-1"
                  aria-label={`View ${product.name}`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-navy-900/80 mb-2.5 flex items-center justify-center p-2 border border-white/5">
                    <img
                      src={product.image_url || "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=400&q=80"}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {product.stock <= 0 && (
                      <span className="absolute top-2 left-2 text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        Enquire
                      </span>
                    )}
                  </div>

                  {/* Category tag */}
                  {product.category_name && (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 line-clamp-1">
                      {product.category_name}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-xs font-semibold text-white group-hover:text-electric-blue transition-colors line-clamp-2 leading-snug mb-2 flex-1">
                    {product.name}
                  </h3>

                  {/* Price Row */}
                  <div className="mt-auto pt-1 flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-white">
                      {product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'Contact'}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] text-slate-500 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Add To Cart Button */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    aria-label={`Add ${product.name} to cart`}
                    className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/10 hover:bg-electric-blue text-white hover:text-navy-950 border border-white/10'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/product/${product.slug}`}
                    aria-label={`View details for ${product.name}`}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="View details"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
