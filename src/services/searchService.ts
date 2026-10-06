import { Product, Category, Subcategory, Subsubcategory, NestedSubcategory } from './productService';

export interface SearchMatch {
  product: Product;
  score: number;
  matchedFields: string[];
}

export interface SearchFilterOptions {
  categorySlug?: string;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest';
}

/**
 * Normalizes text: trims, lowercases, replaces multiple whitespaces and cleans punctuation
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Breaks query into distinct non-empty search tokens
 */
export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  return normalized.split(' ').filter(token => token.length > 0);
}

/**
 * Calculates a match score for a product against a search query
 */
export function scoreProduct(product: Product, query: string, tokens: string[]): { score: number; matchedFields: string[] } {
  if (!query || tokens.length === 0) return { score: 0, matchedFields: [] };

  const normQuery = normalizeSearchText(query);
  const matchedFields: string[] = [];
  let score = 0;

  const idNorm = normalizeSearchText(product.id || '');
  const skuNorm = normalizeSearchText((product as any).sku || '');
  const nameNorm = normalizeSearchText(product.name || '');
  const brandNorm = normalizeSearchText((product as any).brand || '');
  const modelNorm = normalizeSearchText((product as any).model || '');
  const catNorm = normalizeSearchText(product.category_name || '');
  const subcatNorm = normalizeSearchText(product.subcategory_name || '');
  const descNorm = normalizeSearchText(product.description || '');

  // 1. Exact SKU or Product ID match (Highest priority)
  if (skuNorm && (skuNorm === normQuery || tokens.includes(skuNorm))) {
    score += 150;
    matchedFields.push('sku');
  }
  if (idNorm && (idNorm === normQuery || idNorm.toLowerCase() === query.trim().toLowerCase())) {
    score += 140;
    matchedFields.push('id');
  }

  // 2. Exact or Starts-With Product Name Match
  if (nameNorm === normQuery) {
    score += 120;
    matchedFields.push('name');
  } else if (nameNorm.startsWith(normQuery)) {
    score += 100;
    matchedFields.push('name');
  } else if (nameNorm.includes(normQuery)) {
    score += 80;
    matchedFields.push('name');
  }

  // 3. Exact Brand / Model match
  if (brandNorm && (brandNorm === normQuery || brandNorm.includes(normQuery))) {
    score += 70;
    matchedFields.push('brand');
  }
  if (modelNorm && (modelNorm === normQuery || modelNorm.includes(normQuery))) {
    score += 75;
    matchedFields.push('model');
  }

  // 4. Token-by-token matching across fields
  let allTokensInName = true;
  let allTokensInProduct = true;
  let tokensMatchedCount = 0;

  const combinedSearchSpace = `${nameNorm} ${brandNorm} ${modelNorm} ${catNorm} ${subcatNorm} ${skuNorm} ${descNorm}`;

  for (const token of tokens) {
    let tokenFoundInAny = false;

    if (nameNorm.includes(token)) {
      score += 25;
      tokenFoundInAny = true;
      if (!matchedFields.includes('name')) matchedFields.push('name');
    } else {
      allTokensInName = false;
    }

    if (brandNorm.includes(token) || modelNorm.includes(token)) {
      score += 20;
      tokenFoundInAny = true;
      if (!matchedFields.includes('brand/model')) matchedFields.push('brand/model');
    }

    if (catNorm.includes(token) || subcatNorm.includes(token)) {
      score += 15;
      tokenFoundInAny = true;
      if (!matchedFields.includes('category')) matchedFields.push('category');
    }

    if (descNorm.includes(token)) {
      score += 8;
      tokenFoundInAny = true;
      if (!matchedFields.includes('description')) matchedFields.push('description');
    }

    if (tokenFoundInAny) {
      tokensMatchedCount++;
    } else {
      allTokensInProduct = false;
    }
  }

  // Bonus when all search tokens are found in product name or anywhere in the product
  if (allTokensInName && tokens.length > 1) {
    score += 50;
  } else if (allTokensInProduct && tokens.length > 1) {
    score += 30;
  }

  // If none of the tokens matched at all, score is 0
  if (tokensMatchedCount === 0 && score === 0) {
    return { score: 0, matchedFields: [] };
  }

  // Boost in-stock products slightly when scores are otherwise tied
  if (product.stock > 0) {
    score += 2;
  }

  return { score, matchedFields };
}

/**
 * In-memory cache for products with 60s TTL to prevent redundant Firestore calls
 */
let cachedProducts: Product[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function setProductsCache(products: Product[]): void {
  cachedProducts = products;
  lastCacheTime = Date.now();
}

export function getProductsCache(): Product[] | null {
  if (cachedProducts && Date.now() - lastCacheTime < CACHE_TTL_MS) {
    return cachedProducts;
  }
  return null;
}

export function clearProductsCache(): void {
  cachedProducts = null;
  lastCacheTime = 0;
}

/**
 * Searches and ranks products based on query and filter options
 */
export function executeSearch(
  products: Product[],
  rawQuery: string,
  options: SearchFilterOptions = {}
): { results: Product[]; totalMatches: number } {
  const query = rawQuery.trim();
  const tokens = tokenizeQuery(query);

  let scored: SearchMatch[] = [];

  if (query.length > 0) {
    for (const product of products) {
      const { score, matchedFields } = scoreProduct(product, query, tokens);
      if (score > 0) {
        scored.push({ product, score, matchedFields });
      }
    }
    // Sort by score descending (Relevance)
    scored.sort((a, b) => b.score - a.score);
  } else {
    // If no query, return all products with score 1
    scored = products.map(product => ({ product, score: 1, matchedFields: [] }));
  }

  // Apply filters
  let filtered = scored;

  // Category filter
  if (options.categorySlug) {
    const slug = options.categorySlug.toLowerCase();
    filtered = filtered.filter(item => {
      const catSlug = (item.product as any).category_slug?.toLowerCase() || '';
      const catName = item.product.category_name?.toLowerCase().replace(/\s+/g, '-') || '';
      return catSlug === slug || catName === slug;
    });
  }

  // In-stock only filter
  if (options.inStockOnly) {
    filtered = filtered.filter(item => item.product.stock > 0);
  }

  // Price range filter
  if (typeof options.minPrice === 'number' && !isNaN(options.minPrice)) {
    filtered = filtered.filter(item => item.product.price >= options.minPrice!);
  }
  if (typeof options.maxPrice === 'number' && !isNaN(options.maxPrice)) {
    filtered = filtered.filter(item => item.product.price <= options.maxPrice!);
  }

  // Sorting
  const sort = options.sort || (query ? 'relevance' : 'newest');
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.product.price - b.product.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.product.price - a.product.price);
  } else if (sort === 'newest') {
    filtered.sort((a, b) => {
      const dateA = a.product.created_at ? new Date(a.product.created_at).getTime() : ((a.product as any).createdAt ? new Date((a.product as any).createdAt).getTime() : 0);
      const dateB = b.product.created_at ? new Date(b.product.created_at).getTime() : ((b.product as any).createdAt ? new Date((b.product as any).createdAt).getTime() : 0);
      return dateB - dateA;
    });
  } else {
    // 'relevance' - default when query is present
    filtered.sort((a, b) => b.score - a.score);
  }

  return {
    results: filtered.map(item => item.product),
    totalMatches: filtered.length
  };
}
