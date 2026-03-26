import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ArrowRight, Cpu, Zap, PenTool } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';
import { Reveal } from '../components/Reveal';
import { fetchProducts, Product } from '../services/productService';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <Reveal>
        <section className="relative glass-panel rounded-3xl overflow-hidden mb-16 group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-[2s]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-transparent"></div>
          <div className="relative z-10 px-8 py-24 md:py-32 text-center md:text-left max-w-4xl mx-auto md:mx-0">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Build the Future with <span className="text-electric-blue">Mechafy</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">
              From bulk supply of precision robotics to cutting-edge IT services, Mechafy Global delivers the end-to-end technology your business needs to scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/shop" className="w-full sm:w-48">
                <button className="btn-glow flex items-center justify-center px-4 py-3 text-base font-medium rounded-full text-white w-full">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                </button>
              </Link>
              <Link to="/it-services" className="w-full sm:w-48">
                <button className="btn-glow flex items-center justify-center px-4 py-3 text-base font-medium rounded-full text-white w-full">
                  IT Services <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                </button>
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
