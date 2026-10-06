import { Product } from './productService';

const STORAGE_KEY = 'mechafy_recently_viewed';
const MAX_ITEMS = 12;

export interface RecentlyViewedItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  image_url: string;
  stock: number;
  sku?: string;
  category_name?: string;
  category_slug?: string;
  viewedAt: number;
}

/**
 * Record a product into Recently Viewed storage
 */
export function recordRecentlyViewed(product: Product): void {
  if (!product || (!product.slug && !product.id)) return;

  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    let items: RecentlyViewedItem[] = existingRaw ? JSON.parse(existingRaw) : [];

    const productId = product.id || product.slug;
    const productSlug = product.slug;

    // Filter out previous entry if existed so it moves to position 0
    items = items.filter(
      item => item.slug !== productSlug && item.id !== productId
    );

    const newItem: RecentlyViewedItem = {
      id: productId,
      name: product.name,
      slug: product.slug,
      description: product.description?.slice(0, 160) || '',
      price: product.price,
      originalPrice: product.originalPrice,
      image_url: product.image_url,
      stock: product.stock,
      sku: product.sku,
      category_name: product.category_name,
      category_slug: product.category_slug,
      viewedAt: Date.now()
    };

    items.unshift(newItem);

    if (items.length > MAX_ITEMS) {
      items = items.slice(0, MAX_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('mechafy:recently-viewed-updated'));
  } catch (err) {
    console.error('Failed to save recently viewed product', err);
  }
}

/**
 * Retrieve recently viewed products, optionally excluding a specific slug
 */
export function getRecentlyViewed(excludeSlug?: string): Product[] {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (!existingRaw) return [];
    
    let items: RecentlyViewedItem[] = JSON.parse(existingRaw);
    if (excludeSlug) {
      items = items.filter(item => item.slug !== excludeSlug);
    }

    return items.map(item => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      price: item.price,
      originalPrice: item.originalPrice,
      image_url: item.image_url,
      stock: item.stock,
      sku: item.sku,
      category_id: item.category_slug || 'hardware',
      category_name: item.category_name,
      category_slug: item.category_slug
    }));
  } catch (err) {
    console.error('Failed to parse recently viewed products', err);
    return [];
  }
}

/**
 * Clear recently viewed history
 */
export function clearRecentlyViewed(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('mechafy:recently-viewed-updated'));
  } catch (err) {
    console.error('Failed to clear recently viewed', err);
  }
}
