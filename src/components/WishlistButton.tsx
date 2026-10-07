import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../services/productService';

interface WishlistButtonProps {
  product: Product;
  variant?: 'card' | 'page' | 'icon';
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  variant = 'card',
  className = ''
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id || product.slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  if (variant === 'page') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={active ? 'Remove from Wishlist' : 'Add to Wishlist'}
        className={`w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border shadow-sm ${
          active
            ? 'bg-pink-500/15 border-pink-500/40 text-pink-400 hover:bg-pink-500/25 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
            : 'bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10 hover:border-pink-500/30'
        } ${className}`}
      >
        <Heart
          className={`w-5 h-5 transition-transform duration-200 ${
            active ? 'fill-pink-500 text-pink-500 scale-110' : 'text-slate-400 hover:text-pink-400'
          }`}
        />
        <span>{active ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}</span>
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={active ? 'Remove from Wishlist' : 'Add to Wishlist'}
        title={active ? 'Added to Wishlist' : 'Add to Wishlist'}
        className={`inline-flex items-center justify-center p-3 rounded-xl backdrop-blur-md transition-all duration-200 border ${
          active
            ? 'bg-pink-500/20 text-pink-400 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
            : 'bg-navy-950/80 hover:bg-pink-500/15 text-slate-300 hover:text-pink-400 border-white/15'
        } ${className}`}
      >
        <Heart
          className={`w-5 h-5 transition-transform duration-200 ${
            active ? 'fill-pink-500 text-pink-500 scale-110' : ''
          }`}
        />
      </button>
    );
  }

  // Default 'card' variant: clean, compact heart icon button without text overlay
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Remove from Wishlist' : 'Add to Wishlist'}
      title={active ? 'Added to Wishlist' : 'Add to Wishlist'}
      className={`group/wish p-2 rounded-lg border backdrop-blur-md transition-all duration-200 flex items-center justify-center ${
        active
          ? 'bg-pink-500/25 border-pink-500/50 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.35)]'
          : 'bg-navy-950/85 border-white/15 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/30 shadow-sm'
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-200 group-hover/wish:scale-110 ${
          active ? 'fill-pink-500 text-pink-500' : 'text-slate-400 group-hover/wish:text-pink-400'
        }`}
      />
    </button>
  );
};
