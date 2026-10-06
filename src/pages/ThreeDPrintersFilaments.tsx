import React, { useEffect, useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { fetchProducts, Product, CURATED_3D_PARTS_AND_ACCESSORIES, getProductPath } from '../services/productService';
import { Link } from 'react-router-dom';
import { Layers, Cuboid, Zap, Settings, ArrowRight, ShieldCheck, Headphones, ShoppingCart, Scan, Wrench } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SEO } from '../components/SEO';
import { Breadcrumb, generateBreadcrumbSchema } from '../components/Breadcrumb';

// Helper to strictly identify computer hardware and PC motherboards so they never appear in 3D section
export const isComputerComponentOrMotherboard = (p: Product): boolean => {
  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const cat = (p.category_name || '').toLowerCase();
  const sub = (p.subcategory_name || '').toLowerCase();
  const subsub = (p.subsubcategory_name || '').toLowerCase();
  const nested = (p.nested_subcategory_name || '').toLowerCase();

  const allText = `${name} ${desc} ${cat} ${sub} ${subsub} ${nested}`;
  const catHierarchy = `${cat} ${sub} ${subsub} ${nested}`;

  // Explicit PC / Computer motherboard indicators
  const pcMotherboardKeywords = [
    'motherboard',
    'motherboared',
    'mainboard',
    'mobo',
    'lga1700',
    'lga1200',
    'lga1151',
    'am4',
    'am5',
    'b650',
    'b550',
    'b760',
    'b450',
    'z790',
    'z690',
    'x670',
    'h610',
    'a620',
    'atx motherboard',
    'matx',
    'micro-atx',
    'mini-itx',
    'pc motherboard',
    'computer motherboard',
    'desktop motherboard',
    'gaming motherboard'
  ];

  // Specific check: if product text contains computer motherboard keywords, it's a computer motherboard
  const matchesMotherboard = pcMotherboardKeywords.some(kw => allText.includes(kw));
  if (matchesMotherboard) {
    return true;
  }

  // Check if categorized under Computer Components
  const isComputerCat = 
    catHierarchy.includes('computer') ||
    catHierarchy.includes('pc component') ||
    catHierarchy.includes('processor') ||
    catHierarchy.includes('cpu') ||
    catHierarchy.includes('memory') ||
    catHierarchy.includes('ram') ||
    catHierarchy.includes('graphics card') ||
    catHierarchy.includes('gpu') ||
    catHierarchy.includes('smps') ||
    catHierarchy.includes('power supply') ||
    catHierarchy.includes('cabinet');

  if (isComputerCat) {
    return true;
  }

  // Check for general PC hardware keywords
  const computerPartsKeywords = [
    'intel core',
    'ryzen',
    'ddr4 ram',
    'ddr5 ram',
    'geforce rtx',
    'radeon rx',
    'atx power supply',
    'pc cabinet',
    'desktop ram'
  ];
  if (computerPartsKeywords.some(kw => allText.includes(kw))) {
    return true;
  }

  return false;
};

// Check if product is an actual 3D scanner machine (not an accessory)
export const isScannerMachine = (p: Product): boolean => {
  if (isComputerComponentOrMotherboard(p)) return false;

  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const cat = (p.category_name || '').toLowerCase();
  const sub = (p.subcategory_name || '').toLowerCase();

  // Exclude scanner accessories
  const isAccessory = 
    name.includes('turntable') ||
    name.includes('spray') ||
    name.includes('marker') ||
    name.includes('target') ||
    name.includes('calibration') ||
    name.includes('tripod') ||
    name.includes('cable') ||
    name.includes('bracket') ||
    name.includes('grip') ||
    name.includes('dot') ||
    name.includes('point');

  if (isAccessory) return false;

  return (
    name.includes('scanner') ||
    name.includes('digitizer') ||
    cat.includes('scanner') ||
    sub.includes('scanner') ||
    desc.includes('3d scanner') ||
    desc.includes('handheld 3d') ||
    desc.includes('laser 3d scanner')
  );
};

