import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { Globe, LayoutTemplate, ShoppingCart, Server, Code, Wrench } from 'lucide-react';

export default function ITServices() {
  const services = [
    {
      icon: <LayoutTemplate className="h-8 w-8 text-electric-blue" />,
      title: "Landing Pages",
      description: "High-converting, beautifully designed landing pages optimized for lead generation and marketing campaigns."
    },
    {
      icon: <Globe className="h-8 w-8 text-electric-blue" />,
      title: "Custom Website Building",
      description: "From corporate sites to personal portfolios, we build fully responsive, modern websites tailored to your brand."
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-electric-blue" />,
      title: "E-Commerce Solutions",
      description: "Robust online stores with secure payment gateways, inventory management, and seamless shopping experiences."
    },
    {
      icon: <Server className="h-8 w-8 text-electric-blue" />,
      title: "Website Hosting",
      description: "Fast, secure, and reliable hosting solutions with 99.9% uptime guarantees to keep your business online."
    },
    {
      icon: <Code className="h-8 w-8 text-electric-blue" />,
      title: "Web App Development",
      description: "Complex, interactive web applications built with cutting-edge technologies like React, Node.js, and Firebase."
    },
    {
      icon: <Wrench className="h-8 w-8 text-electric-blue" />,
      title: "Maintenance & Support",
      description: "Ongoing website maintenance, security updates, and technical support to ensure everything runs smoothly."
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Reveal width="100%">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Professional <span className="text-electric-blue">Web & IT Services</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Empower your digital presence with our comprehensive suite of web solutions. 
              From high-converting landing pages to full-scale e-commerce platforms and reliable hosting, 
              we build technology that drives your business forward.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Reveal key={index} width="100%" delay={index * 0.1}>
              <div className="glass-card p-8 h-full flex flex-col rounded-2xl">
                <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-slate-400 flex-grow leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal width="100%" delay={0.4}>
          <div className="mt-20 glass-panel p-10 rounded-3xl text-center border border-electric-blue/20 bg-gradient-to-b from-electric-blue/5 to-transparent">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Digital Presence?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your specific requirements and discover how our 
              web and IT services can help your business thrive online.
            </p>
            <a href="/contact" className="btn-glow inline-block px-8 py-4 text-lg">
              Get a Free Consultation
            </a>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}
