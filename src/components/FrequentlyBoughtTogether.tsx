import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Plus, PackageCheck, Zap } from 'lucide-react';
import { Product, fetchProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Reveal } from './Reveal';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
}

interface BundleItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image_url: string;
  sku?: string;
  isMain?: boolean;
}

export function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  const { addToCart } = useCart();
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (!currentProduct) return;

    let isMounted = true;

    async function loadBundle() {
      const mainItem: BundleItem = {
        id: currentProduct.id || currentProduct.slug,
        name: currentProduct.name,
        slug: currentProduct.slug,
        price: currentProduct.price,
        originalPrice: currentProduct.originalPrice || undefined,
        image_url: currentProduct.image_url,
        sku: currentProduct.sku,
        isMain: true
      };

      // Determine complementary items based on product keywords and category
      const nameLower = (currentProduct.name || '').toLowerCase();
      const catLower = (currentProduct.category_name || currentProduct.category_slug || '').toLowerCase();
      const descLower = (currentProduct.description || '').toLowerCase();
      const allText = `${nameLower} ${catLower} ${descLower}`;

      let companionPresets: BundleItem[] = [];

      // 1. 3D Printers
      if (allText.includes('printer') || allText.includes('bambu') || allText.includes('ender') || allText.includes('creality') || allText.includes('anycubic')) {
        companionPresets = [
          {
            id: 'bundle-pla-1kg',
            name: 'High-Speed Precision PLA Filament 1.75mm (1KG Spool)',
            slug: 'high-speed-pla-filament-1kg',
            price: 1299,
            originalPrice: 1699,
            image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/3D_Printing_Materials_%2816837486456%29.jpg',
            sku: 'MFG-3DP-FIL-01'
          },
          {
            id: 'bundle-nozzle-kit',
            name: 'Hardened Steel High-Flow Nozzle Kit (0.4mm & 0.6mm)',
            slug: 'hardened-steel-high-flow-nozzle-0-4mm',
            price: 899,
            originalPrice: 1199,
            image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-3DP-NOZ-02'
          }
        ];
      } 
      // 2. Microcontrollers & Dev Boards (ESP32, Arduino, Raspberry Pi)
      else if (allText.includes('esp32') || allText.includes('esp8266') || allText.includes('arduino') || allText.includes('microcontroller') || allText.includes('raspberry') || allText.includes('pico') || allText.includes('stm32')) {
        companionPresets = [
          {
            id: 'bundle-breadboard-830',
            name: 'Solderless Breadboard (830 Tie Points with Power Rails)',
            slug: 'solderless-breadboard-830-points',
            price: 199,
            originalPrice: 299,
            image_url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-ROB-BB-830'
          },
          {
            id: 'bundle-jumper-wires',
            name: 'Premium Multi-Color Jumper Wires Set (65pcs M-M / M-F)',
            slug: 'premium-jumper-wires-set-65pcs',
            price: 149,
            originalPrice: 220,
            image_url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-ROB-JMP-65'
          },
          {
            id: 'bundle-usb-cable',
            name: 'Shielded USB High-Speed Programming & Power Cable (1.2M)',
            slug: 'shielded-usb-programming-cable',
            price: 129,
            originalPrice: 199,
            image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-ROB-USB-01'
          }
        ];
      }
      // 3. Motors, Steppers, Servos
      else if (allText.includes('motor') || allText.includes('stepper') || allText.includes('servo') || allText.includes('actuator')) {
        companionPresets = [
          {
            id: 'bundle-driver-l298n',
            name: 'Dual H-Bridge Motor Driver Module (L298N High-Power)',
            slug: 'dual-h-bridge-motor-driver-l298n',
            price: 249,
            originalPrice: 349,
            image_url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-ROB-DRV-01'
          },
          {
            id: 'bundle-coupling-mount',
            name: 'Flexible Aluminium Shaft Coupling & Mounting Hardware Kit',
            slug: 'flexible-aluminium-shaft-coupling',
            price: 189,
            originalPrice: 260,
            image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-ROB-CPL-02'
          }
        ];
      }
      // 4. Sensors
      else if (allText.includes('sensor') || allText.includes('sonar') || allText.includes('ultrasonic') || allText.includes('lidar') || allText.includes('gyro')) {
        companionPresets = [
          {
            id: 'bundle-arduino-nano',
            name: 'Arduino Nano V3.0 Microcontroller with Type-C Port',
            slug: 'arduino-nano-v3-type-c',
            price: 299,
            originalPrice: 450,
            image_url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-ROB-NANO-01'
          },
          {
            id: 'bundle-dupont-ribbon',
            name: '40-Pin Female-to-Male Dupont Ribbon Cable (20cm)',
            slug: '40-pin-dupont-ribbon-cable',
            price: 110,
            originalPrice: 180,
            image_url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-ROB-DPT-40'
          }
        ];
      }
      // 5. PC Components / Graphics Cards (RTX, GPUs, CPU, RAM)
      else if (allText.includes('rtx') || allText.includes('gpu') || allText.includes('cpu') || allText.includes('processor') || allText.includes('graphics card') || allText.includes('motherboard')) {
        companionPresets = [
          {
            id: 'bundle-thermal-paste',
            name: 'High-Performance Thermal Compound Paste (4g Syringe)',
            slug: 'high-performance-thermal-paste-4g',
            price: 499,
            originalPrice: 699,
            image_url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-PC-TP-01'
          },
          {
            id: 'bundle-ddr4-ram',
            name: '16GB DDR4 3200MHz High-Speed Gaming Desktop RAM',
            slug: '16gb-ddr4-3200mhz-ram',
            price: 2799,
            originalPrice: 3499,
            image_url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-PC-RAM-16'
          }
        ];
      }
      // 6. Filaments & Consumables
      else if (allText.includes('filament') || allText.includes('pla') || allText.includes('petg') || allText.includes('abs') || allText.includes('resin')) {
        companionPresets = [
          {
            id: 'bundle-cleaning-needles',
            name: '0.4mm Nozzle Cleaning Needle Kit with Precision Tweezers',
            slug: '0-4mm-nozzle-cleaning-needle-kit',
            price: 299,
            originalPrice: 450,
            image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-3DP-CLN-01'
          },
          {
            id: 'bundle-ptfe-tube',
            name: 'Premium PTFE Bowden Tube (1M) with PC4-M6 Pneumatic Fittings',
            slug: 'premium-ptfe-bowden-tube-1m',
            price: 249,
            originalPrice: 380,
            image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/3D_Printing_Materials_%2816837486456%29.jpg',
            sku: 'MFG-3DP-PTFE-01'
          }
        ];
      }
      // 7. General Fallback
      else {
        companionPresets = [
          {
            id: 'bundle-breadboard-generic',
            name: 'Solderless Prototyping Breadboard (830 Points)',
            slug: 'solderless-breadboard-830-points',
            price: 199,
            originalPrice: 299,
            image_url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-GEN-BB-01'
          },
          {
            id: 'bundle-jumper-generic',
            name: 'Color-Coded Jumper Cables Kit (65 Pieces)',
            slug: 'color-coded-jumper-cables-65pcs',
            price: 149,
            originalPrice: 220,
            image_url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
            sku: 'MFG-GEN-JMP-01'
          }
        ];
      }

      // Try fetching real products from database to replace presets with real inventory if found
      try {
        const allDbProducts = await fetchProducts();
        const otherDbProducts = allDbProducts.filter(
          p => p.slug !== currentProduct.slug && (p.id || '') !== (currentProduct.id || '')
        );

        if (otherDbProducts.length >= 2) {
          // If we find real database products that match keywords, use them
          const matchingReal: BundleItem[] = [];
          for (const preset of companionPresets) {
            const foundInDb = otherDbProducts.find(
              dbP => dbP.name.toLowerCase().includes(preset.name.split(' ')[0].toLowerCase()) ||
                     (preset.sku && dbP.sku === preset.sku)
            );
            if (foundInDb && !matchingReal.some(m => m.slug === foundInDb.slug)) {
              matchingReal.push({
                id: foundInDb.id || foundInDb.slug,
                name: foundInDb.name,
                slug: foundInDb.slug,
                price: foundInDb.price,
                originalPrice: foundInDb.originalPrice || undefined,
                image_url: foundInDb.image_url,
                sku: foundInDb.sku
              });
            } else {
              matchingReal.push(preset);
            }
          }
          companionPresets = matchingReal;
        }
      } catch (err) {
        // use presets
      }

      if (isMounted) {
        const fullBundle = [mainItem, ...companionPresets];
        setBundleItems(fullBundle);
        // All items checked by default
        setSelectedIds(new Set(fullBundle.map(i => i.id)));
      }
    }

    loadBundle();

    return () => {
      isMounted = false;
    };
  }, [currentProduct]);

  if (bundleItems.length <= 1) {
    return null;
  }

  const toggleItem = (id: string, isMain?: boolean) => {
    // Main item can be unselected if user only wants accessories, but let's allow free choice
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedItems = bundleItems.filter(item => selectedIds.has(item.id));
  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const totalOriginalPrice = selectedItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price || 0),
    0
  );
  const totalSavings = Math.max(0, totalOriginalPrice - totalPrice);

  const handleAddAllToCart = () => {
    if (selectedItems.length === 0) return;

    setIsAdding(true);

    selectedItems.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        sku: item.sku
      }, 1);
    });

    setTimeout(() => {
      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3500);
    }, 400);
  };

  return (
    <section 
      aria-labelledby="frequently-bought-heading" 
      className="my-10 p-6 sm:p-8 rounded-3xl bg-navy-950/70 border border-white/15 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      <Reveal>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-electric-blue/15 text-electric-blue border border-electric-blue/30 shadow-inner">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h2 id="frequently-bought-heading" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Frequently Bought Together
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Recommended companions curated for maximum compatibility & immediate setup.
              </p>
            </div>
          </div>

          {totalSavings > 0 && selectedItems.length > 1 && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
              <PackageCheck className="w-3.5 h-3.5" />
              Save ₹{totalSavings.toLocaleString('en-IN')} on this bundle
            </span>
          )}
        </div>

        {/* Bundle Visualizer & Action Card */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          
          {/* Items Flow (Thumbnails & Checkboxes) */}
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              {bundleItems.map((item, index) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <React.Fragment key={item.id}>
                    {index > 0 && (
                      <div className="text-slate-500 font-bold text-lg sm:text-xl p-1 select-none">
                        +
                      </div>
                    )}

                    <div 
                      onClick={() => toggleItem(item.id, item.isMain)}
                      className={`group relative flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer w-28 sm:w-36 text-center select-none ${
                        isSelected 
                          ? 'bg-white/10 border-electric-blue/60 shadow-[0_4px_16px_rgba(0,180,216,0.15)]' 
                          : 'bg-white/5 border-white/10 opacity-50 hover:opacity-80'
                      }`}
                    >
                      {/* Checkbox badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by card click
                          aria-label={`Select ${item.name}`}
                          className="w-4 h-4 rounded text-electric-blue accent-electric-blue cursor-pointer"
                        />
                      </div>

                      {item.isMain && (
                        <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-electric-blue/20 text-electric-blue border border-electric-blue/40 uppercase">
                          This Item
                        </span>
                      )}

                      {/* Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 my-2 p-1.5 rounded-xl bg-navy-900/80 flex items-center justify-center overflow-hidden border border-white/5">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>

                      {/* Name */}
                      <span className="text-[11px] font-semibold text-slate-200 line-clamp-2 leading-tight mb-1">
                        {item.name}
                      </span>

                      {/* Price */}
                      <span className="text-xs font-bold text-white mt-auto">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Itemized List with toggle checkboxes */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              {bundleItems.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <label 
                    key={item.id} 
                    className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 hover:text-white cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(item.id, item.isMain)}
                      className="mt-1 w-4 h-4 rounded text-electric-blue accent-electric-blue cursor-pointer"
                    />
                    <div className="flex-1 leading-snug">
                      <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-500 line-through'}`}>
                        {item.isMain ? <strong className="text-electric-blue">This item: </strong> : ''}
                        {item.name}
                      </span>
                      <span className="ml-2 font-bold text-white font-mono">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="ml-1.5 text-xs text-slate-500 line-through">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Pricing & Add All to Cart CTA Box */}
          <div className="w-full lg:w-80 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between shrink-0">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1">
                Total Price ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}):
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-white">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                {totalOriginalPrice > totalPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    ₹{totalOriginalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {totalSavings > 0 && selectedItems.length > 1 && (
                <div className="text-xs text-emerald-400 font-semibold mb-4 flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Includes bundle discount savings of ₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 mt-4">
              <button
                onClick={handleAddAllToCart}
                disabled={selectedItems.length === 0 || isAdding}
                className="btn-glow w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer"
              >
                {isAdding ? (
                  <span>Adding items...</span>
                ) : addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Added {selectedItems.length} Items to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add all {selectedItems.length} to Cart</span>
                  </>
                )}
              </button>

              {addedSuccess && (
                <Link
                  to="/cart"
                  className="block text-center text-xs font-bold text-electric-blue hover:underline"
                >
                  View Cart & Checkout &rarr;
                </Link>
              )}

              <p className="text-[11px] text-center text-slate-400">
                GST invoice and standard warranty applicable to all bundled hardware.
              </p>
            </div>
          </div>

        </div>
      </Reveal>
    </section>
  );
}
