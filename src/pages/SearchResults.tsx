import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { SearchBar } from '../components/SearchBar';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Check,
  Tag,
  ArrowUpDown,
  Box
} from 'lucide-react';
import { Product, Category, fetchAllProductsEnriched, fetchCategories, getProductPath } from '../services/productService';
import { executeSearch } from '../services/searchService';
import { WishlistButton } from '../components/WishlistButton';
import { SEO } from '../components/SEO';
import { Breadcrumb } from '../components/Breadcrumb';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const sortParam = (searchParams.get('sort') as 'relevance' | 'price_asc' | 'price_desc' | 'newest') || 'relevance';
  const categoryParam = searchParams.get('category') || '';
  const inStockParam = searchParams.get('instock') === 'true';
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Price inputs state for the filter panel
  const [minPriceInput, setMinPriceInput] = useState<string>(minPriceParam !== undefined ? String(minPriceParam) : '');
  const [maxPriceInput, setMaxPriceInput] = useState<string>(maxPriceParam !== undefined ? String(maxPriceParam) : '');

  const PRODUCTS_PER_PAGE = 9;

  // Load data on mount
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchAllProductsEnriched(), fetchCategories()])
      .then(([products, cats]) => {
        setAllProducts(products);
        setCategories(cats);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products for search:', err);
        setIsLoading(false);
      });
  }, []);

  // Update price inputs if searchParams change externally
  useEffect(() => {
    setMinPriceInput(minPriceParam !== undefined ? String(minPriceParam) : '');
    setMaxPriceInput(maxPriceParam !== undefined ? String(maxPriceParam) : '');
  }, [minPriceParam, maxPriceParam]);

  // Execute smart search & filtering
  const { matchingProducts, totalMatches } = useMemo(() => {
    if (allProducts.length === 0) return { matchingProducts: [], totalMatches: 0 };

    const { results, totalMatches } = executeSearch(allProducts, queryParam, {
      categorySlug: categoryParam,
      inStockOnly: inStockParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      sort: sortParam
    });

    return { matchingProducts: results, totalMatches };
  }, [allProducts, queryParam, categoryParam, inStockParam, minPriceParam, maxPriceParam, sortParam]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(totalMatches / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = matchingProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const updateParam = (key: string, value: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value === null || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      // Always reset page to 1 when filters or queries change
      if (key !== 'page') {
        next.delete('page');
      }
      return next;
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', page.toString());
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams();
      if (prev.get('q')) {
        next.set('q', prev.get('q')!);
      }
      return next;
    });
    setMinPriceInput('');
    setMaxPriceInput('');
  };

  const applyPriceFilter = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (minPriceInput.trim()) {
        next.set('minPrice', minPriceInput.trim());
      } else {
        next.delete('minPrice');
      }
      if (maxPriceInput.trim()) {
        next.set('maxPrice', maxPriceInput.trim());
      } else {
        next.delete('maxPrice');
      }
      next.delete('page');
      return next;
    });
  };

  const hasActiveFilters = Boolean(
    categoryParam || inStockParam || minPriceParam !== undefined || maxPriceParam !== undefined || (sortParam && sortParam !== 'relevance')
  );

  return (
    <Layout>
      <SEO 
        title={queryParam ? `Search Results for "${queryParam}"` : 'Search Hardware Catalogue'}
        description={`Search robotics, microcontrollers, 3D printers, filaments, and PC components at Mechafy Global. Fast shipping across India.`}
        canonicalPath="/search"
      />

      <div className="space-y-6">
        {/* Breadcrumb & Navigation */}
        <Breadcrumb items={[
          { name: 'Shop', url: '/shop' },
          { name: queryParam ? `Search: "${queryParam}"` : 'Search' }
        ]} />

        {/* Top Search Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Search className="w-6 h-6 text-electric-blue shrink-0" />
              {queryParam ? (
                <span>
                  Search Results for <span className="text-electric-blue">"{queryParam}"</span>
                </span>
              ) : (
                <span>All Products Search</span>
              )}
            </h1>
            
            <p className="text-slate-400 text-sm mt-2">
              {isLoading ? (
                'Searching inventory...'
              ) : (
                <>
                  Found <span className="text-white font-bold">{totalMatches}</span> matching {totalMatches === 1 ? 'product' : 'products'}
                  {categoryParam && (
                    <span> in category <span className="text-white font-semibold">"{categories.find(c => c.slug === categoryParam)?.name || categoryParam}"</span></span>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Quick Refine Search Bar */}
          <div className="mt-6 max-w-2xl">
            <SearchBar 
              initialQuery={queryParam}
              placeholder="Refine search by name, brand, SKU..."
              onSearchSubmit={(newQ) => updateParam('q', newQ)}
            />
          </div>
        </div>

        {/* Controls Bar: Mobile filter button, Active filters count, Sort dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-medium hover:bg-white/10 transition-colors"
            >
              <Filter className="w-4 h-4 text-electric-blue" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-electric-blue transition-colors px-2 py-1 rounded bg-white/5 border border-white/10"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort by:
            </span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="w-full sm:w-auto text-xs px-3 py-2 rounded-lg bg-navy-950/90 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters Desktop */}
          <aside className={`w-full md:w-64 shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="glass-panel p-6 rounded-2xl sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Filter className="h-4 w-4 text-electric-blue" />
                  <span>Filter Catalogue</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] text-electric-blue hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* In-Stock Filter */}
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={inStockParam}
                    onChange={(e) => updateParam('instock', e.target.checked ? 'true' : null)}
                    className="rounded bg-white/5 border-white/15 text-electric-blue focus:ring-electric-blue h-4 w-4"
                  />
                  <span className="text-slate-300">In Stock Only</span>
                </label>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Categories</h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="filter_category"
                      checked={!categoryParam}
                      onChange={() => updateParam('category', null)}
                      className="text-electric-blue bg-white/5 border-white/15"
                    />
                    <span className={!categoryParam ? 'text-electric-blue font-bold' : 'text-slate-400'}>
                      All Categories
                    </span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="filter_category"
                        checked={categoryParam === cat.slug}
                        onChange={() => updateParam('category', cat.slug)}
                        className="text-electric-blue bg-white/5 border-white/15"
                      />
                      <span className={categoryParam === cat.slug ? 'text-electric-blue font-bold' : 'text-slate-400'}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Price Range (₹)</h3>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg bg-navy-950/80 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-electric-blue"
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg bg-navy-950/80 border border-white/15 text-white focus:outline-none focus:ring-1 focus:ring-electric-blue"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyPriceFilter}
                  className="w-full py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-electric-blue hover:text-navy-950 text-white transition-all"
                >
                  Apply Price
                </button>
              </div>

              {/* Direct Link to complete shop */}
              <div className="border-t border-white/10 pt-4">
                <Link
                  to="/shop"
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-between group transition-colors"
                >
                  <span>Browse full catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="glass-card h-96 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <StaggerContainer key={currentPage} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.06}>
                  {currentProducts.map(product => (
                    <StaggerItem key={product.id || product.slug}>
                      <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group hover:border-electric-blue/40 transition-all duration-300">
                        {/* Image */}
                        <div className="relative h-52 bg-white/[0.02] border-b border-white/5 p-4 flex items-center justify-center overflow-hidden">
                          <Link to={getProductPath(product)} className="flex items-center justify-center w-full h-full">
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

                          {/* In Stock / Out of Stock Badge */}
                          <div className="absolute top-3 left-3">
                            {product.stock > 0 ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                                Out of Stock
                              </span>
                            )}
                          </div>

                          {/* Wishlist Button */}
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <WishlistButton product={product} variant="card" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="text-xs font-semibold mb-1 uppercase tracking-wide flex flex-wrap gap-1 items-center">
                            <span className="text-electric-blue">{product.category_name || 'Component'}</span>
                            {product.subcategory_name && (
                              <>
                                <span className="text-slate-600">•</span>
                                <span className="text-purple-400">{product.subcategory_name}</span>
                              </>
                            )}
                          </div>

                          <Link 
                            to={getProductPath(product)} 
                            className="text-base font-bold text-white mb-2 hover:text-electric-blue line-clamp-2 transition-colors"
                          >
                            {product.name}
                          </Link>

                          {(product.brand || product.model || product.sku) && (
                            <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-2">
                              {product.brand && <span>Brand: <strong className="text-slate-200">{product.brand}</strong></span>}
                              {product.model && <span>Model: <strong className="text-slate-200">{product.model}</strong></span>}
                              {product.sku && <span className="font-mono text-slate-500">#{product.sku}</span>}
                            </div>
                          )}

                          <p className="text-slate-400 text-xs mb-4 line-clamp-2 flex-grow leading-relaxed">
                            {product.description}
                          </p>

                          {/* Price & Action */}
                          <div className="flex flex-col mt-auto pt-4 border-t border-white/10">
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs line-through text-slate-500">₹{product.originalPrice.toFixed(2)}</span>
                                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  SAVE ₹{(product.originalPrice - product.price).toFixed(2)}
                                </span>
                              </div>
                            )}

                            <div className="flex items-end justify-between">
                              <div>
                                <span className="text-lg font-bold text-white">₹{product.price.toFixed(2)}</span>
                                {product.unit && <span className="text-[11px] text-slate-400 ml-1">/ {product.unit}</span>}
                              </div>
                              <Link 
                                to={`/product/${product.slug}`}
                                className="text-xs text-electric-blue hover:text-blue-300 font-semibold flex items-center group-hover:translate-x-0.5 transition-transform"
                              >
                                View Details <ArrowRight className="ml-1 w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
                        if (
                          number === 1 ||
                          number === totalPages ||
                          (number >= currentPage - 1 && number <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={number}
                              onClick={() => handlePageChange(number)}
                              className={`w-9 h-9 rounded-xl font-medium text-xs transition-colors ${
                                currentPage === number
                                  ? 'bg-electric-blue text-navy-950 font-bold shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                                  : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {number}
                            </button>
                          );
                        } else if (
                          number === currentPage - 2 ||
                          number === currentPage + 2
                        ) {
                          return <span key={number} className="text-slate-500 px-1 text-xs">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* No Results State */
              <div className="text-center py-16 px-4 glass-panel rounded-3xl border border-white/10">
                <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center text-slate-500 border border-white/10">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  No matching products found
                </h2>
                
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  {queryParam ? (
                    <>We couldn't find any products matching <strong className="text-white">"{queryParam}"</strong> with your selected filters.</>
                  ) : (
                    <>No products match your current filter selection.</>
                  )}
                </p>

                {/* Search Tips */}
                <div className="bg-navy-950/60 border border-white/10 rounded-2xl p-5 max-w-lg mx-auto text-left mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-electric-blue mb-2.5">Helpful Search Tips:</h3>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>Check your spelling for typos or extra punctuation.</li>
                    <li>Try using more general terms (e.g. <em>motor</em> instead of full model code).</li>
                    <li>Search by partial part name, brand, or SKU number.</li>
                    <li>Clear any active category or price filters.</li>
                  </ul>
                </div>

                {/* Popular Keywords suggestions */}
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Popular Searches:</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                    {['Motors', 'Sensors', 'Microcontrollers', 'Processors', 'Memory', '3D Printers', 'Filaments', 'Robotics'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          clearAllFilters();
                          updateParam('q', tag);
                        }}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-electric-blue hover:text-navy-950 font-medium text-slate-300 border border-white/10 transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA to return to full catalog */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
                  >
                    Clear All Filters
                  </button>
                  <Link
                    to="/shop"
                    className="btn-glow px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <span>Browse All Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
