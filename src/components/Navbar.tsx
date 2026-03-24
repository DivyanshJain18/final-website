import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X, User, LogOut, Package, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchCategories, fetchSubcategories, fetchSubsubcategories, fetchNestedSubcategories, Category, Subcategory, Subsubcategory, NestedSubcategory } from '../services/productService';

export function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState<Record<string, Subcategory[]>>({});
  const [subsubcategoriesBySubcategory, setSubsubcategoriesBySubcategory] = useState<Record<string, Subsubcategory[]>>({});
  const [nestedSubcategoriesBySubsubcategory, setNestedSubcategoriesBySubsubcategory] = useState<Record<string, NestedSubcategory[]>>({});
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
  const [hoveredSubsubcategory, setHoveredSubsubcategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Fetch Categories
    fetchCategories()
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Categories data is not an array:', data);
          setCategories([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories', err);
        setCategories([]);
      });

    // Fetch Subcategories
    fetchSubcategories()
      .then(data => {
        if (Array.isArray(data)) {
          const grouped = data.reduce((acc: Record<string, Subcategory[]>, subcat: Subcategory) => {
            const catId = subcat.category_id;
            if (!acc[catId]) acc[catId] = [];
            acc[catId].push(subcat);
            return acc;
          }, {});
          setSubcategoriesByCategory(grouped);
        }
      })
      .catch(err => console.error('Failed to fetch subcategories for menu', err));

    // Fetch Subsubcategories
    fetchSubsubcategories()
      .then(data => {
        if (Array.isArray(data)) {
          const grouped = data.reduce((acc: Record<string, Subsubcategory[]>, subsubcat: Subsubcategory) => {
            const subcatId = subsubcat.subcategory_id;
            if (!acc[subcatId]) acc[subcatId] = [];
            acc[subcatId].push(subsubcat);
            return acc;
          }, {});
          setSubsubcategoriesBySubcategory(grouped);
        }
      })
      .catch(err => console.error('Failed to fetch subsubcategories for menu', err));

    // Fetch Nested Subcategories
    fetchNestedSubcategories()
      .then(data => {
        if (Array.isArray(data)) {
          const grouped = data.reduce((acc: Record<string, NestedSubcategory[]>, nestedSubcat: NestedSubcategory) => {
            const subsubcatId = nestedSubcat.subsubcategory_id;
            if (!acc[subsubcatId]) acc[subsubcatId] = [];
            acc[subsubcatId].push(nestedSubcat);
            return acc;
          }, {});
          setNestedSubcategoriesBySubsubcategory(grouped);
        }
      })
      .catch(err => console.error('Failed to fetch nested subcategories for menu', err));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMobileCategory = (id: string) => {
    setExpandedMobileCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 300);
  };

  return (
    <nav className="glass-panel sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl tracking-wider text-electric-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              MECHAFY<span className="text-white">GLOBAL</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-4 lg:ml-8 flex items-center space-x-4 lg:space-x-6 h-full">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/about" className="nav-link">Company Profile</Link>
                
                {/* Products Dropdown */}
                <div 
                  className="relative group h-full flex items-center"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button 
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="flex items-center nav-link focus:outline-none"
                  >
                    Products <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  
                  {isProductsOpen && (
                    <div
                      className="absolute left-0 top-full mt-2 w-[600px] rounded-xl shadow-lg bg-navy-900/90 backdrop-blur-md ring-1 ring-white/10 focus:outline-none z-50 border border-white/10 flex"
                    >
                      <div className="w-64 py-1 shrink-0" role="menu" aria-orientation="vertical">
                        <Link 
                          to="/shop" 
                          className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white font-semibold border-b border-white/10 mb-1 transition-colors"
                          role="menuitem"
                          onClick={() => setIsProductsOpen(false)}
                        >
                          All Products
                        </Link>
                        {categories.map((category) => (
                          <div 
                            key={category.id}
                            className="relative group/item"
                            onMouseEnter={() => setHoveredCategory(category.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                          >
                            <Link
                              to={`/shop?category=${encodeURIComponent(category.slug || '')}`}
                              className="flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                              role="menuitem"
                              onClick={() => setIsProductsOpen(false)}
                            >
                              <span>{category.name}</span>
                              {subcategoriesByCategory[category.id]?.length > 0 ? (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                              ) : null}
                            </Link>

                            {/* Nested Dropdown for Subcategories */}
                            {hoveredCategory === category.id && subcategoriesByCategory[category.id]?.length > 0 && (
                              <div className="absolute left-full top-0 w-64 rounded-xl shadow-lg bg-navy-900/90 backdrop-blur-md ring-1 ring-white/10 focus:outline-none z-50 border border-white/10 -ml-1">
                                <div className="py-1">
                                  {subcategoriesByCategory[category.id]?.map((subcat) => (
                                    <div 
                                      key={subcat.id}
                                      className="relative group/subitem"
                                      onMouseEnter={() => setHoveredSubcategory(subcat.id)}
                                      onMouseLeave={() => setHoveredSubcategory(null)}
                                    >
                                      <Link
                                        to={`/shop?category=${encodeURIComponent(category.slug || '')}&subcategory=${encodeURIComponent(subcat.slug || '')}`}
                                        className="flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                                        onClick={() => {
                                          setIsProductsOpen(false);
                                          setHoveredCategory(null);
                                          setHoveredSubcategory(null);
                                        }}
                                      >
                                        <span>{subcat.name}</span>
                                        {subsubcategoriesBySubcategory[subcat.id]?.length > 0 ? (
                                          <ChevronRight className="h-4 w-4 text-slate-500" />
                                        ) : null}
                                      </Link>

                                      {/* Nested Dropdown for Subsubcategories */}
                                      {hoveredSubcategory === subcat.id && subsubcategoriesBySubcategory[subcat.id]?.length > 0 && (
                                        <div className="absolute left-full top-0 w-64 rounded-xl shadow-lg bg-navy-900/90 backdrop-blur-md ring-1 ring-white/10 focus:outline-none z-50 border border-white/10 -ml-1">
                                          <div className="py-1">
                                            {subsubcategoriesBySubcategory[subcat.id]?.map((subsubcat) => (
                                              <div 
                                                key={subsubcat.id}
                                                className="relative group/subsubitem"
                                                onMouseEnter={() => setHoveredSubsubcategory(subsubcat.id)}
                                                onMouseLeave={() => setHoveredSubsubcategory(null)}
                                              >
                                                <Link
                                                  to={`/shop?category=${encodeURIComponent(category.slug || '')}&subcategory=${encodeURIComponent(subcat.slug || '')}&subsubcategory=${encodeURIComponent(subsubcat.slug || '')}`}
                                                  className="flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                                                  onClick={() => {
                                                    setIsProductsOpen(false);
                                                    setHoveredCategory(null);
                                                    setHoveredSubcategory(null);
                                                    setHoveredSubsubcategory(null);
                                                  }}
                                                >
                                                  <span>{subsubcat.name}</span>
                                                </Link>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Promotional Box */}
                      <div className="flex-1 p-6 bg-gradient-to-br from-electric-blue/10 to-transparent border-l border-white/10 flex flex-col justify-center items-start relative overflow-hidden rounded-r-xl">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-electric-blue/20 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
                        
                        <Package className="h-8 w-8 text-electric-blue mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Enterprise Solutions</h3>
                        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                          Scale your business with our enterprise-grade hardware, custom configurations, and dedicated 24/7 support.
                        </p>
                        <Link 
                          to="/contact" 
                          className="btn-glow text-xs uppercase tracking-wide mt-auto"
                          onClick={() => setIsProductsOpen(false)}
                        >
                          Request a Quote
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/it-services" className="nav-link">IT Services</Link>
                <Link to="/contact" className="nav-link">Contact Us</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-2 flex items-center md:ml-4 space-x-2 lg:space-x-4">
              {user && user.role === 'admin' ? (
                <div className="relative flex items-center space-x-3">
                  <Link to="/admin" className="flex items-center space-x-1 text-sm hover:text-electric-blue transition-colors">
                    <User className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <button onClick={handleLogout} className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link to="/contact" className="btn-glow text-[10px] lg:text-xs uppercase tracking-wide whitespace-nowrap">
                  Request a Quote
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="md:hidden bg-navy-900/95 backdrop-blur-md border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[80vh] overflow-y-auto">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Home</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Company Profile</Link>
            
            <button 
              onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:text-white rounded-md text-base font-medium transition-colors"
            >
              <span>Products</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMobileProductsOpen && (
              <div className="pl-4 space-y-1 border-l border-white/10 ml-4 mb-2">
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-sm transition-colors">All Products</Link>
                {categories.map((category) => {
                  const hasSubcats = subcategoriesByCategory[category.id]?.length > 0;
                  const isExpanded = expandedMobileCategories[category.id];
                  
                  return (
                    <div key={category.id}>
                      <div className="flex items-center justify-between pr-2">
                        <Link
                          to={`/shop?category=${encodeURIComponent(category.slug || '')}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-sm transition-colors flex-grow"
                        >
                          {category.name}
                        </Link>
                        {hasSubcats && (
                          <button 
                            onClick={() => toggleMobileCategory(category.id)}
                            className="p-2 text-gray-400 hover:text-white focus:outline-none"
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                      
                      {hasSubcats && isExpanded && (
                        <div className="pl-4 space-y-1 border-l border-white/10 ml-3 mt-1">
                          {subcategoriesByCategory[category.id].map(subcat => {
                            const hasSubsubcats = subsubcategoriesBySubcategory[subcat.id]?.length > 0;
                            const isSubExpanded = expandedMobileCategories[subcat.id];
                            
                            return (
                              <div key={subcat.id}>
                                <div className="flex items-center justify-between pr-2">
                                  <Link
                                    to={`/shop?category=${encodeURIComponent(category.slug || '')}&subcategory=${encodeURIComponent(subcat.slug || '')}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-gray-400 hover:text-white block px-3 py-1.5 rounded-md text-sm transition-colors flex-grow"
                                  >
                                    {subcat.name}
                                  </Link>
                                  {hasSubsubcats && (
                                    <button 
                                      onClick={() => toggleMobileCategory(subcat.id)}
                                      className="p-1.5 text-gray-500 hover:text-white focus:outline-none"
                                    >
                                      <ChevronDown className={`h-3 w-3 transition-transform ${isSubExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                  )}
                                </div>
                                
                                {hasSubsubcats && isSubExpanded && (
                                  <div className="pl-4 space-y-1 border-l border-white/10 ml-3 mt-1">
                                    {subsubcategoriesBySubcategory[subcat.id].map(subsubcat => (
                                      <div key={subsubcat.id}>
                                        <Link
                                          to={`/shop?category=${encodeURIComponent(category.slug || '')}&subcategory=${encodeURIComponent(subcat.slug || '')}&subsubcategory=${encodeURIComponent(subsubcat.slug || '')}`}
                                          onClick={() => setIsMenuOpen(false)}
                                          className="text-gray-500 hover:text-white block px-3 py-1.5 rounded-md text-xs transition-colors"
                                        >
                                          {subsubcat.name}
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <Link to="/it-services" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">IT Services</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Contact Us</Link>
            
            {user && user.role === 'admin' ? (
              <>
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Admin Dashboard</Link>
                <button onClick={handleLogout} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Logout</button>
              </>
            ) : (
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="btn-glow block mt-4 text-center mx-3">
                Request a Quote
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
