import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layout } from '../components/Layout';
import { useCart } from '../context/CartContext';
import { Search, Filter, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { SearchBar } from '../components/SearchBar';
import { WishlistButton } from '../components/WishlistButton';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts, fetchCategories, fetchSubcategories, fetchSubsubcategories, fetchNestedSubcategories, Product, Category, Subcategory, Subsubcategory, NestedSubcategory, getProductPath } from '../services/productService';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { SEO } from '../components/SEO';
import { Breadcrumb, generateBreadcrumbSchema, BreadcrumbItem } from '../components/Breadcrumb';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<Subsubcategory[]>([]);
  const [nestedSubcategories, setNestedSubcategories] = useState<NestedSubcategory[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [isSeoExpanded, setIsSeoExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 9;

  const categoryFilter = searchParams.get('category') || '';
  const subcategoryFilter = searchParams.get('subcategory') || '';
  const subsubcategoryFilter = searchParams.get('subsubcategory') || '';
  const nestedSubcategoryFilter = searchParams.get('nestedSubcategory') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.get('sort') || '';

  // Normalize slugs for robust matching (handles casing and hyphenation mismatches)
  const normalizeSlug = (slug: string) => {
    if (!slug) return '';
    try {
      return decodeURIComponent(slug).toLowerCase().replace(/\s+/g, '-');
    } catch (e) {
      return slug.toLowerCase().replace(/\s+/g, '-');
    }
  };
  const normalizedCategoryFilter = normalizeSlug(categoryFilter);
  const normalizedSubcategoryFilter = normalizeSlug(subcategoryFilter);
  const normalizedSubsubcategoryFilter = normalizeSlug(subsubcategoryFilter);
  const normalizedNestedSubcategoryFilter = normalizeSlug(nestedSubcategoryFilter);

  useEffect(() => {
    // Fetch categories, subcategories, subsubcategories, and nested subcategories
    Promise.all([fetchCategories(), fetchSubcategories(), fetchSubsubcategories(), fetchNestedSubcategories()]).then(([cats, subcats, subsubcats, nestedSubcats]) => {
      const sortAlphanumeric = <T extends { name: string }>(items: T[]): T[] => {
        return [...items].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
      };

      setCategories(sortAlphanumeric(cats));
      setSubcategories(sortAlphanumeric(subcats));
      setSubsubcategories(sortAlphanumeric(subsubcats));
      setNestedSubcategories(sortAlphanumeric(nestedSubcats));
    });
  }, []);

  useEffect(() => {
    // Fetch products with filters
    setIsLoading(true);
    fetchProducts(categoryFilter, subcategoryFilter, subsubcategoryFilter, nestedSubcategoryFilter, searchQuery, sortOption)
      .then(data => {
        setProducts(data);
        setCurrentPage(1); // Reset to first page on filter change
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [categoryFilter, subcategoryFilter, subsubcategoryFilter, nestedSubcategoryFilter, searchQuery, sortOption]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    setSearchParams(prev => {
      prev.set('search', query);
      return prev;
    });
  };

  const handleCategoryChange = (slug: string) => {
    setSearchParams(prev => {
      if (slug) {
        prev.set('category', slug);
      } else {
        prev.delete('category');
      }
      prev.delete('subcategory'); // Reset subcategory when category changes
      prev.delete('subsubcategory'); // Reset subsubcategory when category changes
      return prev;
    });
  };

  const handleSubcategoryChange = (slug: string) => {
    setSearchParams(prev => {
      if (slug) prev.set('subcategory', slug);
      else prev.delete('subcategory');
      prev.delete('subsubcategory'); // Reset subsubcategory when subcategory changes
      return prev;
    });
  };

  const handleSubsubcategoryChange = (slug: string) => {
    setSearchParams(prev => {
      if (slug) prev.set('subsubcategory', slug);
      else prev.delete('subsubcategory');
      prev.delete('nestedSubcategory'); // Reset nested subcategory when subsubcategory changes
      return prev;
    });
  };

  const handleNestedSubcategoryChange = (slug: string) => {
    setSearchParams(prev => {
      if (slug) prev.set('nestedSubcategory', slug);
      else prev.delete('nestedSubcategory');
      return prev;
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams(prev => {
      prev.set('sort', e.target.value);
      return prev;
    });
  };

  // Determine current category name for announcement
  const activeCategory = categories.find(c => normalizeSlug(c.slug) === normalizedCategoryFilter);
  const activeSubcategory = subcategories.find(s => normalizeSlug(s.slug) === normalizedSubcategoryFilter);
  const activeSubsubcategory = subsubcategories.find(s => normalizeSlug(s.slug) === normalizedSubsubcategoryFilter);
  const activeNestedSubcategory = nestedSubcategories.find(n => normalizeSlug(n.slug) === normalizedNestedSubcategoryFilter);
  
  const currentCategoryName = activeNestedSubcategory?.name || activeSubsubcategory?.name || activeSubcategory?.name || activeCategory?.name;

  // Pagination logic
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout showAnnouncement={true}>
      {/* Dynamic SEO & Breadcrumbs */}
      {(() => {
        const pageTitle = currentCategoryName 
          ? `${currentCategoryName} | Buy Online at Best Price`
          : 'Hardware Catalogue | Robotics, 3D Printers & PC Parts';
        const pageDesc = currentCategoryName
          ? `Explore verified ${currentCategoryName} at Mechafy Global. Industry-grade components, fast delivery across India, and competitive pricing.`
          : 'Browse our full catalogue of authentic robotics hardware, microcontrollers, 3D printers, filaments, and high-performance PC components.';

        const breadcrumbItems: BreadcrumbItem[] = [
          { name: 'Shop', url: '/shop' },
          ...(activeCategory ? [{ name: activeCategory.name, url: `/shop?category=${encodeURIComponent(activeCategory.slug)}` }] : []),
          ...(activeSubcategory ? [{ name: activeSubcategory.name, url: `/shop?subcategory=${encodeURIComponent(activeSubcategory.slug)}` }] : []),
          ...(activeSubsubcategory ? [{ name: activeSubsubcategory.name, url: `/shop?subsubcategory=${encodeURIComponent(activeSubsubcategory.slug)}` }] : []),
          ...(activeNestedSubcategory ? [{ name: activeNestedSubcategory.name }] : [])
        ];

        return (
          <>
            <SEO 
              title={pageTitle}
              description={pageDesc}
              canonicalPath="/shop"
              keywords={[currentCategoryName || '', 'Robotics parts', 'Computer hardware', '3D printer supply India', 'Mechafy Global'].filter(Boolean)}
              structuredData={generateBreadcrumbSchema(breadcrumbItems)}
            />
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems.slice(1)} />
            </div>
          </>
        );
      })()}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <Reveal width="100%">
            <div className="glass-panel p-6 rounded-xl sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Filter className="h-5 w-5 text-electric-blue" />
                  <h2>Filters</h2>
                </div>
                {(categoryFilter || subcategoryFilter || subsubcategoryFilter || nestedSubcategoryFilter || searchQuery || sortOption) && (
                  <button 
                    onClick={() => setSearchParams({})}
                    className="text-xs text-slate-400 hover:text-electric-blue transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="space-y-1">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={normalizedCategoryFilter === normalizeSlug(cat.slug)}
                          onChange={() => handleCategoryChange(cat.slug)}
                          className="text-electric-blue focus:ring-electric-blue bg-white/5 border-white/10"
                        />
                        <span className={normalizedCategoryFilter === normalizeSlug(cat.slug) ? 'font-medium text-white' : 'text-slate-400'}>{cat.name}</span>
                      </label>
                      
                      {/* Subcategories */}
                      {normalizedCategoryFilter === normalizeSlug(cat.slug) && subcategories.filter(sub => sub.category_id === cat.id).length > 0 && (
                        <div className="pl-6 space-y-1 mt-1 border-l border-white/10 ml-2">
                          {subcategories.filter(sub => sub.category_id === cat.id).map(subcat => (
                            <div key={subcat.id} className="space-y-1">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="subcategory" 
                                  checked={normalizedSubcategoryFilter === normalizeSlug(subcat.slug)}
                                  onChange={() => handleSubcategoryChange(subcat.slug)}
                                  className="text-purple-500 focus:ring-purple-500 bg-white/5 border-white/10"
                                />
                                <span className={normalizedSubcategoryFilter === normalizeSlug(subcat.slug) ? 'font-medium text-white text-sm' : 'text-slate-400 text-sm'}>{subcat.name}</span>
                              </label>

                              {/* Subsubcategories */}
                              {normalizedSubcategoryFilter === normalizeSlug(subcat.slug) && subsubcategories.filter(subsub => subsub.subcategory_id === subcat.id).length > 0 && (
                                <div className="pl-6 space-y-1 mt-1 border-l border-white/10 ml-2">
                                  {subsubcategories.filter(subsub => subsub.subcategory_id === subcat.id).map(subsubcat => (
                                    <div key={subsubcat.id} className="space-y-1">
                                      <label className="flex items-center space-x-2 cursor-pointer">
                                        <input 
                                          type="radio" 
                                          name="subsubcategory" 
                                          checked={normalizedSubsubcategoryFilter === normalizeSlug(subsubcat.slug)}
                                          onChange={() => handleSubsubcategoryChange(subsubcat.slug)}
                                          className="text-pink-500 focus:ring-pink-500 bg-white/5 border-white/10"
                                        />
                                        <span className={normalizedSubsubcategoryFilter === normalizeSlug(subsubcat.slug) ? 'font-medium text-white text-xs' : 'text-slate-400 text-xs'}>{subsubcat.name}</span>
                                      </label>

                                      {/* Nested Subcategories */}
                                      {normalizedSubsubcategoryFilter === normalizeSlug(subsubcat.slug) && nestedSubcategories.filter(nested => nested.subsubcategory_id === subsubcat.id).length > 0 && (
                                        <div className="pl-6 space-y-1 mt-1 border-l border-white/10 ml-2">
                                          {nestedSubcategories.filter(nested => nested.subsubcategory_id === subsubcat.id).map(nestedSubcat => (
                                            <label key={nestedSubcat.id} className="flex items-center space-x-2 cursor-pointer">
                                              <input 
                                                type="radio" 
                                                name="nestedSubcategory" 
                                                checked={normalizedNestedSubcategoryFilter === normalizeSlug(nestedSubcat.slug)}
                                                onChange={() => handleNestedSubcategoryChange(nestedSubcat.slug)}
                                                className="text-amber-500 focus:ring-amber-500 bg-white/5 border-white/10"
                                              />
                                              <span className={normalizedNestedSubcategoryFilter === normalizeSlug(nestedSubcat.slug) ? 'font-medium text-white text-[10px]' : 'text-slate-400 text-[10px]'}>{nestedSubcat.name}</span>
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          <Reveal width="100%" delay={0.2}>
            {/* Dynamic Category Announcement */}
            {currentCategoryName && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-electric-blue/10 border border-electric-blue/20 text-blue-100"
              >
                <p className="text-sm md:text-base leading-relaxed">
                  Looking for a specific type of <strong className="text-white">{currentCategoryName}</strong>? We supply a comprehensive range from all leading brands. Request a custom quote today for our best competitive pricing and dedicated assistance.
                </p>
              </motion.div>
            )}

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="w-full sm:w-96">
                <SearchBar 
                  initialQuery={searchQuery}
                  placeholder="Search products..."
                  onSearchSubmit={(q) => {
                    setSearchParams(prev => {
                      if (q) {
                        prev.set('search', q);
                      } else {
                        prev.delete('search');
                      }
                      return prev;
                    });
                  }}
                />
              </div>
              
              <select 
                value={sortOption} 
                onChange={handleSortChange}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue appearance-none"
              >
                <option value="" className="bg-slate-900 text-white">Newest Arrivals</option>
                <option value="price_asc" className="bg-slate-900 text-white">Price: Low to High</option>
                <option value="price_desc" className="bg-slate-900 text-white">Price: High to Low</option>
              </select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="glass-card h-96 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <StaggerContainer key={currentPage} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
                  {currentProducts.map(product => (
                    <StaggerItem key={product.id}>
                      <ProductCard product={product} className="h-full" />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => {
                        // Show first, last, current, and adjacent pages
                        if (
                          number === 1 ||
                          number === totalPages ||
                          (number >= currentPage - 1 && number <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={number}
                              onClick={() => paginate(number)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === number
                                  ? 'bg-electric-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
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
                          return <span key={number} className="text-slate-500 px-1">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Reveal duration={0.4}>
                <div className="text-center py-20 glass-panel rounded-2xl">
                  <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Search className="text-slate-500 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    We couldn't find any products matching your search. Try adjusting your filters or search term.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchParams({});
                    }}
                    className="mt-6 text-electric-blue hover:text-blue-400 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </Reveal>
            )}
          </Reveal>
        </div>
      </div>

      {/* SEO Content Section */}
      <Reveal width="100%" delay={0.3}>
        <section className="mt-20 pt-12 border-t border-white/10 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className={`relative overflow-hidden transition-all duration-700 ease-in-out ${isSeoExpanded ? 'max-h-[2000px]' : 'max-h-[140px]'}`}>
              <div className="prose prose-invert prose-slate max-w-none">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Your Premier Robotic Component & Computer Parts Store</h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Welcome to Mechafy Global, the ultimate destination for innovators, engineers, and DIY tech enthusiasts. Whether you are building complex industrial automation systems or upgrading your high-performance PC, we provide the reliable hardware you need to bring your vision to life.
                </p>

                <h3 className="text-xl font-semibold text-electric-blue mb-3">Top-Tier Robotics & Microcontrollers</h3>
                <p className="text-slate-400 leading-relaxed mb-8">
                  As a leading robotic component store, we specialize in high-quality, authentic parts for every level of engineering. From advanced microcontrollers (like Arduino and Raspberry Pi) to precision motor drivers, sensors, and structural chassis kits, our inventory is carefully curated to support IoT projects, STEM education, and professional prototyping.
                </p>

                <h3 className="text-xl font-semibold text-electric-blue mb-3">High-Performance Computer Components</h3>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Beyond robotics, Mechafy Global is your trusted computer parts store. We supply essential, high-performance PC components designed for speed and durability. We understand that your hardware is the backbone of your digital work, which is why we only source components that meet strict quality standards.
                </p>

                <h3 className="text-xl font-semibold text-electric-blue mb-3">Why Choose Mechafy Global?</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Based in the HSIIDC Industrial Area of Sonipat, Haryana, and backed by the established Shanti Food Industries, we offer more than just parts—we offer reliability. We provide fast shipping across India, transparent pricing, and expert B2B IT services. When you buy robotics parts online from us, you aren't just getting hardware; you are gaining a technology partner dedicated to your growth.
                </p>

                <p className="text-white font-medium">
                  Browse our catalog above to find the exact microcontrollers, sensors, and PC components your next project requires.
                </p>
              </div>
              
              {/* Gradient overlay when collapsed */}
              {!isSeoExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0f1c] to-transparent pointer-events-none"></div>
              )}
            </div>
            
            <button 
              onClick={() => setIsSeoExpanded(!isSeoExpanded)}
              className="mt-6 text-electric-blue hover:text-cyan-400 font-medium flex items-center gap-2 transition-colors mx-auto bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full border border-white/10 cursor-pointer"
            >
              {isSeoExpanded ? 'Read Less' : 'Read More'}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSeoExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </section>
      </Reveal>

      {/* Recently Viewed Products */}
      <RecentlyViewed 
        title="Recently Viewed" 
        subtitle="Continue where you left off" 
        limit={6} 
      />
    </Layout>
  );
}
