import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { ArrowRight, CheckCircle, Globe, Truck, Users, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const scrollToAbout = () => {
    const element = document.getElementById('about-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      {/* 1. Hero Banner */}
      <Reveal width="100%">
        <section className="relative glass-panel rounded-3xl overflow-hidden mb-16 h-[500px] flex items-center group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1952&q=80')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-transparent"></div>
          <div className="relative z-10 px-8 md:px-16 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Transform Your Business with <span className="text-electric-blue">Mechafy Global</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">
              Your trusted partner for premium robotics, electronics, and computing solutions.
            </p>
            <button 
              onClick={scrollToAbout}
              className="btn-glow inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-white"
            >
              Find Out More <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>
      </Reveal>

      {/* 2. About Mechafy Global */}
      <section id="about-section" className="mb-20 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal width="100%">
            <div className="glass-panel overflow-hidden h-full min-h-[400px] group">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Industrial Robotics Equipment" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </Reveal>
          
          <Reveal width="100%" delay={0.2}>
            <div>
              <div className="flex items-start mb-6">
                <img 
                  src="https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg" 
                  alt="Mechafy Global Logo" 
                  className="h-16 w-auto object-contain rounded mr-4 mt-1"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-sm font-bold text-electric-blue uppercase tracking-wider mb-2">Who We Are</h2>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">About Mechafy Global</h3>
                </div>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Mechafy Global is a premier global wholesale supplier dedicated to powering the future of technology. We specialize in providing high-quality robotics systems, advanced electronic components, and robust computer hardware to a diverse clientele worldwide.
                </p>
                <div className="p-4 bg-white/5 border-l-4 border-electric-blue rounded-r-lg my-6 backdrop-blur-sm">
                  <p className="text-white italic">
                    "Mechafy Global is a proud new venture of our parent company, <a href="https://www.kailashchemicals.com" target="_blank" rel="noopener noreferrer" className="text-electric-blue font-bold hover:underline">Kailash Chemicals</a>, which has been a trusted leader in the export and import of Food and Pharmaceutical Chemicals for the past 15 years."
                  </p>
                </div>
                <p>
                  Our mission is to bridge the gap between innovation and accessibility. Whether you are scaling an industrial operation or equipping an educational institution, we provide reliable products, competitive pricing, and scalable supply solutions tailored to your specific needs.
                </p>
                <p>
                  With a commitment to excellence and a deep understanding of the tech landscape, Mechafy Global stands as a pillar of support for businesses and innovators looking to push the boundaries of what's possible.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Our Services */}
      <Reveal width="100%">
        <section className="mb-20 glass-panel p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive solutions designed to streamline your supply chain and empower your projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { title: 'Wholesale Supply', icon: Cpu, desc: 'Direct access to a vast inventory of robotics systems, electronic components, and computing hardware at unbeatable wholesale rates.' },
              { title: 'Global Shipping', icon: Globe, desc: 'Efficient and reliable logistics network ensuring your components reach you anywhere in the world, on time and in perfect condition.' },
              { title: 'Dedicated Support', icon: Users, desc: 'Personalized sales assistance and technical guidance from our team of experts to help you select the right components for your needs.' }
            ].map((service, index) => (
              <div 
                key={index}
                className="glass-card p-8 rounded-2xl hover:border-electric-blue/50 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-6 text-electric-blue group-hover:bg-electric-blue/20 transition-colors">
                  <service.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 4. Why Choose Us */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal width="100%">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Why Choose Us?</h2>
              <div className="space-y-6">
                {[
                  { title: 'Genuine & Quality Products', desc: 'We source directly from trusted manufacturers to ensure authenticity and performance.', icon: ShieldCheck },
                  { title: 'Competitive Pricing', desc: 'Best-in-market rates designed to maximize your profit margins and project budget.', icon: Zap },
                  { title: 'Technical Support', desc: 'Expert advice and troubleshooting to keep your operations running smoothly.', icon: Cpu },
                  { title: 'Fast Delivery', desc: 'Optimized logistics for quick turnaround times on all orders.', icon: Truck },
                  { title: 'Bulk & Institutional Supply', desc: 'Specialized programs for schools, universities, and large-scale enterprises.', icon: Users },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start group"
                  >
                    <div className="flex-shrink-0 mt-1 p-1 bg-white/5 border border-white/10 rounded-full group-hover:bg-electric-blue/20 transition-colors">
                      <CheckCircle className="h-6 w-6 text-electric-blue" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          
          <Reveal width="100%" delay={0.2}>
            <div className="relative">
              <div className="absolute inset-0 bg-electric-blue blur-[100px] opacity-20 rounded-full animate-pulse"></div>
              <div 
                className="relative glass-panel p-8 hover:scale-[1.02] transition-transform duration-500"
              >
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Team working on electronics" 
                  className="rounded-xl w-full object-cover h-80 mb-6"
                  referrerPolicy="no-referrer"
                />
                <div className="text-center">
                  <p className="text-4xl font-bold text-white mb-2">
                    1000+
                  </p>
                  <p className="text-slate-400 text-sm uppercase tracking-wider">Happy Clients Worldwide</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Who We Serve */}
      <Reveal width="100%">
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Who We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              "Engineering Students",
              "Robotics Enthusiasts",
              "Schools & Colleges",
              "Tech Startups",
              "Computer Repair Shops"
            ].map((client, index) => (
              <div 
                key={index} 
                className="glass-card p-6 rounded-xl text-center hover:bg-white/10 transition-all group cursor-default hover:-translate-y-1 hover:border-electric-blue/50"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-electric-blue/20 transition-colors group-hover:scale-110 duration-300">
                  <span className="text-electric-blue font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-white font-medium">{client}</h3>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 6. Our Vision */}
      <Reveal width="100%">
        <section className="relative glass-panel bg-gradient-to-r from-electric-blue/10 to-blue-900/20 p-12 md:p-20 text-center overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Vision</h2>
            <p className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed italic">
              "To become the leading global supplier of robotics and computing components, empowering the next generation of innovators with the tools they need to build the future."
            </p>
            <div className="mt-10">
              <Link to="/contact">
                <button
                  className="btn-glow inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-white"
                >
                  Partner With Us
                </button>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </Layout>
  );
}
