import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArrowRight, Cpu, Zap, PenTool } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';
import { Reveal } from '../components/Reveal';
import { fetchProducts, Product } from '../services/productService';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % PROMO_SLIDES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <Reveal>
        <section className="relative glass-panel rounded-3xl overflow-hidden mb-16 h-[600px] md:h-[500px]">
          {/* Background Slides */}
          {PROMO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-40' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${slide.image}')` }}
            ></div>
          ))}
          
          {/* Main Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-navy-900/95 via-navy-900/70 to-navy-900/90"></div>
          
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
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start relative z-10">
              <Link to="/shop" className="w-full sm:w-48">
                <button className="bg-electric-blue hover:bg-cyan-400 transition-colors flex items-center justify-center px-4 py-3 text-base font-medium rounded-full text-navy-900 w-full shadow-lg">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                </button>
              </Link>
              <Link to="/it-services" className="w-full sm:w-48">
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 transition-colors flex items-center justify-center px-4 py-3 text-base font-medium rounded-full text-white w-full backdrop-blur-sm shadow-sm">
                  IT Services <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                </button>
              </Link>
            </div>

          </div>

          {/* Navigation Controls at bottom center */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {PROMO_SLIDES.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-electric-blue' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
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
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Products</h2>
            <Link to="/shop" className="text-electric-blue hover:text-blue-400 font-medium flex items-center group">
              View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <FeaturedProductsGrid />
        </section>
      </Reveal>
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
      {products.map((product, index) => (
        <div 
          key={product.id} 
          className="glass-card rounded-xl overflow-hidden flex flex-col group"
        >
          <Link to={`/product/${product.slug}`} className="h-48 bg-white/5 flex items-center justify-center overflow-hidden relative">
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
            <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-electric-blue transition-colors">{product.name}</h3>
            <p className="text-slate-400 text-sm mb-3 line-clamp-2 flex-grow">{product.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-bold text-white">₹{product.price.toFixed(2)}</span>
              <Link to={`/product/${product.slug}`} className="text-sm text-electric-blue hover:text-blue-400 font-medium flex items-center group-hover:translate-x-1 transition-transform">View <ArrowRight className="ml-1 w-4 h-4" /></Link>
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
