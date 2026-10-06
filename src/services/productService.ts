import { db, storage } from '../firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { clearProductsCache, executeSearch } from './searchService';

export interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  unit?: string;
  taxText?: string;
  stock: number;
  category_id: string;
  subcategory_id?: string | null;
  subsubcategory_id?: string | null;
  nested_subcategory_id?: string | null;
  image_url: string;
  created_at?: string;
  createdAt?: string;
  category_name?: string;
  category_slug?: string;
  subcategory_name?: string;
  subcategory_slug?: string;
  subsubcategory_name?: string;
  subsubcategory_slug?: string;
  nested_subcategory_name?: string;
  nested_subcategory_slug?: string;
  sku?: string;
  brand?: string;
  model?: string;
  keywords?: string[];
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
}

export interface Subcategory {
  id?: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
}

export interface Subsubcategory {
  id?: string;
  name: string;
  slug: string;
  description: string;
  subcategory_id: string;
}

export interface NestedSubcategory {
  id?: string;
  name: string;
  slug: string;
  description: string;
  subsubcategory_id: string;
}

export const CURATED_3D_PARTS_AND_ACCESSORIES: Product[] = [
  {
    id: 'curated-nozzle-0-4mm',
    name: 'Hardened Steel High-Flow Nozzle (0.4mm)',
    slug: 'hardened-steel-high-flow-nozzle-0-4mm',
    sku: 'MFG-3DP-00001',
    description: 'Wear-resistant hardened steel nozzle engineered for abrasive filaments including carbon fiber, glow-in-the-dark, and composite materials.',
    price: 899,
    originalPrice: 1299,
    stock: 45,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Parts & Accessories',
    subcategory_slug: 'parts-accessories',
    brand: 'Mechafy Core',
    model: 'HSN-04',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-all-metal-hotend',
    name: 'High-Temperature All-Metal Hotend Assembly Kit',
    slug: 'high-temperature-all-metal-hotend-assembly-kit',
    sku: 'MFG-3DP-00002',
    description: 'Precision CNC titanium heatbreak with copper-alloy heating block capable of continuous printing up to 300°C for engineering-grade materials.',
    price: 2499,
    originalPrice: 3499,
    stock: 30,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Parts & Accessories',
    subcategory_slug: 'parts-accessories',
    brand: 'Mechafy Core',
    model: 'AMH-300',
    image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-pei-spring-steel-plate',
    name: 'Double-Sided Textured PEI Magnetic Spring Steel Build Plate (235x235mm)',
    slug: 'textured-pei-magnetic-spring-steel-build-plate',
    sku: 'MFG-3DP-00003',
    description: 'Flexible textured PEI spring steel sheet with high-adhesion magnetic base, offering exceptional first-layer adhesion and effortless flex print removal.',
    price: 1799,
    originalPrice: 2299,
    stock: 25,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Parts & Accessories',
    subcategory_slug: 'parts-accessories',
    brand: 'Mechafy Core',
    model: 'PEI-235',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-cr-touch-sensor',
    name: 'CR Touch Auto Bed Leveling Sensor Kit with Metal Probe',
    slug: 'cr-touch-auto-bed-leveling-sensor-kit',
    sku: 'MFG-3DP-00004',
    description: 'Multi-point automatic bed leveling sensor featuring optical sensor technology and high-durability metal probe for ultra-flat initial layers.',
    price: 2999,
    originalPrice: 3999,
    stock: 20,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Parts & Accessories',
    subcategory_slug: 'parts-accessories',
    brand: 'Creality',
    model: 'CR-Touch',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-capricorn-ptfe-tube',
    name: 'Capricorn Premium XS Bowden PTFE Tube (1 Meter) with Couplers',
    slug: 'capricorn-premium-xs-bowden-ptfe-tube-kit',
    sku: 'MFG-3DP-00005',
    description: 'High-lubricity Capricorn XS series tubing with 1.9mm ± 0.05mm tight inner tolerance for reduced friction and seamless filament feeding.',
    price: 699,
    originalPrice: 999,
    stock: 60,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Parts & Accessories',
    subcategory_slug: 'parts-accessories',
    brand: 'Capricorn',
    model: 'XS-Series',
    image_url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-dual-gear-extruder',
    name: 'Dual-Gear Direct Drive Extruder Upgrade Kit',
    slug: 'dual-gear-direct-drive-extruder-kit',
    sku: 'MFG-3DP-00006',
    description: 'Precision dual-gear extrusion mechanism with adjustable spring tension for consistent grip without slipping, ideal for flexible TPU filaments.',
    price: 1599,
    originalPrice: 2199,
    stock: 18,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Parts & Accessories',
    subcategory_slug: 'parts-accessories',
    brand: 'Mechafy Core',
    model: 'DGE-02',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-aesub-scanning-spray',
    name: 'AESUB Blue Vanishing 3D Scanning Spray (400ml)',
    slug: 'aesub-blue-vanishing-3d-scanning-spray',
    sku: 'MFG-3DP-00007',
    description: 'Self-evaporating sublimation spray for 3D scanning reflective, transparent, or dark surfaces. Leaves zero residue and eliminates post-scan cleaning.',
    price: 2850,
    originalPrice: 3500,
    stock: 40,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Scanner Accessories',
    subcategory_slug: 'scanner-accessories',
    brand: 'AESUB',
    model: 'Blue-400',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-motorized-turntable',
    name: 'Precision Motorized 360° Rotary Turntable for 3D Scanners',
    slug: 'precision-motorized-rotary-turntable-3d-scanner',
    sku: 'MFG-3DP-00008',
    description: 'Smooth continuous and indexed 360° motorized turntable with anti-slip rubber surface and 20kg payload capacity for automated 3D capture.',
    price: 4499,
    originalPrice: 5999,
    stock: 15,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Scanner Accessories',
    subcategory_slug: 'scanner-accessories',
    brand: 'Mechafy Lab',
    model: 'TT-360',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-reflective-marker-points',
    name: 'High-Reflective Marker Points (6mm Inner Diameter - 1,000 Pcs)',
    slug: 'high-reflective-marker-points-6mm-target-dots',
    sku: 'MFG-3DP-00009',
    description: 'High-retroreflection self-adhesive optical target markers for handheld and industrial optical 3D scanners to ensure seamless tracking.',
    price: 1299,
    originalPrice: 1800,
    stock: 50,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Scanner Accessories',
    subcategory_slug: 'scanner-accessories',
    brand: 'Mechafy Lab',
    model: 'MP-6MM',
    image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-calibration-plate',
    name: 'High-Precision Optical Glass 3D Scanner Calibration Plate',
    slug: 'optical-glass-3d-scanner-calibration-plate',
    sku: 'MFG-3DP-00010',
    description: 'High-accuracy optical photolithography grid calibration board for recalibrating optical and laser 3D scanning sensors to micrometer tolerance.',
    price: 3999,
    originalPrice: 5499,
    stock: 12,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: 'Scanner Accessories',
    subcategory_slug: 'scanner-accessories',
    brand: 'Mechafy Lab',
    model: 'CP-OPT',
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-3d-pen-pro',
    name: 'Professional 3D Printing Pen with OLED Display & Speed Control',
    slug: 'professional-3d-printing-pen-oled-display',
    sku: 'MFG-3DP-PEN-01',
    description: 'Ergonomic precision 3D pen with real-time temperature OLED monitor, variable feed rates, and ceramic anti-clog nozzle for PLA & ABS crafting.',
    price: 2199,
    originalPrice: 2999,
    stock: 35,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: '3D Pens',
    subcategory_slug: '3d-pens',
    brand: 'Mechafy Creative',
    model: 'PEN-OLED',
    image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'curated-3d-pen-refills',
    name: '3D Pen Filament Refill Pack (10 Colors x 5 Meters, 1.75mm PLA)',
    slug: '3d-pen-filament-refill-pack-10-colors',
    sku: 'MFG-3DP-PEN-02',
    description: 'Odorless non-toxic high-purity PLA filament refills in 10 vibrant colors, engineered specifically for 3D pens and miniature prototyping.',
    price: 699,
    originalPrice: 999,
    stock: 50,
    category_id: '3d-printers-filaments',
    category_name: '3D Printers & Filaments',
    category_slug: '3d-printers-filaments',
    subcategory_name: '3D Pens',
    subcategory_slug: '3d-pens',
    brand: 'Mechafy Creative',
    model: 'REF-10C',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/3D_Printing_Materials_%2816837486456%29.jpg'
  }
];

