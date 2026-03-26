import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layout } from '../components/Layout';
import { useCart } from '../context/CartContext';
import { Search, Filter, ArrowRight, ChevronDown } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { fetchProducts, fetchCategories, fetchSubcategories, fetchSubsubcategories, fetchNestedSubcategories, Product, Category, Subcategory, Subsubcategory, NestedSubcategory } from '../services/productService';

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
      setCategories(cats);
      setSubcategories(subcats);
      setSubsubcategories(subsubcats);
      setNestedSubcategories(nestedSubcats);
    });
  }, []);

  useEffect(() => {
    // Fetch products with filters
    setIsLoading(true);
    fetchProducts(categoryFilter, subcategoryFilter, subsubcategoryFilter, nestedSubcategoryFilter, searchQuery, sortOption)
      .then(data => {
        setProducts(data);
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

  return (
    <Layout>
      {/* Announcement Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white/5 backdrop-blur-md border-b border-white/10 text-slate-300 text-center text-[13px] py-[10px] px-4 -mt-8 mb-8 z-10"
      >
        Leading Importer & Wholesale Supplier: Our online catalog is currently being updated. We supply all varieties of robotics and computer components—please <a href="mailto:sales@mechafyglobal.com" className="text-electric-blue hover:text-blue-400 hover:underline font-semibold transition-colors">REQUEST A QUOTE VIA EMAIL</a> for items not yet listed.
      </motion.div>

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
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                <input 
                  type="text" 
                  name="search" 
                  defaultValue={searchQuery}
                  placeholder="Search products..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent placeholder-slate-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
              </form>
              
              <select 
                value={sortOption} 
                onChange={handleSortChange}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
              >
                <option value="">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="glass-card h-96 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
                {products.map(product => (
                  <StaggerItem key={product.id}>
                    <div 
                      className="glass-card rounded-xl overflow-hidden flex flex-col h-full group"
                    >
                      <Link to={`/product/${product.slug}`} className="block relative h-48 bg-white/5 overflow-hidden">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <span className="btn-glow transform scale-90 group-hover:scale-100 transition-transform">View Details</span>
                        </div>
                      </Link>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="text-xs font-semibold mb-1 uppercase tracking-wide flex flex-wrap gap-1">
                          <span className="text-electric-blue">{product.category_name}</span>
                          {product.subcategory_name && (
                            <>
                              <span className="text-slate-500">•</span>
                              <span className="text-purple-400">{product.subcategory_name}</span>
                            </>
                          )}
                          {product.subsubcategory_name && (
                            <>
                              <span className="text-slate-500">•</span>
                              <span className="text-pink-400">{product.subsubcategory_name}</span>
                            </>
                          )}
                          {product.nested_subcategory_name && (
                            <>
                              <span className="text-slate-500">•</span>
                              <span className="text-amber-400">{product.nested_subcategory_name}</span>
                            </>
                          )}
                        </div>
                        <Link to={`/product/${product.slug}`} className="text-lg font-bold text-white mb-2 hover:text-electric-blue line-clamp-2 transition-colors">
                          {product.name}
                        </Link>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                        <div className="flex flex-col mt-auto pt-4 border-t border-white/10">
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm line-through text-slate-500">₹{product.originalPrice.toFixed(2)}</span>
                              <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                SAVE RS. {(product.originalPrice - product.price).toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-end justify-between">
                            <div>
                              <span className="text-xl font-bold text-white">₹{product.price.toFixed(2)}</span>
                              {product.unit && <span className="text-xs text-slate-400 ml-1">/ {product.unit}</span>}
                            </div>
                            <Link 
                              to={`/product/${product.slug}`}
                              className="text-sm text-electric-blue hover:text-blue-400 font-medium flex items-center group-hover:translate-x-1 transition-transform"
                            >
                              Buy Now <ArrowRight className="ml-1 w-4 h-4" />
                            </Link>
                          </div>
                          {product.taxText && (
                            <p className="text-[10px] text-slate-500 mt-1">{product.taxText}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
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
              className="mt-6 text-electric-blue hover:text-cyan-400 font-medium flex items-center gap-2 transition-colors mx-auto bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full border border-white/10"
            >
              {isSeoExpanded ? 'Read Less' : 'Read More'}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSeoExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </section>
      </Reveal>
    </Layout>
  );
}