// Check if product is an actual 3D printer machine (not a part/accessory)
export const isPrinterMachine = (p: Product): boolean => {
  if (isComputerComponentOrMotherboard(p)) return false;
  if (isScannerMachine(p)) return false;

  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const cat = (p.category_name || '').toLowerCase();
  const sub = (p.subcategory_name || '').toLowerCase();

  // Exclude parts and accessories
  const isPartOrAcc = 
    name.includes('nozzle') ||
    name.includes('hotend') ||
    name.includes('hot end') ||
    name.includes('extruder') ||
    name.includes('build plate') ||
    name.includes('pei') ||
    name.includes('bed level') ||
    name.includes('bltouch') ||
    name.includes('cr touch') ||
    name.includes('thermistor') ||
    name.includes('ptfe') ||
    name.includes('timing belt') ||
    name.includes('pulley') ||
    name.includes('silicone sock') ||
    name.includes('vat') ||
    name.includes('fep') ||
    name.includes('part') ||
    name.includes('accessory') ||
    name.includes('accessories');

  if (isPartOrAcc) return false;

  return (
    name.includes('printer') ||
    cat.includes('printer') ||
    sub.includes('printer') ||
    desc.includes('3d printer') ||
    desc.includes('fdm printer') ||
    desc.includes('resin 3d printer')
  );
};

// Check if product is printing filament or resin
export const isFilamentOrResin = (p: Product): boolean => {
  if (isComputerComponentOrMotherboard(p)) return false;
  if (isPrinterMachine(p) || isScannerMachine(p)) return false;

  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const cat = (p.category_name || '').toLowerCase();
  const sub = (p.subcategory_name || '').toLowerCase();

  return (
    name.includes('filament') ||
    name.includes('pla ') ||
    name.includes('pla+') ||
    name.includes('abs ') ||
    name.includes('petg') ||
    name.includes('tpu ') ||
    name.includes('uv resin') ||
    name.includes('photopolymer resin') ||
    cat.includes('filament') ||
    cat.includes('resin') ||
    sub.includes('filament') ||
    sub.includes('resin') ||
    desc.includes('3d printing filament')
  );
};

// Check if product is specifically a 3D Printer Part or Accessory
export const is3DPrinterPartOrAccessory = (p: Product): boolean => {
  if (isComputerComponentOrMotherboard(p)) return false;
  if (isPrinterMachine(p) || isFilamentOrResin(p) || isScannerMachine(p)) return false;

  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const cat = (p.category_name || '').toLowerCase();
  const sub = (p.subcategory_name || '').toLowerCase();
  const allText = `${name} ${desc} ${cat} ${sub}`;

  const printerPartKeywords = [
    'nozzle',
    'hotend',
    'hot end',
    'heatblock',
    'heat block',
    'heatbreak',
    'heat break',
    'extruder',
    'build plate',
    'pei sheet',
    'pei bed',
    'magnetic bed',
    'spring steel',
    'glass bed',
    'bltouch',
    'cr touch',
    'cr-touch',
    'bed level',
    'leveling sensor',
    'thermistor',
    'heater cartridge',
    'heating cartridge',
    'ptfe tube',
    'bowden tube',
    'capricorn',
    'pc4-m6',
    'pc4-m10',
    'pneumatic fitting',
    'pneumatic coupler',
    'silicone sock',
    'lead screw',
    'anti-backlash',
    'timing belt',
    'gt2',
    'pulley',
    'fep film',
    'resin vat',
    'curing station',
    'wash and cure',
    'cleaning needle',
    'nozzle cleaner',
    'print scraper',
    '3d printer part',
    '3d printer accessory',
    'printer accessory',
    'printer part'
  ];

  const matchesKeyword = printerPartKeywords.some(kw => allText.includes(kw));
  const matchesCat = (cat.includes('3d') || sub.includes('3d')) && 
                     (allText.includes('part') || allText.includes('accessori') || allText.includes('spare'));

  return matchesKeyword || matchesCat;
};

// Check if product is specifically a 3D Scanner Part or Accessory
export const is3DScannerPartOrAccessory = (p: Product): boolean => {
  if (isComputerComponentOrMotherboard(p)) return false;
  if (isScannerMachine(p) || isPrinterMachine(p) || isFilamentOrResin(p)) return false;

  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const cat = (p.category_name || '').toLowerCase();
  const sub = (p.subcategory_name || '').toLowerCase();
  const allText = `${name} ${desc} ${cat} ${sub}`;

  const scannerPartKeywords = [
    'turntable',
    'scanning table',
    'rotary table',
    'spray',
    'aesub',
    'marker',
    'reflective marker',
    'marker points',
    'tracking dot',
    'tracking point',
    'scanning target',
    'calibration plate',
    'calibration board',
    'calibration grid',
    'scanner tripod',
    'scanner stand',
    'scanner cable',
    'scanner mount',
    'scanner bracket',
    'scanner grip',
    'scanner battery',
    'scanner accessory',
    'scanner accessories',
    'scanner part',
    '3d scanner accessory',
    '3d scanner part'
  ];

  const matchesKeyword = scannerPartKeywords.some(kw => allText.includes(kw));
  const matchesCat = (cat.includes('scanner') || sub.includes('scanner')) && 
                     (allText.includes('part') || allText.includes('accessori') || allText.includes('spare'));

  return matchesKeyword || matchesCat;
};

