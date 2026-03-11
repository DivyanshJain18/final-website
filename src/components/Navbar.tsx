import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X, User, LogOut, Package, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchCategories, fetchProducts, Category, Product } from '../services/productService';

export function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
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

    // Fetch Products for nested dropdowns
    fetchProducts()
      .then(data => {
        if (Array.isArray(data)) {
          const grouped = data.reduce((acc: Record<string, Product[]>, product: Product) => {
            const catId = product.category_id;
            if (!acc[catId]) acc[catId] = [];
            acc[catId].push(product);
            return acc;
          }, {});
          setProductsByCategory(grouped);
        }
      })
      .catch(err => console.error('Failed to fetch products for menu', err));
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
                    <div
                      className="absolute left-0 top-full mt-2 w-64 rounded-xl shadow-lg bg-navy-900/90 backdrop-blur-md ring-1 ring-white/10 focus:outline-none z-50 border border-white/10 overflow-hidden"
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <Link 
                          to="/shop" 
                          className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white font-semibold border-b border-white/10 mb-1 transition-colors"
                          role="menuitem"
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
                              to={`/shop?category=${category.slug}`}
                              className="flex items-center justify-between px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                              role="menuitem"
                            >
                              <span>{category.name}</span>
                              {productsByCategory[category.id]?.length > 0 && (
                                <ChevronRight className="h-4 w-4 text-slate-500" />
                              )}
                            </Link>

                            {/* Nested Dropdown for Products */}
                            {hoveredCategory === category.id && productsByCategory[category.id]?.length > 0 && (
                              <div className="absolute left-full top-0 w-64 rounded-xl shadow-lg bg-navy-900/90 backdrop-blur-md ring-1 ring-white/10 focus:outline-none z-50 border border-white/10 -ml-1 overflow-hidden">
                                <div className="py-1 max-h-96 overflow-y-auto">
                                  {productsByCategory[category.id].map((product: any) => (
                                    <Link
                                      key={product.id}
                                      to={`/product/${product.slug}`}
                                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white truncate transition-colors"
                                    >
                                      {product.name}
                                    </Link>
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
                <Link
                  key={category.id}
                  to={`/shop?category=${category.slug}`}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-sm transition-colors"
                >
                  {category.name}
                </Link>
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
