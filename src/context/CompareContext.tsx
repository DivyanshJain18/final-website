import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../services/productService';

interface CompareContextType {
  compareList: Product[];
  isInCompare: (productId: string | undefined) => boolean;
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string | undefined) => void;
  toggleCompare: (product: Product) => { added: boolean; limitReached?: boolean };
  clearCompare: () => void;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_STORAGE_KEY = 'mechafy_compare_products';
const MAX_COMPARE_ITEMS = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (saved) {
        setCompareList(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load compare items from localStorage', e);
      setCompareList([]);
    }
  }, []);

  // Save to localStorage whenever compareList changes
  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
    } catch (e) {
      console.error('Failed to save compare items to localStorage', e);
    }
  }, [compareList]);

  const isInCompare = (productId: string | undefined): boolean => {
    if (!productId) return false;
    return compareList.some(item => item.id === productId || item.slug === productId);
  };

  const addToCompare = (product: Product): boolean => {
    if (!product) return false;
    const prodId = product.id || product.slug;
    if (isInCompare(prodId)) return true;

    if (compareList.length >= MAX_COMPARE_ITEMS) {
      return false; // Limit reached
    }

    setCompareList(prev => [...prev, product]);
    return true;
  };

  const removeFromCompare = (productId: string | undefined) => {
    if (!productId) return;
    setCompareList(prev => prev.filter(item => item.id !== productId && item.slug !== productId));
  };

  const toggleCompare = (product: Product): { added: boolean; limitReached?: boolean } => {
    if (!product) return { added: false };
    const prodId = product.id || product.slug;
    if (isInCompare(prodId)) {
      removeFromCompare(prodId);
      return { added: false };
    } else {
      if (compareList.length >= MAX_COMPARE_ITEMS) {
        return { added: false, limitReached: true };
      }
      setCompareList(prev => [...prev, product]);
      return { added: true };
    }
  };

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isInCompare,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        compareCount: compareList.length
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
