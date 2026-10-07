import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowRight, ShieldCheck, Eye, Layers } from 'lucide-react';
import { Product, getProductPath } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  onQuickView
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const [isAdding, setIsAdding] = useState(false);

  const inWish = isInWishlist(product.id || product.slug);
  const inComp = isInCompare(product.id || product.slug);

  const productUrl = getProductPath(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 900);
  };

  const conditionColor = {
    'New': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Open Box': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Refurbished': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'Used': 'bg-slate-500/10 text-slate-300 border-slate-500/30'
  }[product.condition || 'New'] || 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  return (
    <div
      className={`group relative flex flex-col bg-gradient-to-b from-navy-900/90 to-navy-950/95 border border-white/10 hover:border-electric-blue/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 text-left overflow-hidden ${className}`}
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] bg-white/[0.02] border-b border-white/10 overflow-hidden flex items-center justify-center p-4">
        <Link to={productUrl} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-108"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Condition Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${conditionColor}`}>
            {product.condition || 'New'}
          </span>
          {product.stock <= 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
              Out of Stock
            </span>
          )}
        </div>

        {/* Top Right Quick Actions: Heart Wishlist Icon only, Compare, Quick View */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          {/* Wishlist Heart Icon only (No text!) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
            title={inWish ? 'Added to wishlist' : 'Add to wishlist'}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-200 cursor-pointer ${
              inWish
                ? 'bg-pink-500/25 text-pink-400 border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                : 'bg-navy-950/80 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 border-white/10'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-pink-500 text-pink-500' : ''}`} />
          </button>

          {/* Quick View */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick View"
              title="Quick View"
              className="p-2 rounded-xl bg-navy-950/80 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-200 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Compare toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product);
            }}
            aria-label={inComp ? 'Remove from compare' : 'Add to compare'}
            title={inComp ? 'In Comparison' : 'Compare Specification'}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-200 cursor-pointer ${
              inComp
                ? 'bg-electric-blue/25 text-electric-blue border-electric-blue/50 shadow-[0_0_12px_rgba(59,130,246,0.35)]'
                : 'bg-navy-950/80 text-slate-400 hover:text-white hover:bg-white/10 border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Structured Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Brand & Category row */}
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
          <span className="font-semibold text-electric-blue truncate max-w-[130px]">
            {product.brand || product.category_name || 'HARDWARE'}
          </span>
          {product.sku && (
            <span className="text-[10px] text-slate-500 truncate max-w-[100px]" title={product.sku}>
              #{product.sku}
            </span>
          )}
        </div>

        {/* Product Title */}
        <Link
          to={productUrl}
          className="text-sm sm:text-[15px] font-bold text-white hover:text-electric-blue line-clamp-2 leading-snug mb-2 transition-colors"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Technical Specification Chips / Snippet */}
        <div className="text-xs text-slate-400 mb-3 space-y-1">
          {product.specifications && product.specifications.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {product.specifications.slice(0, 3).map((spec, i) => (
                <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-slate-300">
                  {spec}
                </span>
              ))}
            </div>
          ) : (
            <p className="line-clamp-2 text-[11px] text-slate-400 leading-relaxed">
              {product.description || 'Enterprise-grade authentic engineering hardware with verified compliance.'}
            </p>
          )}
        </div>

        {/* Warranty & Availability Status */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 pt-2.5 border-t border-white/5">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-electric-blue" />
            <span>{product.warranty || 'Official Warranty'}</span>
          </span>
          <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {product.stock > 0 ? `${product.stock > 5 ? 'In Stock' : `Only ${product.stock} Left`}` : 'Backorder'}
          </span>
        </div>

        {/* Price & Primary CTA */}
        <div className="mt-auto pt-3 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs line-through text-slate-500 font-mono">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {product.taxText && (
                <span className="text-[10px] text-slate-500 block">{product.taxText}</span>
              )}
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & B2B Quote */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                product.stock <= 0
                  ? 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed'
                  : isAdding
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'bg-electric-blue hover:bg-blue-400 active:bg-blue-600 text-black shadow-[0_2px_10px_rgba(59,130,246,0.25)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.4)]'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Added' : 'Add to Cart'}</span>
            </button>

            <Link
              to={`/contact?subject=Bulk%20Quote%20Request%20-%20${encodeURIComponent(product.name)}&sku=${encodeURIComponent(product.sku || '')}`}
              className="py-2 px-3 text-xs font-semibold text-center uppercase tracking-wider rounded-xl text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Quote</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