let cachedEnrichedProducts: Product[] | null = null;
let lastEnrichedFetchTime = 0;
const CACHE_LIFETIME = 60 * 1000; // 60 seconds

export const fetchAllProductsEnriched = async (forceRefresh = false): Promise<Product[]> => {
  const now = Date.now();
  if (!forceRefresh && cachedEnrichedProducts && (now - lastEnrichedFetchTime < CACHE_LIFETIME)) {
    return cachedEnrichedProducts;
  }

  const [prodSnap, catSnap, subcatSnap, subsubcatSnap, nestedSubcatSnap] = await Promise.all([
    getDocs(collection(db, 'products')),
    getDocs(collection(db, 'categories')),
    getDocs(collection(db, 'subcategories')),
    getDocs(collection(db, 'subsubcategories')),
    getDocs(collection(db, 'nested_subcategories'))
  ]);

  const categories: Record<string, { name: string; slug: string }> = {};
  catSnap.docs.forEach(d => {
    categories[d.id] = { name: d.data().name, slug: d.data().slug };
  });

  const subcategories: Record<string, { name: string; slug: string }> = {};
  subcatSnap.docs.forEach(d => {
    subcategories[d.id] = { name: d.data().name, slug: d.data().slug };
  });

  const subsubcategories: Record<string, { name: string; slug: string }> = {};
  subsubcatSnap.docs.forEach(d => {
    subsubcategories[d.id] = { name: d.data().name, slug: d.data().slug };
  });

  const nestedSubcategories: Record<string, { name: string; slug: string }> = {};
  nestedSubcatSnap.docs.forEach(d => {
    nestedSubcategories[d.id] = { name: d.data().name, slug: d.data().slug };
  });

  const enriched: Product[] = prodSnap.docs.map(d => {
    const data = d.data();
    const cat = categories[data.category_id];
    const subcat = data.subcategory_id ? subcategories[data.subcategory_id] : undefined;
    const subsubcat = data.subsubcategory_id ? subsubcategories[data.subsubcategory_id] : undefined;
    const nestedSubcat = data.nested_subcategory_id ? nestedSubcategories[data.nested_subcategory_id] : undefined;

    return {
      id: d.id,
      name: data.name || '',
      slug: data.slug || d.id,
      description: data.description || '',
      price: typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0,
      originalPrice: data.originalPrice ? (typeof data.originalPrice === 'number' ? data.originalPrice : parseFloat(data.originalPrice)) : null,
      unit: data.unit,
      taxText: data.taxText,
      stock: typeof data.stock === 'number' ? data.stock : parseInt(data.stock) || 0,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id || null,
      subsubcategory_id: data.subsubcategory_id || null,
      nested_subcategory_id: data.nested_subcategory_id || null,
      image_url: data.image_url || '',
      created_at: data.created_at || data.createdAt,
      createdAt: data.createdAt || data.created_at,
      sku: data.sku || data.SKU,
      brand: data.brand,
      model: data.model,
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      category_name: cat ? cat.name : (data.category_name || 'General'),
      category_slug: cat ? cat.slug : (data.category_slug || ''),
      subcategory_name: subcat ? subcat.name : data.subcategory_name,
      subcategory_slug: subcat ? subcat.slug : undefined,
      subsubcategory_name: subsubcat ? subsubcat.name : data.subsubcategory_name,
      subsubcategory_slug: subsubcat ? subsubcat.slug : undefined,
      nested_subcategory_name: nestedSubcat ? nestedSubcat.name : data.nested_subcategory_name,
      nested_subcategory_slug: nestedSubcat ? nestedSubcat.slug : undefined,
    };
  });

  cachedEnrichedProducts = enriched;
  lastEnrichedFetchTime = now;
  return enriched;
};

