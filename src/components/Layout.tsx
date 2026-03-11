import { ReactNode, useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Reveal } from './Reveal';
import { PageTransition } from './PageTransition';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { fetchCategories, Category } from '../services/productService';

export function Layout({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen text-slate-200 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Social Section */}
      <section className="bg-navy-900/50 backdrop-blur-sm py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal width="100%" direction="up" delay={0.2}>
            <div className="flex flex-col items-center justify-center w-full">
              <h2 className="text-2xl font-bold text-white uppercase tracking-[0.2em] mb-8 text-center">Social</h2>
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                <a href="https://www.facebook.com/share/18EWMxUAeA/" className="group glass-panel p-4 rounded-full transition-all duration-300 hover:bg-blue-600 hover:-translate-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <FaFacebook className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="group glass-panel p-4 rounded-full transition-all duration-300 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:-translate-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                  <FaInstagram className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="group glass-panel p-4 rounded-full transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(29,78,216,0.5)]">
                  <FaLinkedin className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-navy-900/80 backdrop-blur-md text-slate-400 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal width="100%" direction="up" delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <img 
                    src="https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg" 
                    alt="Mechafy Global Logo" 
                    className="h-12 w-auto object-contain rounded mr-4"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-white text-lg font-bold">Mechafy Global</h3>
                    <p className="text-xs text-slate-400">(A Unit of Shanti Food Industries)</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">Your one-stop shop for robotics, microcontrollers, and high-performance PC components.</p>
              </div>
              
              <div>
                <h3 className="text-white text-lg font-bold mb-4">Shop</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/shop" className="hover:text-cyan-400 transition-colors">All Products</Link></li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link to={`/shop?category=${category.slug}`} className="hover:text-cyan-400 transition-colors">
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white text-lg font-bold mb-4">Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
                <ul className="space-y-2 text-sm">
                  <li>Email: info@mechafyglobal.com</li>
                  <li>Phone: +91 7015072323</li>
                  <li>Address: 582, HSIIDC Industrial Area, Rai, Sonipat, Haryana 131029</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
              Copyright &copy; 2026 Mechafy Global – All Rights Reserved.
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  );
}
