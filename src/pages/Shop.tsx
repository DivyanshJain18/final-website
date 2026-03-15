import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useCart } from '../context/CartContext';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { fetchProducts, fetchCategories, fetchSubcategories, fetchSubsubcategories, Product, Category, Subcategory, Subsubcategory } from '../services/productService';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subsubcategories, setSubsubcategories] = useState<Subsubcategory[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  const categoryFilter = searchParams.get('category') || '';
  const subcategoryFilter = searchParams.get('subcategory') || '';
  const subsubcategoryFilter = searchParams.get('subsubcategory') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.get('sort') || '';

  useEffect(() => {
    // Fetch categories, subcategories, and subsubcategories
    Promise.all([fetchCategories(), fetchSubcategories(), fetchSubsubcategories()]).then(([cats, subcats, subsubcats]) => {
      setCategories(cats);
      setSubcategories(subcats);
      setSubsubcategories(subsubcats);
    });
  }, []);

  useEffect(() => {
    // Fetch products with filters
    setIsLoading(true);
    fetchProducts(categoryFilter, subcategoryFilter, subsubcategoryFilter, searchQuery, sortOption)
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [categoryFilter, subcategoryFilter, searchQuery, sortOption]);

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
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <Reveal width="100%">
            <div className="glass-panel p-6 rounded-xl sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-white font-bold">
                <Filter className="h-5 w-5 text-electric-blue" />
                <h2>Filters</h2>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={categoryFilter === ''}
                      onChange={() => handleCategoryChange('')}
                      className="text-electric-blue focus:ring-electric-blue bg-white/5 border-white/10"
                    />
                    <span className={categoryFilter === '' ? 'font-medium text-white' : 'text-slate-400'}>All Products</span>
                  </label>
                  {categories.map(cat => (
                    <div key={cat.id} className="space-y-1">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="category" 
                          checked={categoryFilter === cat.slug}
                          onChange={() => handleCategoryChange(cat.slug)}
                          className="text-electric-blue focus:ring-electric-blue bg-white/5 border-white/10"
                        />
                        <span className={categoryFilter === cat.slug ? 'font-medium text-white' : 'text-slate-400'}>{cat.name}</span>
                      </label>
                      
                      {/* Subcategories */}
                      {categoryFilter === cat.slug && subcategories.filter(sub => sub.category_id === cat.id).length > 0 && (
                        <div className="pl-6 space-y-1 mt-1 border-l border-white/10 ml-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="subcategory" 
                              checked={subcategoryFilter === ''}
                              onChange={() => handleSubcategoryChange('')}
                              className="text-purple-500 focus:ring-purple-500 bg-white/5 border-white/10"
                            />
                            <span className={subcategoryFilter === '' ? 'font-medium text-white text-sm' : 'text-slate-400 text-sm'}>All in {cat.name}</span>
                          </label>
                          {subcategories.filter(sub => sub.category_id === cat.id).map(subcat => (
                            <div key={subcat.id} className="space-y-1">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="subcategory" 
                                  checked={subcategoryFilter === subcat.slug}
                                  onChange={() => handleSubcategoryChange(subcat.slug)}
                                  className="text-purple-500 focus:ring-purple-500 bg-white/5 border-white/10"
                                />
                                <span className={subcategoryFilter === subcat.slug ? 'font-medium text-white text-sm' : 'text-slate-400 text-sm'}>{subcat.name}</span>
                              </label>

                              {/* Subsubcategories */}
                              {subcategoryFilter === subcat.slug && subsubcategories.filter(subsub => subsub.subcategory_id === subcat.id).length > 0 && (
                                <div className="pl-6 space-y-1 mt-1 border-l border-white/10 ml-2">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                      type="radio" 
                                      name="subsubcategory" 
                                      checked={subsubcategoryFilter === ''}
                                      onChange={() => handleSubsubcategoryChange('')}
                                      className="text-pink-500 focus:ring-pink-500 bg-white/5 border-white/10"
                                    />
                                    <span className={subsubcategoryFilter === '' ? 'font-medium text-white text-xs' : 'text-slate-400 text-xs'}>All in {subcat.name}</span>
                                  </label>
                                  {subsubcategories.filter(subsub => subsub.subcategory_id === subcat.id).map(subsubcat => (
                                    <label key={subsubcat.id} className="flex items-center space-x-2 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name="subsubcategory" 
                                        checked={subsubcategoryFilter === subsubcat.slug}
                                        onChange={() => handleSubsubcategoryChange(subsubcat.slug)}
                                        className="text-pink-500 focus:ring-pink-500 bg-white/5 border-white/10"
                                      />
                                      <span className={subsubcategoryFilter === subsubcat.slug ? 'font-medium text-white text-xs' : 'text-slate-400 text-xs'}>{subsubcat.name}</span>
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
    </Layout>
  );
}
