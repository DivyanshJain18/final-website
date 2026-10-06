import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../services/productService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: string | undefined) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string | undefined) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'mechafy_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { user } = useAuth();

  // Load wishlist from local storage on mount or user change
  useEffect(() => {
    const storageKey = user ? `${WISHLIST_STORAGE_KEY}_${user.id}` : WISHLIST_STORAGE_KEY;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage', e);
        setWishlist([]);
      }
    } else if (user) {
      // If user logs in and user key is empty, check guest wishlist and migrate
      const guestSaved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (guestSaved) {
        try {
          const parsed = JSON.parse(guestSaved);
          setWishlist(parsed);
          localStorage.setItem(storageKey, guestSaved);
        } catch (e) {
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Save to local storage on change
  useEffect(() => {
    const storageKey = user ? `${WISHLIST_STORAGE_KEY}_${user.id}` : WISHLIST_STORAGE_KEY;
    localStorage.setItem(storageKey, JSON.stringify(wishlist));
  }, [wishlist, user]);

  const isInWishlist = (productId: string | undefined): boolean => {
    if (!productId) return false;
    return wishlist.some(item => (item.id === productId || item.slug === productId));
  };

  const addToWishlist = (product: Product) => {
    if (!product || (!product.id && !product.slug)) return;
    setWishlist(prev => {
      if (prev.some(item => (product.id && item.id === product.id) || (product.slug && item.slug === product.slug))) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string | undefined) => {
    if (!productId) return;
    setWishlist(prev => prev.filter(item => item.id !== productId && item.slug !== productId));
  };

  const toggleWishlist = (product: Product) => {
    if (!product) return;
    const prodId = product.id || product.slug;
    if (isInWishlist(prodId)) {
      removeFromWishlist(prodId);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