export const fetchProducts = async (categorySlug?: string, subcategorySlug?: string, subsubcategorySlug?: string, nestedSubcategorySlug?: string, search?: string, sort?: string) => {
  const allProducts = await fetchAllProductsEnriched();

  const normalizeSlug = (slug: string) => {
    if (!slug) return '';
    try {
      return decodeURIComponent(slug).toLowerCase().replace(/\s+/g, '-');
    } catch (e) {
      return slug.toLowerCase().replace(/\s+/g, '-');
    }
  };

  let filtered = allProducts;

  if (nestedSubcategorySlug) {
    const norm = normalizeSlug(nestedSubcategorySlug);
    filtered = filtered.filter(p => p.nested_subcategory_slug && normalizeSlug(p.nested_subcategory_slug) === norm);
  } else if (subsubcategorySlug) {
    const norm = normalizeSlug(subsubcategorySlug);
    filtered = filtered.filter(p => p.subsubcategory_slug && normalizeSlug(p.subsubcategory_slug) === norm);
  } else if (subcategorySlug) {
    const norm = normalizeSlug(subcategorySlug);
    filtered = filtered.filter(p => p.subcategory_slug && normalizeSlug(p.subcategory_slug) === norm);
  } else if (categorySlug) {
    const norm = normalizeSlug(categorySlug);
    filtered = filtered.filter(p => p.category_slug && normalizeSlug(p.category_slug) === norm);
  }

  if (search && search.trim()) {
    const searchResult = executeSearch(filtered, search.trim(), {
      sort: sort as any
    });
    return searchResult.results;
  }

  // Sort on client side
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const dateB = b.created_at ? new Date(b.created_at).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return dateB - dateA;
    });
  }

  return filtered;
};

