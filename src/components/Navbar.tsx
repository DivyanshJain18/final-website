import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X, User, LogOut, Package, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchCategories, fetchSubcategories, fetchSubsubcategories, Category, Subcategory, Subsubcategory } from '../services/productService';

export function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState<Record<string, Subcategory[]>>({});
  const [subsubcategoriesBySubcategory, setSubsubcategoriesBySubcategory] = useState<Record<string, Subsubcategory[]>>({});
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
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
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[800px] rounded-2xl shadow-2xl bg-slate-900/95 backdrop-blur-xl ring-1 ring-white/10 focus:outline-none z-50 border border-white/10 overflow-hidden flex">
                      {/* Left side: Categories list */}
                      <div className="w-1/3 bg-slate-800/50 p-4 border-r border-white/5">
                        <Link 
                          to="/shop" 
                          className="block px-4 py-3 text-sm text-white font-bold rounded-lg hover:bg-electric-blue/20 hover:text-electric-blue transition-colors mb-2"
                          onClick={() => setIsProductsOpen(false)}
                        >
                          All Products
                        </Link>
                        <div className="space-y-1">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              className={`w-full text-left flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-colors ${hoveredCategory === category.id ? 'bg-electric-blue/20 text-electric-blue font-medium' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                              onMouseEnter={() => setHoveredCategory(category.id)}
                              onClick={() => {
                                navigate(`/shop?category=${category.slug}`);
                                setIsProductsOpen(false);
                              }}
                            >
                              <span>{category.name}</span>
                              <ChevronRight className={`h-4 w-4 ${hoveredCategory === category.id ? 'text-electric-blue' : 'text-slate-500'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right side: Subcategories & Sub-subcategories */}
                      <div className="w-2/3 p-6 bg-slate-900/50">
                        {hoveredCategory ? (
                          <div>
                            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                              <h3 className="text-lg font-bold text-white">
                                {categories.find(c => c.id === hoveredCategory)?.name}
                              </h3>
                              <Link 
                                to={`/shop?category=${categories.find(c => c.id === hoveredCategory)?.slug}`}
                                className="text-xs font-semibold text-electric-blue hover:text-cyan-400 flex items-center transition-colors"
                                onClick={() => setIsProductsOpen(false)}
                              >
                                View All <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </div>
                            
                            {subcategoriesByCategory[hoveredCategory]?.length > 0 ? (
                              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                {subcategoriesByCategory[hoveredCategory].map(subcat => (
                                  <div key={subcat.id}>
                                    <Link
                                      to={`/shop?category=${categories.find(c => c.id === hoveredCategory)?.slug}&subcategory=${subcat.slug}`}
                                      className="block text-sm font-bold text-slate-200 hover:text-electric-blue mb-3 transition-colors"
                                      onClick={() => setIsProductsOpen(false)}
                                    >
                                      {subcat.name}
                                    </Link>
                                    {subsubcategoriesBySubcategory[subcat.id]?.length > 0 && (
                                      <ul className="space-y-2">
                                        {subsubcategoriesBySubcategory[subcat.id].map(subsubcat => (
                                          <li key={subsubcat.id}>
                                            <Link
                                              to={`/shop?category=${categories.find(c => c.id === hoveredCategory)?.slug}&subcategory=${subcat.slug}&subsubcategory=${subsubcat.slug}`}
                                              className="text-sm text-slate-400 hover:text-white transition-colors flex items-center group"
                                              onClick={() => setIsProductsOpen(false)}
                                            >
                                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2 group-hover:bg-electric-blue transition-colors"></span>
                                              {subsubcat.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                                <Package className="h-12 w-12 mb-3 opacity-20" />
                                <p>No subcategories found.</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <Package className="h-16 w-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium text-slate-400">Select a category</p>
                            <p className="text-sm mt-2">Hover over a category on the left to explore its products.</p>
                          </div>
                        )}
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Home</Link>
            <Link to="/about" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Company Profile</Link>
            
            <div className="px-3 py-2 text-electric-blue font-medium text-base">Products</div>
            <div className="pl-6 space-y-1 border-l border-white/10 ml-3">
              <Link to="/shop" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-sm transition-colors">All Products</Link>
              {categories.map((category) => (
                <div key={category.id}>
                  <Link
                    to={`/shop?category=${category.slug}`}
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    {category.name}
                  </Link>
                  {subcategoriesByCategory[category.id]?.length > 0 && (
                    <div className="pl-4 space-y-1 border-l border-white/10 ml-3 mt-1">
                      {subcategoriesByCategory[category.id].map(subcat => (
                        <div key={subcat.id}>
                          <Link
                            to={`/shop?category=${category.slug}&subcategory=${subcat.slug}`}
                            className="text-gray-400 hover:text-white block px-3 py-1.5 rounded-md text-sm transition-colors"
                          >
                            {subcat.name}
                          </Link>
                          {subsubcategoriesBySubcategory[subcat.id]?.length > 0 && (
                            <div className="pl-4 space-y-1 border-l border-white/10 ml-3 mt-1">
                              {subsubcategoriesBySubcategory[subcat.id].map(subsubcat => (
                                <Link
                                  key={subsubcat.id}
                                  to={`/shop?category=${category.slug}&subcategory=${subcat.slug}&subsubcategory=${subsubcat.slug}`}
                                  className="text-gray-500 hover:text-white block px-3 py-1.5 rounded-md text-xs transition-colors"
                                >
                                  {subsubcat.name}
                                </Link>
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

            <Link to="/it-services" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">IT Services</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Contact Us</Link>
            
            {user && user.role === 'admin' ? (
              <>
                <Link to="/admin" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Admin Dashboard</Link>
                <button onClick={handleLogout} className="text-left w-full text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">Logout</button>
              </>
            ) : (
              <Link to="/contact" className="btn-glow block mt-4 text-center mx-3">
                Request a Quote
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
