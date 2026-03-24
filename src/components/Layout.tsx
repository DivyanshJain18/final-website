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

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mechafy Global",
    "parentOrganization": {
      "@type": "Organization",
      "name": "Shanti Food Industries"
    },
    "url": "https://www.mechafyglobal.com",
    "logo": "https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg",
    "sameAs": [
      "https://www.facebook.com/mechafyglobal",
      "https://www.instagram.com/mechafyglobal",
      "https://www.linkedin.com/company/112983537/"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mechafy Global",
    "image": "https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg",
    "url": "https://www.mechafyglobal.com",
    "telephone": "+91-7015072323",
    "email": "info@mechafyglobal.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "582, HSIIDC Industrial Area",
      "addressLocality": "Rai, Sonipat",
      "addressRegion": "Haryana",
      "postalCode": "131029",
      "addressCountry": "IN"
    },
    "description": "B2B IT service provider offering custom software development, website building, digital marketing, and an e-commerce store for robotics hardware.",
    "priceRange": "$$"
  };

  return (
    <div className="min-h-screen text-slate-200 flex flex-col">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Social Section */}
      <section aria-labelledby="social-heading" className="bg-navy-900/50 backdrop-blur-sm py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal width="100%" direction="up" delay={0.2}>
            <div className="flex flex-col items-center justify-center w-full">
              <h2 id="social-heading" className="text-2xl font-bold text-white uppercase tracking-[0.2em] mb-8 text-center">Connect With Us</h2>
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                <a href="https://www.facebook.com/mechafyglobal" aria-label="Visit Mechafy Global on Facebook" target="_blank" rel="noopener noreferrer" className="group glass-panel p-4 rounded-full transition-all duration-300 hover:bg-blue-600 hover:-translate-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <FaFacebook className="w-6 h-6 text-[#1877F2] group-hover:text-white transition-colors" aria-hidden="true" />
                </a>
                <a href="https://www.instagram.com/mechafyglobal" aria-label="Visit Mechafy Global on Instagram" target="_blank" rel="noopener noreferrer" className="group glass-panel p-4 rounded-full transition-all duration-300 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:-translate-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                  <FaInstagram className="w-6 h-6 text-[#E4405F] group-hover:text-white transition-colors" aria-hidden="true" />
                </a>
                <a href="https://www.linkedin.com/company/112983537/" aria-label="Visit Mechafy Global on LinkedIn" target="_blank" rel="noopener noreferrer" className="group glass-panel p-4 rounded-full transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(29,78,216,0.5)]">
                  <FaLinkedin className="w-6 h-6 text-[#0A66C2] group-hover:text-white transition-colors" aria-hidden="true" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-navy-900/80 backdrop-blur-md text-slate-400 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal width="100%" direction="up" delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <article>
                <div className="flex items-center mb-4">
                  <img 
                    src="https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg" 
                    alt="Mechafy Global Official Logo - Robotics Hardware and B2B IT Services Provider" 
                    className="h-12 w-auto object-contain rounded mr-4"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    width="48"
                    height="48"
                  />
                  <div>
                    <div className="text-white text-lg font-bold">Mechafy Global</div>
                    <p className="text-xs text-slate-400">(A Unit of Shanti Food Industries)</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">The ultimate hub for robotics, hardware, and digital excellence. Whether you need high-end components or expert services in custom software development, website building, and digital marketing, Mechafy Global delivers the tools and tech you need to succeed.</p>
              </article>
              
              <nav aria-label="Shop Navigation">
                <h2 className="text-white text-lg font-bold mb-4">Shop Hardware</h2>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/shop" aria-label="View all robotics and PC products" className="hover:text-cyan-400 transition-colors">All Products</Link></li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link to={`/shop?category=${category.slug}`} aria-label={`Shop ${category.name}`} className="hover:text-cyan-400 transition-colors">
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Company Links">
                <h2 className="text-white text-lg font-bold mb-4">Company & Services</h2>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about" aria-label="Learn more about Mechafy Global" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                  <li><Link to="/it-services" aria-label="Explore our B2B IT Services" className="hover:text-cyan-400 transition-colors">IT Services</Link></li>
                  <li><Link to="/contact" aria-label="Contact our support team" className="hover:text-cyan-400 transition-colors">Contact Us</Link></li>
                </ul>
              </nav>
              
              <address className="not-italic">
                <h2 className="text-white text-lg font-bold mb-4">Contact Information</h2>
                <ul className="space-y-2 text-sm">
                  <li>Email: <a href="mailto:info@mechafyglobal.com" aria-label="Email Mechafy Global" className="hover:text-cyan-400 transition-colors">info@mechafyglobal.com</a></li>
                  <li>Phone: <a href="tel:+917015072323" aria-label="Call Mechafy Global" className="hover:text-cyan-400 transition-colors">+91 7015072323</a></li>
                  <li>Address: 582, HSIIDC Industrial Area, Rai, Sonipat, Haryana 131029, IN</li>
                </ul>
              </address>
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