export const fetchProductBySlug = async (slug: string) => {
  const q = query(collection(db, 'products'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    const curated = CURATED_3D_PARTS_AND_ACCESSORIES.find(p => p.slug === slug);
    if (curated) return curated;
    throw new Error('Product not found');
  }
  
  const product = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
  
  if (product.category_id) {
    const catDoc = await getDoc(doc(db, 'categories', product.category_id));
    if (catDoc.exists()) {
      product.category_name = catDoc.data().name;
    }
  }

  if (product.subcategory_id) {
    const subcatDoc = await getDoc(doc(db, 'subcategories', product.subcategory_id));
    if (subcatDoc.exists()) {
      product.subcategory_name = subcatDoc.data().name;
    }
  }

  if (product.subsubcategory_id) {
    const subsubcatDoc = await getDoc(doc(db, 'subsubcategories', product.subsubcategory_id));
    if (subsubcatDoc.exists()) {
      product.subsubcategory_name = subsubcatDoc.data().name;
    }
  }

  if (product.nested_subcategory_id) {
    const nestedSubcatDoc = await getDoc(doc(db, 'nested_subcategories', product.nested_subcategory_id));
    if (nestedSubcatDoc.exists()) {
      product.nested_subcategory_name = nestedSubcatDoc.data().name;
    }
  }
  
  return product;
};

export const fetchCategories = async () => {
  const snapshot = await getDocs(collection(db, 'categories'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};

export const fetchSubcategories = async () => {
  const snapshot = await getDocs(collection(db, 'subcategories'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subcategory));
};

export const fetchSubsubcategories = async () => {
  const snapshot = await getDocs(collection(db, 'subsubcategories'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subsubcategory));
};

export const fetchNestedSubcategories = async () => {
  const snapshot = await getDocs(collection(db, 'nested_subcategories'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NestedSubcategory));
};

export const addProduct = async (product: Product) => {
  cachedEnrichedProducts = null;
  clearProductsCache();
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    created_at: new Date().toISOString()
  });
  return { id: docRef.id, ...product };
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  cachedEnrichedProducts = null;
  clearProductsCache();
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, updates);
  return { id, ...updates };
};

export const deleteProduct = async (id: string) => {
  cachedEnrichedProducts = null;
  clearProductsCache();
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
};

export const uploadProductImage = async (file: File) => {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const addCategory = async (category: Category) => {
  const docRef = await addDoc(collection(db, 'categories'), category);
  return { id: docRef.id, ...category };
};

export const updateCategory = async (id: string, updates: Partial<Category>) => {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, updates);
  return { id, ...updates };
};

export const deleteCategory = async (id: string) => {
  const docRef = doc(db, 'categories', id);
  await deleteDoc(docRef);
};

