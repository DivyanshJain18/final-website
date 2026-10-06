import { ReactNode, useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Reveal } from './Reveal';
import { PageTransition } from './PageTransition';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { fetchCategories, Category } from '../services/productService';
import { CookieConsent } from './CookieConsent';
import { WhatsAppButton } from './WhatsAppButton';
import { Chatbot } from './Chatbot';
import { AnnouncementBar } from './AnnouncementBar';

export function Layout({ 
  children, 
  showAnnouncement = false 
}: { 
  children: ReactNode; 
  showAnnouncement?: boolean; 
}) {
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
      "https://www.instagram.com/mechafyglobal?igsh=OHBpYTZtZ2Uybnpj",
      "https://www.linkedin.com/company/112983537/"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mechafy Global",
    "image": "https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg",
    "url": "https://www.mechafyglobal.com",
    "telephone": "+91-9817056538",
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
        {showAnnouncement && <AnnouncementBar />}
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
                <a href="https://www.instagram.com/mechafyglobal?igsh=OHBpYTZtZ2Uybnpj" aria-label="Visit Mechafy Global on Instagram" target="_blank" rel="noopener noreferrer" className="group glass-panel p-4 rounded-full transition-all duration-300 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:-translate-y-1 shadow-sm hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">
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

      <footer className="bg-navy-950/95 backdrop-blur-md text-slate-400 pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand Introduction Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-10 mb-10 border-b border-white/10 gap-6">
            <div className="flex items-center">
              <img 
                src="https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg" 
                alt="Mechafy Global Official Logo - Robotics Hardware and B2B IT Services Provider" 
                className="h-12 w-auto object-contain rounded mr-4 border border-white/10"
                referrerPolicy="no-referrer"
                loading="lazy"
                width="48"
                height="48"
              />
              <div>
                <div className="text-white text-xl font-bold tracking-tight">Mechafy Global</div>
                <p className="text-xs text-electric-blue font-medium">(A Unit of Shanti Food Industries)</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              India's premier engineering ecosystem for robotics hardware, 3D printing machinery, high-performance PC components, and enterprise custom IT software solutions.
            </p>
          </div>

          <Reveal width="100%" direction="up" delay={0.1}>
            {/* 5 Distinct Sections */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
              
              {/* 1. Shop */}
              <nav aria-label="Shop Navigation">
                <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-electric-blue pl-2.5">
                  Shop
                </h2>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link to="/shop?category=computer-components" className="hover:text-electric-blue transition-colors">
                      PC Hardware
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop?category=robotic-components" className="hover:text-electric-blue transition-colors">
                      Robotics
                    </Link>
                  </li>
                  <li>
                    <Link to="/3d-printers-filaments#featured-printers" className="hover:text-electric-blue transition-colors">
                      3D Printers
                    </Link>
                  </li>
                  <li>
                    <Link to="/3d-printers-filaments#filaments" className="hover:text-electric-blue transition-colors">
                      Filaments
                    </Link>
                  </li>
                  <li>
                    <Link to="/pc-builder" className="hover:text-electric-blue transition-colors">
                      Custom PC Builder
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* 2. Customer Support */}
              <nav aria-label="Customer Support Navigation">
                <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-400 pl-2.5">
                  Customer Support
                </h2>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-conditions#warranty" className="hover:text-emerald-400 transition-colors">
                      Warranty
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="hover:text-emerald-400 transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* 3. Business */}
              <nav aria-label="Business Inquiries Navigation">
                <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-400 pl-2.5">
                  Business
                </h2>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link to="/contact?subject=B2B%20%2F%20Wholesale%20Inquiry" className="hover:text-amber-400 transition-colors">
                      B2B / Wholesale
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact?subject=Bulk%20Order%20Inquiry" className="hover:text-amber-400 transition-colors">
                      Bulk Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/become-a-reseller" className="hover:text-amber-400 transition-colors">
                      Become a Reseller
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact?subject=Request%20a%20Quote" className="hover:text-amber-400 transition-colors">
                      Request a Quote
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* 4. Company */}
              <nav aria-label="Company Navigation">
                <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-purple-400 pl-2.5">
                  Company
                </h2>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link to="/about" className="hover:text-purple-400 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/careers" className="hover:text-purple-400 transition-colors">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="hover:text-purple-400 transition-colors font-medium">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="hover:text-purple-400 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-conditions" className="hover:text-purple-400 transition-colors">
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* 5. Contact */}
              <address className="not-italic col-span-2 md:col-span-1">
                <h2 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-cyan-400 pl-2.5">
                  Contact
                </h2>
                <div className="space-y-2.5 text-sm">
                  <div className="text-xs text-slate-300 leading-relaxed">
                    582, HSIIDC Industrial Area, Rai, Sonipat, Haryana 131029, IN
                  </div>
                  <div>
                    <a href="tel:+919817056538" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                      +91 9817056538
                    </a>
                  </div>
                  <div>
                    <a href="mailto:info@mechafyglobal.com" className="hover:text-cyan-400 transition-colors truncate block">
                      info@mechafyglobal.com
                    </a>
                  </div>
                  <div className="pt-1">
                    <a 
                      href="https://wa.me/919817056538" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
                    >
                      <span>WhatsApp Support &rarr;</span>
                    </a>
                  </div>
                </div>
              </address>

            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <div>
                Copyright &copy; 2026 Mechafy Global (Unit of Shanti Food Industries) – All Rights Reserved.
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                <span>•</span>
                <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms</Link>
                <span>•</span>
                <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
                <span>•</span>
                <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </footer>
      <CookieConsent />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
}
