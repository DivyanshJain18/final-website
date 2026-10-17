import { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { 
  ArrowRight, Globe, Truck, Users, Cpu, ShieldCheck, Zap, 
  Building2, Award, Target, Compass, Sparkles, MapPin, Phone, Mail, 
  ExternalLink, Layers, Microscope, HardDrive, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Breadcrumb } from '../components/Breadcrumb';

const ABOUT_SLIDES = [
  {
    id: 1,
    title: "Computer Hardware & IT Infrastructure",
    subtitle: "Enterprise CPUs, Motherboards, GPUs, RAM & Custom Workstations",
    description: "Sourcing verified high-performance compute components from global Tier-1 semiconductor brands for Indian businesses and universities.",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1920&q=80",
    badge: "Computer Hardware"
  },
  {
    id: 2,
    title: "Robotics Hardware & Embedded Silicon",
    subtitle: "Industrial Sensors, Microcontrollers, STM32, ESP32 & Dev Boards",
    description: "Authentic microcontrollers, motor drivers, sensor arrays, and embedded robotics components with zero counterfeit tolerance.",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1920&q=80",
    badge: "Robotics & Embedded"
  },
  {
    id: 3,
    title: "3D Printers & Additive Manufacturing",
    subtitle: "Bambu Lab, Creality, Anycubic Printers & 3D Optical Scanners",
    description: "High-speed multi-color 3D printers, precision hotends, replacement nozzles, and professional 3D metrology scanners.",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1920&q=80",
    badge: "3D Printing & Scanners"
  },
  {
    id: 4,
    title: "Engineering Filaments & Printing Materials",
    subtitle: "Carbon-Fiber, PETG, TPU, PLA+, ABS & Photopolymer Resins",
    description: "Laboratory-tested filament spools engineered for extreme tensile strength, thermal resistance, and precise layer bonding.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4b/3D_Printing_Materials_%2816837486456%29.jpg",
    badge: "Advanced Materials"
  },
  {
    id: 5,
    title: "Sonipat Logistics & Physical Distribution Hub",
    subtitle: "Direct Inventory Storage, Inspection Bench & Express Nationwide Cargo",
    description: "Centrally located in HSIIDC Industrial Estate, Rai, ensuring rigorous pre-dispatch testing and 24-48 hour fulfillment.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80",
    badge: "Warehouse & Hub"
  },
  {
    id: 6,
    title: "Enterprise IT Services & Engineering",
    subtitle: "Custom Web Platforms, Software Architecture & Infrastructure",
    description: "End-to-end technology deployment from hardware integration to bespoke corporate portals, cloud systems, and data pipelines.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80",
    badge: "Enterprise IT"
  }
];

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const mouseStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % ABOUT_SLIDES.length);
    }, 10000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % ABOUT_SLIDES.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + ABOUT_SLIDES.length) % ABOUT_SLIDES.length);
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <SEO 
        title="About Mechafy Global | Corporate Overview & Leadership"
        description="Learn about Mechafy Global (A Unit of Shanti Food Industries, sister venture of Kailash Chemicals). Based in Sonipat, Haryana, delivering enterprise robotics, 3D printing machinery, PC hardware & custom IT solutions."
        canonicalPath="/about"
        keywords={['About Mechafy Global', 'Divyansh Jain', 'Director Mechafy', 'Shanti Food Industries', 'Kailash Chemicals', 'Sonipat Industrial Area', 'Robotics Supplier India']}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Mechafy Global',
          description: 'Official corporate overview, mission, facility, and leadership of Mechafy Global.'
        }}
      />

      <div className="mb-6">
        <Breadcrumb items={[{ name: 'About Mechafy Global' }]} />
      </div>

      {/* 1. HERO — AUTOMATIC 10-SECOND IMAGE SLIDER & HEADER BANNER */}
      <section 
        className="relative glass-panel rounded-3xl overflow-hidden mb-20 min-h-[580px] md:min-h-[520px] flex items-center select-none cursor-grab active:cursor-grabbing border border-white/10 shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { isDraggingRef.current = false; mouseStartXRef.current = null; }}
        aria-roledescription="carousel"
        aria-label="Mechafy Global Industry Highlights"
      >
        {/* Background Slides with Smooth Transition */}
        {ABOUT_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 pointer-events-none ${
              index === currentSlide ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ 
              backgroundImage: `url('${slide.image}')`,
              transition: 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1), transform 6000ms ease-out'
            }}
          />
        ))}

        {/* Deep Gradient Overlays for Guaranteed Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40 pointer-events-none" />
        <div className="absolute inset-0 bg-electric-blue/5 mix-blend-overlay pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-12 md:p-16 max-w-4xl text-left w-full">
          {/* Main Headline without the header banner tag */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
            Pioneering High-Precision Hardware <br className="hidden sm:inline" />
            <span className="text-electric-blue">& Enterprise Computing for India.</span>
          </h1>

          {/* Dynamic Slide Showcase */}
          <div className="relative h-24 sm:h-20 w-full overflow-hidden mb-6">
            {ABOUT_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 flex flex-col justify-start ${
                  idx === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-electric-blue font-bold">
                    {slide.badge}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs font-mono text-slate-400">
                    0{idx + 1} / 0{ABOUT_SLIDES.length}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight drop-shadow line-clamp-1">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-light drop-shadow line-clamp-1 sm:line-clamp-2">
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light mb-8 max-w-2xl drop-shadow">
            Mechafy Global is an engineering procurement, additive manufacturing, and institutional hardware partner headquartered in Sonipat, Haryana. We bridge the critical supply gap between international component manufacturers and Indian innovators, universities, and industrial enterprises.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => scrollToSection('leadership')}
              className="px-6 py-3 bg-electric-blue hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-[0_2px_12px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.5)] cursor-pointer"
            >
              Meet Leadership
            </button>
            <button
              onClick={() => scrollToSection('facility')}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-all rounded-xl cursor-pointer"
            >
              Explore Facility & Hub
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {ABOUT_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                setCurrentSlide(idx);
                resetTimer();
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide 
                  ? 'w-8 bg-electric-blue shadow-[0_0_10px_rgba(37,99,235,0.8)]' 
                  : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
            />
          ))}
        </div>
      </section>

      {/* 2. OUR STORY & ROOTS — WITH OFFICIAL MECHAFY GLOBAL LOGO */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-blue font-bold">15 Years Industrial Legacy</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Story
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Mechafy Global represents the technology & automation arm of our parent company, <a href="https://www.kailashchemicals.com" target="_blank" rel="noopener noreferrer" className="text-electric-blue font-bold hover:underline inline-flex items-center gap-1">Kailash Chemicals <ExternalLink className="w-3 h-3" /></a> (operating through Shanti Food Industries), which has operated with distinction in global import, export, and industrial supply for over 15 years.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Recognizing the acute friction faced by Indian researchers, tech startups, and industrial units when attempting to source genuine electronics, reliable 3D printing components, and commercial-grade microcontrollers, Mechafy Global was founded to bring direct manufacturer relationships, strict quality bench-testing, and transparent GST invoicing to the domestic tech landscape.
            </p>
            <div className="p-4 bg-white/5 border-l-2 border-electric-blue text-xs text-slate-300 leading-relaxed rounded-r-xl">
              Operating out of Phase 1, HSIIDC Industrial Estate in Rai, Sonipat, our infrastructure allows rapid road and air dispatches across North India and all major national metro hubs.
            </div>
          </div>

          {/* Official Mechafy Global Logo replacing the previous photograph */}
          <div className="lg:col-span-6">
            <div className="border border-white/10 bg-navy-950 p-8 sm:p-12 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[360px] text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 via-transparent to-blue-500/5 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/15 shadow-2xl mb-5 group-hover:scale-105 transition-transform duration-300 backdrop-blur-md">
                  <img
                    src="https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg"
                    alt="Mechafy Global Official Brand Identity"
                    className="w-48 sm:w-60 h-auto max-h-48 object-contain rounded-xl shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Mechafy Global</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">A Unit of Shanti Food Industries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION (Split Editorial Layout) */}
      <section className="mb-20 py-12 border-y border-white/10 bg-white/[0.01]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-8 border border-white/10 bg-navy-950/80 space-y-3 rounded-xl">
            <div className="flex items-center gap-3 text-electric-blue">
              <Target className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Our Mission</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              To eliminate hardware procurement latency for Indian innovators by providing dependable access to verified robotics silicon, high-grade additive materials, precision tooling, and custom compute platforms backed by transparent technical specifications and domestic support.
            </p>
          </div>

          <div className="p-8 border border-white/10 bg-navy-950/80 space-y-3 rounded-xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <Compass className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Our Vision</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              To be recognized as India's most trustworthy B2B hardware distribution ecosystem — empowering schools, university research centers, industrial automation facilities, and enterprise developers with zero counterfeit compromises.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE DO & TECHNOLOGY AREAS */}
      <section className="mb-20 text-left">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-blue font-bold">Capability Spectrum</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            What We Do & Technology Areas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Multi-disciplinary hardware coverage paired with digital execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-white/10 bg-navy-950/70 rounded-xl">
            <Cpu className="w-6 h-6 text-electric-blue mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Robotics & Microcontrollers</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Industrial sensors, motor drivers, ESP32, STM32, Arduino, Raspberry Pi, step motors, and precision wiring harnesses for embedded automation.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70 rounded-xl">
            <Layers className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">3D Printing & Materials</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bambu Lab, Creality, Anycubic 3D printers, specialized engineering filaments (Carbon Fiber, PETG, TPU, PLA+), 3D optical scanners, and hardened nozzles.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70 rounded-xl">
            <HardDrive className="w-6 h-6 text-yellow-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Computer Architecture & PC Builds</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              High-performance workstation CPUs, motherboards, GPUs, DDR4/DDR5 memory, NVMe SSD arrays, power supplies, and turnkey custom rigs.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70 rounded-xl">
            <Microscope className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Lab Tooling & Instruments</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Precision multimeters, oscilloscopes, variable DC bench power supplies, temperature-controlled soldering stations, and inspection gear.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70 rounded-xl">
            <Sparkles className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Enterprise IT Services</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full-stack software engineering, bespoke corporate websites, portal development, cloud hosting, and data management solutions.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70 rounded-xl">
            <Building2 className="w-6 h-6 text-pink-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Institutional Procurement</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consolidated tender fulfillment, rate contracts, bulk packing, and dedicated account management for educational and government bodies.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INDUSTRIES WE SERVE */}
      <section className="mb-20 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
          Industries Served
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Higher Education & Research', desc: 'Robotics labs, incubation centers, and university engineering departments.' },
            { name: 'Industrial Automation', desc: 'Assembly line retrofitting, sensor integrations, and predictive maintenance.' },
            { name: 'Additive Manufacturing Labs', desc: 'Rapid prototyping studios, architectural models, and small-batch production.' },
            { name: 'Commercial IT & Software', desc: 'Compute infrastructure, web applications, and corporate cloud architecture.' }
          ].map((ind, i) => (
            <div key={i} className="p-5 border border-white/10 bg-navy-950/60 rounded-xl">
              <span className="text-xs font-mono font-bold text-electric-blue block mb-2">0{i+1}</span>
              <h3 className="text-sm font-bold text-white mb-1">{ind.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FACILITY & LOGISTICS HUB — BENCH TESTING & WAREHOUSE PHOTO */}
      <section id="facility" className="mb-20 py-12 border-y border-white/10 bg-white/[0.01] text-left scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-blue font-bold">Physical Operational Hub</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Warehouse & Testing Facility
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Unlike broker services or drop-shippers, Mechafy Global maintains direct physical stock in our warehouse and inspection lab situated at Plot 582, HSIIDC Industrial Area, Rai, Sonipat, Haryana (PIN: 131029).
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-slate-400 block">Hub Location:</span>
                <span className="text-white font-bold">Rai, Sonipat, Haryana</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-slate-400 block">Transit Speed:</span>
                <span className="text-white font-bold">24-48 Hours Express Cargo</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2">
              Every incoming batch undergoes rigorous voltage tolerance checks, stepper motor torque test benches, and packaging reinforcement before dispatch.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-navy-950 p-2.5 rounded-2xl shadow-xl">
              <div className="aspect-[4/3] overflow-hidden bg-navy-900 rounded-xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                  alt="Mechafy Global Hardware Inspection and Testing Facility Bench at Sonipat Hub"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-xs text-slate-200 font-mono">Sonipat Warehouse Inspection & Testing Bay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LEADERSHIP (DIRECTOR: DIVYANSH JAIN) */}
      <section id="leadership" className="mb-20 text-left scroll-mt-24">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-blue font-bold">Executive Management</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Leadership
          </h2>

          <div className="pt-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Divyansh Jain
            </h3>
            <p className="text-sm font-mono text-electric-blue font-semibold mt-0.5">
              Director — Mechafy Global
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-light pt-2">
            <p>
              Divyansh Jain leads the strategic direction, international partnerships, and operational governance at Mechafy Global. Anchored in technology, engineering entrepreneurship, and global trade dynamics, his focus centers on developing reliable tech supply ecosystems that accelerate high-impact R&D across India.
            </p>
            <p>
              Under his guidance, Mechafy Global expanded from core component distribution into dedicated additive manufacturing supply, industrial robotics, custom compute integration, and bespoke enterprise software solutions. His leadership emphasizes transparency, uncompromising component authenticity, and institutional-grade fulfillment standards.
            </p>
          </div>
        </div>
      </section>

      {/* 8. WHY MECHAFY GLOBAL (Checklist Table) */}
      <section className="mb-20 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
          Why Work With Mechafy Global?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Zero Counterfeit Guarantee', desc: 'Direct authorized factory sourcing. Every integrated circuit, microcontroller, and sensor is 100% genuine.' },
            { title: 'Transparent Condition Disclosures', desc: 'Every product clearly marked: New, Open Box, Refurbished, or Used. We never disguise product condition.' },
            { title: 'Compliant Invoicing & ITC', desc: 'Complete GST tax invoices provided on every retail and wholesale transaction for immediate input tax credits.' },
            { title: 'Engineer-Led Guidance', desc: 'Direct consultations with tech specialists who understand pinouts, power ratings, and firmware architectures.' },
            { title: 'Fast Logistics & Insured Transit', desc: 'Dispatched directly from our Northern distribution hub with shockproof packaging and cargo coverage.' },
            { title: 'Specialized Institutional Programs', desc: 'Volume price breaks, purchase order payment terms, and consolidated tender deliveries.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 border border-white/10 bg-navy-950/70 flex items-start gap-3 rounded-xl">
              <Check className="w-5 h-5 text-electric-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CONTACT & OFFICIAL REGISTRATION DETAILS */}
      <section className="mb-16 border border-white/10 bg-navy-950 p-8 sm:p-12 text-left rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-blue font-bold">Connect With Our Team</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Discuss Your Project?</h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Whether you need 1,000 microcontrollers for industrial assembly, custom 3D printer calibration filaments, or an enterprise IT deployment, our team is ready to assist.
            </p>
            <div className="flex flex-wrap gap-4 pt-3 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-electric-blue" />
                <span>582, HSIIDC Industrial Area, Rai, Sonipat, Haryana 131029</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 9817056538</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span>info@mechafyglobal.com</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-start md:justify-end">
            <Link
              to="/contact"
              className="px-6 py-3.5 bg-electric-blue hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 rounded-xl shadow-[0_2px_12px_rgba(37,99,235,0.35)]"
            >
              <span>Contact Sales & Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