export const addSubcategory = async (subcategory: Subcategory) => {
  const docRef = await addDoc(collection(db, 'subcategories'), subcategory);
  return { id: docRef.id, ...subcategory };
};

export const updateSubcategory = async (id: string, updates: Partial<Subcategory>) => {
  const docRef = doc(db, 'subcategories', id);
  await updateDoc(docRef, updates);
  return { id, ...updates };
};

export const deleteSubcategory = async (id: string) => {
  const docRef = doc(db, 'subcategories', id);
  await deleteDoc(docRef);
};

export const addSubsubcategory = async (subsubcategory: Subsubcategory) => {
  const docRef = await addDoc(collection(db, 'subsubcategories'), subsubcategory);
  return { id: docRef.id, ...subsubcategory };
};

export const updateSubsubcategory = async (id: string, updates: Partial<Subsubcategory>) => {
  const docRef = doc(db, 'subsubcategories', id);
  await updateDoc(docRef, updates);
  return { id, ...updates };
};

export const deleteSubsubcategory = async (id: string) => {
  const docRef = doc(db, 'subsubcategories', id);
  await deleteDoc(docRef);
};

export const addNestedSubcategory = async (nestedSubcategory: NestedSubcategory) => {
  const docRef = await addDoc(collection(db, 'nested_subcategories'), nestedSubcategory);
  return { id: docRef.id, ...nestedSubcategory };
};

export const updateNestedSubcategory = async (id: string, updates: Partial<NestedSubcategory>) => {
  const docRef = doc(db, 'nested_subcategories', id);
  await updateDoc(docRef, updates);
  return { id, ...updates };
};

export const deleteNestedSubcategory = async (id: string) => {
  const docRef = doc(db, 'nested_subcategories', id);
  await deleteDoc(docRef);
};

export const submitInquiry = async (inquiryData: any) => {
  const docRef = await addDoc(collection(db, 'inquiries'), {
    ...inquiryData,
    created_at: new Date().toISOString(),
    status: 'pending'
  });

  // Send email via Web3Forms
  const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (web3formsAccessKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: web3formsAccessKey,
          subject: `New Product Inquiry: ${inquiryData.productName}${inquiryData.productSku ? ` [SKU: ${inquiryData.productSku}]` : ''}`,
          name: inquiryData.clientName,
          email: inquiryData.clientEmail,
          message: `New Product Inquiry for ${inquiryData.productName}\nSKU: ${inquiryData.productSku || 'Not Assigned'}\n\nClient Name: ${inquiryData.clientName}\nClient Email: ${inquiryData.clientEmail}\nClient Phone: ${inquiryData.clientPhone}\nQuantity: ${inquiryData.quantity}\n\nMessage:\n${inquiryData.message}`,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send email via Web3Forms');
      }
    } catch (error) {
      console.error("Failed to send email notification:", error);
      throw error;
    }
  } else {
    console.warn("VITE_WEB3FORMS_ACCESS_KEY is missing. Email notification was not sent.");
    throw new Error("VITE_WEB3FORMS_ACCESS_KEY is missing. Please configure it in your environment variables.");
  }

  return { id: docRef.id, ...inquiryData };
};

/**
 * Generates descriptive SEO-friendly URL paths for products:
 * e.g., /3d-printers/bambu-lab-a1-mini-combo-3d-printer
 * or falls back cleanly to /product/:slug
 */
export function getProductPath(product: { slug: string; category_slug?: string; category_name?: string }): string {
  if (!product || !product.slug) return '/shop';
  
  const catSlug = product.category_slug 
    ? product.category_slug.toLowerCase() 
    : (product.category_name ? product.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');

  if (catSlug.includes('3d-printer') || catSlug.includes('filament')) {
    return `/3d-printers/${product.slug}`;
  }
  if (catSlug.includes('robotic')) {
    return `/robotic-components/${product.slug}`;
  }
  if (catSlug.includes('computer') || catSlug.includes('pc')) {
    return `/computer-components/${product.slug}`;
  }
  if (catSlug.includes('tool')) {
    return `/tools/${product.slug}`;
  }

  return `/product/${product.slug}`;
}
