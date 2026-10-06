import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArrowRight, Cpu, Zap, PenTool } from 'lucide-react';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { Reveal } from '../components/Reveal';
import { fetchProducts, Product, getProductPath } from '../services/productService';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { SEO } from '../components/SEO';

const PROMO_SLIDES = [
  {
    id: 1,
    title: "Computer Components",
    tagline: "High-performance motherboards, processors, and graphics cards.",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 2,
    title: "Robotics Components",
    tagline: "Precision motors, sensors, and development boards.",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1920&q=80"
  },
  {
    id: 3,
    title: "3D Printers & Accessories",
    tagline: "Advanced printers, scanners, pens, and premium filament.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/3D_Printing_Materials_%2816837486456%29.jpg"
  },
  {
    id: 4,
    title: "IT Services & Solutions",
    tagline: "Custom software, web design, and digital marketing strategies.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const mouseStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % PROMO_SLIDES.length);
    }, 10000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % PROMO_SLIDES.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
    resetTimer();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartXRef.current - touchEndX;
    const diffY = (touchStartYRef.current || 0) - touchEndY;
    // ensure horizontal swipe dominates vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || mouseStartXRef.current === null) return;
    const diffX = mouseStartXRef.current - e.clientX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    isDraggingRef.current = false;
    mouseStartXRef.current = null;
  };

  return (
    <Layout>
      <SEO 
        title="Mechafy Global | Robotics, 3D Printers & PC Hardware Store"
        description="Shop robotics microcontrollers, 3D printers, filaments, and PC gaming hardware. Mechafy Global delivers cutting-edge hardware and B2B IT engineering services."
        canonicalPath="/"
        keywords={['Robotics store India', '3D printers online', 'Filament supplier', 'PC components', 'Mechafy Global']}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Mechafy Global',
          url: 'https://www.mechafyglobal.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.mechafyglobal.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }}
      />
      {/* Hero Section */}
      <Reveal>
        <section 
          className="relative glass-panel rounded-3xl overflow-hidden mb-16 h-[600px] md:h-[500px] select-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { isDraggingRef.current = false; mouseStartXRef.current = null; }}
          aria-roledescription="carousel"
          aria-label="Mechafy Global Highlights"
        >
          {/* Background Slides */}
          {PROMO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 pointer-events-none ${
                index === currentSlide ? 'opacity-40' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${slide.image}')` }}
            ></div>
          ))}
          
          {/* Main Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-navy-900/90 pointer-events-none"></div>
          
          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col justify-center items-center md:items-start text-center md:text-left px-6 py-12 md:px-16 max-w-7xl mx-auto w-full">
            
            {/* Mechafy Logo (Visible on all slides) */}
            <div className="mb-6 flex items-center justify-center md:justify-start gap-3 relative z-10">
              <img 
                src="https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg" 
                alt="Mechafy Global Logo" 
                className="w-10 h-10 md:w-12 md:h-12 rounded shadow-lg object-cover border border-white/10"
              />
              <span className="text-sm md:text-base font-bold text-electric-blue uppercase tracking-widest drop-shadow">Mechafy Global</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 md:mb-8 tracking-tight drop-shadow-lg relative z-10">
              Build the Future with <span className="text-electric-blue">Mechafy</span>
            </h1>
            
            {/* Rotating Category Text */}
            <div className="relative h-24 md:h-32 w-full max-w-3xl overflow-hidden mb-8 md:mb-10 z-10">
               {PROMO_SLIDES.map((slide, index) => (
                 <div 
                   key={slide.id} 
                   className={`absolute inset-0 transition-all duration-700 flex flex-col justify-start ${
                     index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                   }`}
                 >
                   <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg flex items-center justify-center md:justify-start">
                     {slide.title}
                   </h2>
                   <p className="text-base md:text-xl text-slate-200 drop-shadow-md leading-relaxed">
                     {slide.tagline}
                   </p>
                 </div>
               ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto justify-center md:justify-start relative z-10">
              <Link to="/shop" className="inline-flex">
                <span className="btn-glow px-7 py-3 text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto">
                  Shop Hardware <ArrowRight className="h-4 w-4 shrink-0" />
                </span>
              </Link>
              <Link to="/it-services" className="inline-flex">
                <span className="btn-secondary px-7 py-3 text-sm font-bold flex items-center justify-center gap-2 w-full sm:w-auto">
                  IT Services & Custom Solutions <ArrowRight className="h-4 w-4 shrink-0" />
                </span>
              </Link>
            </div>

          </div>
        </section>
      </Reveal>

      {/* Categories Grid */}
      <Reveal delay={0.2}>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard 
              title="Robotic Components" 
              icon={<Cpu className="h-8 w-8 text-electric-blue" />} 
              description="Motors, sensors, and components for your next bot."
              link="/shop?category=robotic-components"
              delay={0}
            />
            <CategoryCard 
              title="Computer Components" 
              icon={<Zap className="h-8 w-8 text-yellow-500" />} 
              description="Processors, memory, and high-performance hardware."
              link="/shop?category=computer-components"
              delay={0.1}
            />
            <CategoryCard 
              title="Tools & Equipment" 
              icon={<PenTool className="h-8 w-8 text-red-500" />} 
              description="Soldering stations, multimeters, and precision tools."
              link="/shop?category=tools"
              delay={0.2}
            />
          </div>
        </section>
      </Reveal>

      {/* Featured Products */}
      <Reveal delay={0.4}>
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Products</h2>
            <Link to="/shop" className="text-electric-blue hover:text-blue-400 font-medium flex items-center group">
              View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <FeaturedProductsGrid />
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

function FeaturedProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 4));
        } else {
          console.error('Products data is not an array:', data);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card h-80 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-blue-500/40"
        >
          <Link to={getProductPath(product)} className="h-52 bg-white/[0.02] flex items-center justify-center p-4 overflow-hidden relative border-b border-white/5">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </Link>
          <div className="p-5 flex flex-col flex-grow">
            <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1.5 truncate">
              {product.category_name || 'Hardware'}
            </div>
            <h3 className="font-bold text-white text-base mb-1.5 line-clamp-1 group-hover:text-blue-400 transition-colors">
              <Link to={getProductPath(product)}>{product.name}</Link>
            </h3>
            <p className="text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed flex-grow">
              {product.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
              <div>
                <span className="text-xs text-slate-500 block leading-none mb-1">Price</span>
                <span className="font-bold text-white text-lg font-mono tabular-nums">₹{product.price.toFixed(2)}</span>
              </div>
              <Link 
                to={getProductPath(product)} 
                className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all font-semibold flex items-center gap-1 group/btn"
              >
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryCard({ title, icon, description, link, delay }: { title: string, icon: ReactNode, description: string, link: string, delay: number }) {
  return (
    <Link to={link} className="block group h-full">
      <div 
        className="glass-card p-6 rounded-2xl h-full"
      >
        <div className="mb-4 bg-white/5 w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-electric-blue/20 transition-colors group-hover:scale-110 duration-300 border border-white/10">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-electric-blue transition-colors">{title}</h3>
        <p className="text-slate-400">{description}</p>
      </div>
    </Link>
  );
}
