import { Layout } from '../components/Layout';
import { 
  ArrowRight, CheckCircle, Globe, Truck, Users, Cpu, ShieldCheck, Zap, 
  Building2, Award, Target, Compass, Sparkles, MapPin, Phone, Mail, 
  ExternalLink, Layers, Microscope, HardDrive, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Breadcrumb } from '../components/Breadcrumb';

export default function About() {
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

      {/* 1. HERO — EDITORIAL & REAL CORPORATE PRESENCE */}
      <section className="mb-20 pt-4">
        <div className="border border-white/10 bg-navy-950/80 p-8 sm:p-14 text-left relative overflow-hidden rounded-2xl shadow-xl">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/15 text-xs uppercase tracking-widest text-electric-blue font-mono rounded-full">
              Corporate Overview & Engineering Heritage
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Pioneering High-Precision Hardware <br />
              <span className="text-electric-blue">& Enterprise Computing for India.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Mechafy Global is an engineering procurement, additive manufacturing, and institutional hardware partner headquartered in Sonipat, Haryana. We bridge the critical supply gap between international component manufacturers and Indian engineers, businesses, and universities.
            </p>

            <div className="flex flex-wrap gap-4 pt-3">
              <button
                onClick={() => scrollToSection('leadership')}
                className="px-6 py-3 bg-electric-blue hover:bg-blue-400 text-black font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-[0_2px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.45)] cursor-pointer"
              >
                Meet Leadership
              </button>
              <button
                onClick={() => scrollToSection('facility')}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-all rounded-xl cursor-pointer"
              >
                Explore Facility & Hub
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY & ROOTS */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-blue">15 Years Industrial Legacy</span>
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

          <div className="lg:col-span-6">
            <div className="border border-white/10 bg-navy-950 p-2.5 rounded-2xl shadow-xl">
              <div className="aspect-[4/3] overflow-hidden bg-navy-900 rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                  alt="High Precision Electronics and Automated Hardware Bench Testing at Mechafy Global"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION (Split Editorial Layout) */}
      <section className="mb-20 py-12 border-y border-white/10 bg-white/[0.01]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-8 border border-white/10 bg-navy-950/80 space-y-3">
            <div className="flex items-center gap-3 text-electric-blue">
              <Target className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">Our Mission</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              To eliminate hardware procurement latency for Indian innovators by providing dependable access to verified robotics silicon, high-grade additive materials, precision tooling, and custom compute platforms backed by transparent technical specifications and domestic support.
            </p>
          </div>

          <div className="p-8 border border-white/10 bg-navy-950/80 space-y-3">
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
          <span className="text-xs font-mono uppercase tracking-widest text-electric-blue">Capability Spectrum</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            What We Do & Technology Areas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Multi-disciplinary hardware coverage paired with digital execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-white/10 bg-navy-950/70">
            <Cpu className="w-6 h-6 text-electric-blue mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Robotics & Microcontrollers</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Industrial sensors, motor drivers, ESP32, STM32, Arduino, Raspberry Pi, step motors, and precision wiring harnesses for embedded automation.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70">
            <Layers className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">3D Printing & Materials</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bambu Lab, Creality, Anycubic 3D printers, specialized engineering filaments (Carbon Fiber, PETG, TPU, PLA+), 3D optical scanners, and hardened nozzles.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70">
            <HardDrive className="w-6 h-6 text-yellow-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Computer Architecture & PC Builds</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              High-performance workstation CPUs, motherboards, GPUs, DDR4/DDR5 memory, NVMe SSD arrays, power supplies, and turnkey custom rigs.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70">
            <Microscope className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Lab Tooling & Instruments</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Precision multimeters, oscilloscopes, variable DC bench power supplies, temperature-controlled soldering stations, and inspection gear.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70">
            <Sparkles className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Enterprise IT Services</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full-stack software engineering, bespoke corporate websites, portal development, cloud hosting, and data management solutions.
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-navy-950/70">
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
            <div key={i} className="p-5 border border-white/10 bg-navy-950/60">
              <span className="text-xs font-mono font-bold text-electric-blue block mb-2">0{i+1}</span>
              <h3 className="text-sm font-bold text-white mb-1">{ind.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FACILITY & LOGISTICS HUB */}
      <section id="facility" className="mb-20 py-12 border-y border-white/10 bg-white/[0.01] text-left scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-blue">Physical Operational Hub</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Warehouse & Testing Facility
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Unlike broker services or drop-shippers, Mechafy Global maintains direct physical stock in our warehouse and inspection lab situated at Plot 582, HSIIDC Industrial Area, Rai, Sonipat, Haryana (PIN: 131029).
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
              <div className="p-3 bg-white/5 border border-white/10">
                <span className="text-slate-400 block">Hub Location:</span>
                <span className="text-white font-bold">Rai, Sonipat, Haryana</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10">
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
              <div className="aspect-[4/3] overflow-hidden bg-navy-900 rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80"
                  alt="Mechafy Global Inspection and Distribution Hub Facilities"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 15 — LEADERSHIP (DIRECTOR: DIVYANSH JAIN) */}
      <section id="leadership" className="mb-20 text-left scroll-mt-24">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-electric-blue">Executive Management</span>
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

      {/* WHY MECHAFY GLOBAL (Checklist Table) */}
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
            <div key={idx} className="p-4 border border-white/10 bg-navy-950/70 flex items-start gap-3">
              <Check className="w-5 h-5 text-electric-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT & OFFICIAL REGISTRATION DETAILS */}
      <section className="mb-16 border border-white/10 bg-navy-950 p-8 sm:p-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-electric-blue">Connect With Our Team</span>
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
              className="px-6 py-3.5 bg-electric-blue hover:bg-blue-400 text-black font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2"
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