export default function ThreeDPrintersFilaments() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [showAllPrinters, setShowAllPrinters] = useState(false);
  const [showAllFilaments, setShowAllFilaments] = useState(false);
  const [showAllScanners, setShowAllScanners] = useState(false);
  const [showAllParts, setShowAllParts] = useState(false);
  const [partFilter, setPartFilter] = useState<'all' | 'printer' | 'scanner'>('all');

  const HERO_SLIDES = [
    "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1920", // Industrial / Engineering
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1920", // 3D Printer nozzle close up
    "https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?auto=format&fit=crop&q=80&w=1920"  // Tech / Filament
  ];

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const mouseStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [HERO_SLIDES.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        
        // Strict filter: Exclude any computer motherboards and general PC hardware!
        // Only keep genuine 3D Printers, Filaments, 3D Scanners, and 3D Printer / Scanner Parts & Accessories
        const filtered = allProducts.filter(p => {
          if (isComputerComponentOrMotherboard(p)) {
            return false;
          }
          
          return (
            isPrinterMachine(p) ||
            isFilamentOrResin(p) ||
            isScannerMachine(p) ||
            is3DPrinterPartOrAccessory(p) ||
            is3DScannerPartOrAccessory(p)
          );
        });
        
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to load 3D printing products", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const printers = products.filter(isPrinterMachine);
  const filaments = products.filter(isFilamentOrResin);
  const scanners = products.filter(isScannerMachine);

  // Filter ONLY authentic 3D printer & 3D scanner parts & accessories from DB
  const dbParts = products.filter(p => is3DPrinterPartOrAccessory(p) || is3DScannerPartOrAccessory(p));

  // Combine DB parts with curated authentic 3D parts ensuring no duplicates
  const allPartsAndAccessories = [
    ...dbParts,
    ...CURATED_3D_PARTS_AND_ACCESSORIES.filter(c => !dbParts.some(d => d.slug === c.slug))
  ];

  const printerPartsCount = allPartsAndAccessories.filter(is3DPrinterPartOrAccessory).length;
  const scannerPartsCount = allPartsAndAccessories.filter(is3DScannerPartOrAccessory).length;

  const displayedParts = allPartsAndAccessories.filter(p => {
    if (partFilter === 'printer') return is3DPrinterPartOrAccessory(p);
    if (partFilter === 'scanner') return is3DScannerPartOrAccessory(p);
    return true;
  });

  return (
    <Layout>
      <SEO 
        title="MECHAFY 3D | 3D Printers, Filaments & 3D Scanners India"
        description="Explore MECHAFY 3D: Bambu Lab, Creality, Anycubic 3D printers, engineering filaments (PLA+, PETG, TPU, ABS, Carbon Fiber), high-precision 3D scanners & spare parts."
        canonicalPath="/3d-printers-filaments"
        keywords={['MECHAFY 3D', '3D printers India', 'Bambu Lab printer', 'Creality printer', 'PLA filament 1kg', '3D scanning sprays', 'Hardened nozzle']}
        structuredData={generateBreadcrumbSchema([
          { name: 'MECHAFY 3D', url: '/3d-printers-filaments' }
        ])}
      />

      <div className="mb-4">
        <Breadcrumb items={[{ name: 'MECHAFY 3D' }]} />
      </div>

      {/* HERO SECTION */}
      <section 
        className="relative min-h-[80vh] md:min-h-[600px] flex items-center py-20 overflow-hidden glass-panel rounded-3xl mb-16 select-none cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { isDraggingRef.current = false; mouseStartXRef.current = null; }}
        aria-roledescription="carousel"
        aria-label="3D Printing & Materials Highlights"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 animate-subtle-zoom' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${slide}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/90 to-navy-900/60 z-10" />
          <div className="absolute inset-0 bg-electric-blue/5 mix-blend-overlay z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent z-10" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-3xl">
            {/* Mechafy Logo */}
            <Reveal>
              <div className="mb-6 flex items-center justify-center md:justify-start gap-3 relative z-10">
                <img 
                  src="https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg" 
                  alt="Mechafy Global Logo" 
                  className="w-10 h-10 md:w-12 md:h-12 rounded shadow-lg object-cover border border-white/10"
                />
                <span className="text-sm md:text-base font-bold text-electric-blue uppercase tracking-widest drop-shadow">Mechafy Global</span>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 tracking-tight drop-shadow-lg relative z-10">
                MECHAFY <span className="text-electric-blue">3D</span>
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-blue-400 mb-6 drop-shadow">
                3D Printing • Filaments • Accessories
              </p>
            </Reveal>
            
            <Reveal delay={0.4}>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed drop-shadow">
                From high-speed prototyping to industrial manufacturing. Explore our curated selection of professional 3D printers, advanced filaments, and comprehensive solutions designed to bring your boldest ideas to life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-10 text-sm font-medium text-slate-300 drop-shadow">
                <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-electric-blue" /> Industrial Grade</div>
                <div className="hidden sm:block text-slate-600">•</div>
                <div className="flex items-center gap-2"><Layers className="h-5 w-5 text-purple-400" /> Premium Filaments</div>
                <div className="hidden sm:block text-slate-600">•</div>
                <div className="flex items-center gap-2"><Scan className="h-5 w-5 text-cyan-400" /> 3D Scanners</div>
                <div className="hidden sm:block text-slate-600">•</div>
                <div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-electric-blue" /> Expert Support</div>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <div className="flex flex-wrap gap-4">
                <a href="#featured-printers" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-center w-full sm:w-auto">
                  Explore Printers
                </a>
                <a href="#filaments" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-center w-full sm:w-auto">
                  View Filaments
                </a>
                <a href="#3d-scanners" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-center w-full sm:w-auto">
                  3D Scanners
                </a>
                <a href="#parts-accessories" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-center w-full sm:w-auto">
                  Parts & Accessories
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE MECHAFY FOR 3D PRINTING */}
      <section className="pt-16 pb-8 relative overflow-hidden bg-gradient-to-b from-navy-950 to-navy-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow">The Digital-to-Physical Advantage</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Experience unmatched precision, reliability, and support with Mechafy Global's 3D printing ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 text-center group hover:border-electric-blue/50 transition-colors bg-white/5 backdrop-blur-md">
              <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Zap className="h-8 w-8 text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">High-Speed Precision</h3>
              <p className="text-slate-400">Industry-leading printing speeds without compromising on microscopic detail and layer adhesion.</p>
            </div>
            
            <div className="glass-panel p-8 text-center group hover:border-purple-500/50 transition-colors bg-white/5 backdrop-blur-md">
              <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <Layers className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Materials</h3>
              <p className="text-slate-400">From standard PLA to engineering-grade Nylon and Carbon Fiber, our filaments ensure flawless extrusion.</p>
            </div>
            
            <div className="glass-panel p-8 text-center group hover:border-electric-blue/50 transition-colors bg-white/5 backdrop-blur-md">
              <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Settings className="h-8 w-8 text-electric-blue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Support</h3>
              <p className="text-slate-400">Our technical team provides comprehensive setup guidance, calibration help, and troubleshooting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRINTERS SECTION */}
      <section id="featured-printers" className="pt-8 pb-16 relative overflow-hidden bg-navy-900">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-electric-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Professional Printers</h2>
                <p className="text-slate-400">Desktop and industrial solutions for every scale.</p>
              </div>
              {!showAllPrinters && printers.length > 4 && (
                <button onClick={() => setShowAllPrinters(true)} className="flex items-center text-electric-blue hover:text-blue-400 transition-colors font-semibold cursor-pointer">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </Reveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
            </div>
          ) : printers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {printers.slice(0, showAllPrinters ? printers.length : 4).map((product, index) => (
                <Reveal key={product.id} delay={index * 0.05}>
                  <div className="glass-panel group flex flex-col h-full overflow-hidden hover:border-electric-blue/50 transition-all duration-300">
                    <Link to={getProductPath(product)} className="block relative h-56 bg-white/5 p-6 overflow-hidden shrink-0">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <Link to={getProductPath(product)} className="text-lg font-bold text-white mb-2 hover:text-electric-blue line-clamp-2 transition-colors min-h-[3.5rem]">
                        {product.name}
                      </Link>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-3 flex-grow">{product.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 shrink-0">
                        <div className="flex items-center">
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs line-through text-slate-500 mr-2">₹{product.originalPrice.toFixed(2)}</span>
                          )}
                          <span className="text-xl font-bold text-white">₹{product.price.toFixed(2)}</span>
                        </div>
                        <button 
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                          className="p-2.5 bg-white/5 hover:bg-electric-blue text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-electric-blue"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-navy-900/50 rounded-2xl border border-dashed border-white/20">
              <Cuboid className="mx-auto h-16 w-16 text-slate-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Expanding Our Catalog</h3>
              <p className="text-slate-400 max-w-md mx-auto">We are currently updating our 3D printer inventory in the database. Please check back soon.</p>
              <Link to="/contact" className="inline-block mt-8 px-6 py-3 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors">
                Contact Sales Team
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FILAMENTS SECTION */}
      <section id="filaments" className="pt-8 pb-16 relative overflow-hidden bg-navy-900 border-t border-white/5">
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Premium Filaments</h2>
                <p className="text-slate-400">High-quality materials for perfect prints every time.</p>
              </div>
              {!showAllFilaments && filaments.length > 8 && (
                <button onClick={() => setShowAllFilaments(true)} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors font-semibold cursor-pointer">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </Reveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : filaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filaments.slice(0, showAllFilaments ? filaments.length : 8).map((product, index) => (
                <Reveal key={product.id} delay={index * 0.05}>
                  <div className="glass-panel group flex flex-col h-full overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                    <Link to={getProductPath(product)} className="block relative h-48 bg-white/5 p-4 overflow-hidden shrink-0">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <Link to={getProductPath(product)} className="text-md font-bold text-white mb-1 hover:text-purple-400 line-clamp-2 transition-colors min-h-[3rem]">
                        {product.name}
                      </Link>
                      <span className="text-xs text-slate-400 mb-4 block">{product.subcategory_name || 'Filament'}</span>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 shrink-0">
                        <span className="text-lg font-bold text-white">₹{product.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                          className="p-2.5 bg-white/5 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-purple-500"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-navy-800/50 rounded-2xl border border-dashed border-white/20">
              <Layers className="mx-auto h-16 w-16 text-slate-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Expanding Our Materials</h3>
              <p className="text-slate-400 max-w-md mx-auto">Our filament catalog is currently being updated with new colors and materials.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3D SCANNERS SECTION */}
      <section id="3d-scanners" className="pt-8 pb-16 relative overflow-hidden bg-navy-900 border-t border-white/5">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">High-Precision 3D Scanners</h2>
                <p className="text-slate-400">Desktop and handheld 3D digitizers for reverse engineering, prototyping, and inspection.</p>
              </div>
              {!showAllScanners && scanners.length > 4 && (
                <button onClick={() => setShowAllScanners(true)} className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-semibold cursor-pointer">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </Reveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
          ) : scanners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {scanners.slice(0, showAllScanners ? scanners.length : 4).map((product, index) => (
                <Reveal key={product.id} delay={index * 0.05}>
                  <div className="glass-panel group flex flex-col h-full overflow-hidden hover:border-cyan-400/50 transition-all duration-300">
                    <Link to={getProductPath(product)} className="block relative h-56 bg-white/5 p-6 overflow-hidden shrink-0">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="p-5 flex flex-col flex-grow">
                      <Link to={getProductPath(product)} className="text-lg font-bold text-white mb-2 hover:text-cyan-400 line-clamp-2 transition-colors min-h-[3.5rem]">
                        {product.name}
                      </Link>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-3 flex-grow">{product.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 shrink-0">
                        <div className="flex items-center">
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs line-through text-slate-500 mr-2">₹{product.originalPrice.toFixed(2)}</span>
                          )}
                          <span className="text-xl font-bold text-white">₹{product.price.toFixed(2)}</span>
                        </div>
                        <button 
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                          className="p-2.5 bg-white/5 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-cyan-500"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-navy-900/50 rounded-2xl border border-dashed border-white/20">
              <Scan className="mx-auto h-16 w-16 text-cyan-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Expanding Our 3D Scanner Catalog</h3>
              <p className="text-slate-400 max-w-md mx-auto">We are continuously updating our selection of high-accuracy handheld and desktop 3D scanners. Contact our team for customized industrial scanning equipment.</p>
              <Link to="/contact" className="inline-block mt-8 px-6 py-3 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors">
                Inquire About 3D Scanners
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3D PRINTER & SCANNER PARTS & ACCESSORIES */}
      <section id="parts-accessories" className="pt-8 pb-16 relative overflow-hidden bg-navy-900 border-t border-white/5">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-electric-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/10 pb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 text-electric-blue text-sm font-semibold tracking-wider uppercase mb-1">
                  <Settings className="h-4 w-4" />
                  3D Hardware Ecosystem
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">3D Printer & Scanner Parts & Accessories</h2>
                <p className="text-slate-400 max-w-2xl">
                  Dedicated accessories and genuine replacements for 3D printers and 3D optical digitizers. No unrelated computer components.
                </p>
              </div>

              {/* Sub-Category Filter Buttons */}
              <div className="flex items-center gap-2 p-1.5 bg-navy-950/80 rounded-xl border border-white/10 self-start md:self-auto shrink-0 shadow-lg">
                <button
                  onClick={() => setPartFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    partFilter === 'all'
                      ? 'bg-electric-blue text-navy-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  All ({allPartsAndAccessories.length})
                </button>
                <button
                  onClick={() => setPartFilter('printer')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    partFilter === 'printer'
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  3D Printer Parts ({printerPartsCount})
                </button>
                <button
                  onClick={() => setPartFilter('scanner')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    partFilter === 'scanner'
                      ? 'bg-cyan-500 text-navy-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Scanner Accessories ({scannerPartsCount})
                </button>
              </div>
            </div>
          </Reveal>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
            </div>
          ) : displayedParts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedParts.slice(0, showAllParts ? displayedParts.length : 8).map((product, index) => {
                  const isScanAcc = is3DScannerPartOrAccessory(product);
                  return (
                    <Reveal key={product.id} delay={index * 0.05}>
                      <div className="glass-panel group flex flex-col h-full overflow-hidden hover:border-electric-blue/50 transition-all duration-300 bg-white/5">
                        <Link to={getProductPath(product)} className="block relative h-52 bg-white/5 p-4 overflow-hidden shrink-0">
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md ${
                            isScanAcc 
                              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40' 
                              : 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                          }`}>
                            {isScanAcc ? '3D Scanner Accessory' : '3D Printer Part'}
                          </span>
                        </Link>
                        <div className="p-5 flex flex-col flex-grow">
                          <Link to={getProductPath(product)} className="text-base font-bold text-white mb-2 hover:text-electric-blue line-clamp-2 transition-colors min-h-[3rem]">
                            {product.name}
                          </Link>
                          <p className="text-xs text-slate-400 mb-4 line-clamp-2 flex-grow">{product.description}</p>
                          
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 shrink-0">
                            <div className="flex items-center">
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-xs line-through text-slate-500 mr-2">₹{product.originalPrice.toFixed(2)}</span>
                              )}
                              <span className="text-lg font-bold text-white">₹{product.price.toFixed(2)}</span>
                            </div>
                            <button 
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                              className="p-2.5 bg-white/5 hover:bg-electric-blue text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 hover:border-electric-blue cursor-pointer"
                              title="Add to Cart"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              {!showAllParts && displayedParts.length > 8 && (
                <div className="text-center mt-10">
                  <button 
                    onClick={() => setShowAllParts(true)}
                    className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/20 hover:border-electric-blue transition-colors cursor-pointer"
                  >
                    View All Parts & Accessories ({displayedParts.length}) <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-navy-900/50 rounded-2xl border border-dashed border-white/20">
              <Wrench className="mx-auto h-16 w-16 text-slate-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Expanding Our 3D Parts Catalog</h3>
              <p className="text-slate-400 max-w-md mx-auto">This section exclusively features replacement parts and accessories for 3D printers and 3D scanners.</p>
              <button 
                onClick={() => setPartFilter('all')}
                className="mt-6 px-6 py-2.5 rounded-lg text-sm font-semibold text-electric-blue bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-navy-900 to-navy-950 border-t border-electric-blue/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-electric-blue/5 rounded-[100%] blur-[80px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">Need a Custom 3D Printing Solution?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">From industrial farm setups to specialized educational packages, our team is ready to design the perfect ecosystem for your needs.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="px-8 py-4 rounded-lg font-bold text-lg text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-center w-full sm:w-auto">
                Talk to an Expert
              </Link>
              <Link to="/shop" className="px-8 py-4 rounded-lg font-bold text-lg text-white border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-center w-full sm:w-auto">
                Browse Full Catalog
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
