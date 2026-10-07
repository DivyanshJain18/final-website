import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArrowRight, Cpu, Zap, PenTool, Bot, Printer, Code2, Star } from 'lucide-react';
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
              <span className="block text-white">Engineering Technology.</span>
              <span className="block text-electric-blue">Built for What's Next.</span>
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

      {/* Categories Grid (2x2 on desktop) */}
      <Reveal delay={0.2}>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CategoryCard 
              title="Computer Hardware" 
              icon={<Cpu className="h-7 w-7 text-electric-blue" />} 
              description="Enterprise motherboards, processors (Intel & AMD), workstation memory, NVMe arrays, GPUs, and high-wattage SMPS."
              link="/shop?category=computer-components"
              linkText="Browse Components →"
              accentColor="blue"
            />
            <CategoryCard 
              title="Robotics & Sensors" 
              icon={<Bot className="h-7 w-7 text-amber-400" />} 
              description="Microcontrollers (ESP32, STM32, Arduino), industrial sensors, stepper/servo motors, motor drivers, and lab test tools."
              link="/shop?category=robotic-components"
              linkText="Explore Robotics →"
              accentColor="yellow"
            />
            <CategoryCard 
              title="3D Printing & Additive" 
              icon={<Printer className="h-7 w-7 text-purple-400" />} 
              description="Bambu Lab, Creality, Anycubic 3D printers, engineering polymers (PLA+, PETG, Carbon Fiber, TPU), 3D scanners, and nozzles."
              link="/3d-printers-filaments"
              linkText="Visit MECHAFY 3D →"
              accentColor="purple"
            />
            <CategoryCard 
              title="IT & Software Services" 
              icon={<Code2 className="h-7 w-7 text-emerald-400" />} 
              description="Full-stack software engineering, bespoke web platforms, secure corporate hosting, and B2B cloud infrastructure."
              link="/it-services"
              linkText="Explore IT Services →"
              accentColor="green"
            />
          </div>
        </section>
      </Reveal>

      {/* Fulfillment Lifecycle — From Requirement to Delivery (Before Featured Products) */}
      <Reveal delay={0.3}>
        <section className="mb-16">
          <div className="mb-8 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-blue block mb-2 font-semibold">
              FULFILLMENT LIFECYCLE
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2.5">
              From Requirement to Delivery.
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
              Transparent, accountable, and SLA-driven hardware distribution for labs, factories, and tech teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
            {[
              {
                step: '01',
                title: 'Tell Us Your Requirement',
                desc: 'Share your exact bill-of-materials, specifications, or engineering goals.'
              },
              {
                step: '02',
                title: 'We Recommend the Solution',
                desc: 'Our technical specialists review component compatibility and volume requirements.'
              },
              {
                step: '03',
                title: 'Receive Your Quote',
                desc: 'Get competitive GST-inclusive wholesale rates with clear delivery timelines.'
              },
              {
                step: '04',
                title: 'Confirm Your Order',
                desc: 'Lock in pricing via bank transfer, purchase order, or secure payment channel.'
              },
              {
                step: '05',
                title: 'Dispatch & Delivery',
                desc: 'Inspected, shock-packed, and shipped insured cargo with live tracking.'
              }
            ].map((item) => (
              <div 
                key={item.step}
                className="group border border-white/10 bg-navy-950/80 p-5 rounded-2xl flex flex-col justify-between h-full hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-electric-blue font-mono mb-4 tracking-wider">
                    {item.step}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
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

      {/* Testimonials Section (After Featured Products) */}
      <Reveal delay={0.5}>
        <section className="mb-16 text-left">
          <div className="mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-blue block mb-2 font-semibold">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2.5">
              Trusted by Engineering Teams & Labs
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-3xl leading-relaxed">
              Real feedback from technical directors, robotics researchers, and hardware builders partnering with Mechafy Global.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Mechafy Global supplied our entire robotics lab with genuine STM32 dev boards, sensors, and actuators within 48 hours. Proper GST invoices, shockproof packaging, and zero counterfeit risk.",
                author: "Dr. Arvind Rao",
                role: "Head of Robotics Lab"
              },
              {
                quote: "The additive manufacturing hardware and engineering carbon-fiber filaments we procured from Mechafy 3D perform flawlessly under heavy duty cycle testing. Their technical team truly knows hardware.",
                author: "Rohan Mehta",
                role: "Technical Director"
              },
              {
                quote: "From enterprise server motherboards to custom web platform engineering, Mechafy delivered with precision and strict SLA compliance. A dependable B2B partner for growing tech firms.",
                author: "Pooja Sharma",
                role: "VP Engineering"
              }
            ].map((testimonial, idx) => (
              <div 
                key={idx}
                className="border border-white/10 bg-navy-950/80 p-6 md:p-7 rounded-2xl flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light italic">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-white font-bold text-sm tracking-tight">
                    {testimonial.author}
                  </h4>
                  <p className="text-xs text-electric-blue font-medium mt-0.5">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
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

interface CategoryCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  link: string;
  linkText: string;
  accentColor: 'blue' | 'yellow' | 'purple' | 'green';
}

function CategoryCard({ title, icon, description, link, linkText, accentColor }: CategoryCardProps) {
  const accentStyles = {
    blue: {
      border: 'hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 border-blue-500/20 text-electric-blue group-hover:bg-blue-500/20',
      titleHover: 'group-hover:text-electric-blue',
      link: 'text-electric-blue group-hover:text-blue-300',
    },
    yellow: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500/20',
      titleHover: 'group-hover:text-amber-400',
      link: 'text-amber-400 group-hover:text-amber-300',
    },
    purple: {
      border: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20',
      titleHover: 'group-hover:text-purple-400',
      link: 'text-purple-400 group-hover:text-purple-300',
    },
    green: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20',
      titleHover: 'group-hover:text-emerald-400',
      link: 'text-emerald-400 group-hover:text-emerald-300',
    },
  }[accentColor];

  return (
    <Link to={link} className="block group h-full">
      <div 
        className={`glass-card p-6 md:p-8 rounded-2xl h-full flex flex-col justify-between border border-white/10 ${accentStyles.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 bg-navy-950/70`}
      >
        <div>
          <div className={`mb-5 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 border ${accentStyles.iconBg}`}>
            {icon}
          </div>
          <h3 className={`text-xl font-bold text-white mb-2.5 transition-colors ${accentStyles.titleHover}`}>
            {title}
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 font-light">
            {description}
          </p>
        </div>
        <div className={`font-semibold text-sm flex items-center gap-1.5 transition-colors ${accentStyles.link}`}>
          <span>{linkText}</span>
        </div>
      </div>
    </Link>
  );
}
