import { db, storage } from '../firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  unit?: string;
  taxText?: string;
  stock: number;
  category_id: string;
  subcategory_id?: string;
  subsubcategory_id?: string;
  nested_subcategory_id?: string;
  image_url: string;
  created_at?: string;
  category_name?: string;
  subcategory_name?: string;
  subsubcategory_name?: string;
  nested_subcategory_name?: string;
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

export const fetchProducts = async (categorySlug?: string, subcategorySlug?: string, subsubcategorySlug?: string, nestedSubcategorySlug?: string, search?: string, sort?: string) => {
  let q = collection(db, 'products');
  const queryConstraints: any[] = [];

  const normalizeSlug = (slug: string) => {
    if (!slug) return '';
    try {
      return decodeURIComponent(slug).toLowerCase().replace(/\s+/g, '-');
    } catch (e) {
      return slug.toLowerCase().replace(/\s+/g, '-');
    }
  };

  if (nestedSubcategorySlug) {
    const snap = await getDocs(collection(db, 'nested_subcategories'));
    const match = snap.docs.find(doc => normalizeSlug(doc.data().slug) === normalizeSlug(nestedSubcategorySlug));
    if (match) {
      queryConstraints.push(where('nested_subcategory_id', '==', match.id));
    } else {
      return [];
    }
  } else if (subsubcategorySlug) {
    const snap = await getDocs(collection(db, 'subsubcategories'));
    const match = snap.docs.find(doc => normalizeSlug(doc.data().slug) === normalizeSlug(subsubcategorySlug));
    if (match) {
      queryConstraints.push(where('subsubcategory_id', '==', match.id));
    } else {
      return [];
    }
  } else if (subcategorySlug) {
    const snap = await getDocs(collection(db, 'subcategories'));
    const match = snap.docs.find(doc => normalizeSlug(doc.data().slug) === normalizeSlug(subcategorySlug));
    if (match) {
      queryConstraints.push(where('subcategory_id', '==', match.id));
    } else {
      return [];
    }
  } else if (categorySlug) {
    const snap = await getDocs(collection(db, 'categories'));
    const match = snap.docs.find(doc => normalizeSlug(doc.data().slug) === normalizeSlug(categorySlug));
    if (match) {
      queryConstraints.push(where('category_id', '==', match.id));
    } else {
      return [];
    }
  }

  const finalQuery = queryConstraints.length > 0 ? query(q, ...queryConstraints) : q;
  const snapshot = await getDocs(finalQuery);
  let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

  // Sort on client side
  if (sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  } else {
    products.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }

  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => 
      (p.name && p.name.toLowerCase().includes(s)) || 
      (p.description && p.description.toLowerCase().includes(s))
    );
  }

  // Fetch category names
  const catSnapshot = await getDocs(collection(db, 'categories'));
  const categories = catSnapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().name;
    return acc;
  }, {} as Record<string, string>);

  // Fetch subcategory names
  const subcatSnapshot = await getDocs(collection(db, 'subcategories'));
  const subcategories = subcatSnapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().name;
    return acc;
  }, {} as Record<string, string>);

  // Fetch subsubcategory names
  const subsubcatSnapshot = await getDocs(collection(db, 'subsubcategories'));
  const subsubcategories = subsubcatSnapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().name;
    return acc;
  }, {} as Record<string, string>);

  // Fetch nested subcategory names
  const nestedSubcatSnapshot = await getDocs(collection(db, 'nested_subcategories'));
  const nestedSubcategories = nestedSubcatSnapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().name;
    return acc;
  }, {} as Record<string, string>);

  return products.map(p => ({ 
    ...p, 
    category_name: categories[p.category_id] || 'Unknown',
    subcategory_name: p.subcategory_id ? subcategories[p.subcategory_id] || 'Unknown' : undefined,
    subsubcategory_name: p.subsubcategory_id ? subsubcategories[p.subsubcategory_id] || 'Unknown' : undefined,
    nested_subcategory_name: p.nested_subcategory_id ? nestedSubcategories[p.nested_subcategory_id] || 'Unknown' : undefined
  }));
};

export const CURATED_3D_PARTS_AND_ACCESSORIES: Product[] = [
  {
    id: 'curated-part-1',
    name: 'Creality Hardened Steel High-Flow Nozzle Kit (0.4mm / 0.6mm)',
    slug: 'creality-hardened-steel-nozzle-kit',
    description: 'Wear-resistant hardened tool steel nozzles designed for abrasive carbon fiber, glow-in-the-dark, and metal-filled 3D printer filaments.',
    price: 899.00,
    originalPrice: 1299.00,
    stock: 45,
    category_id: '3d-printer-parts',
    category_name: '3D Printer & Scanner Parts',
    subcategory_name: '3D Printer Parts',
    image_url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'curated-part-2',
    name: 'Double-Sided Textured PEI Magnetic Spring Steel Build Plate (235x235mm)',
    slug: 'textured-pei-magnetic-spring-steel-plate',
    description: 'Gold frosted textured PEI powder-coated spring steel plate with magnetic base. Outstanding bed adhesion without glue stick.',
    price: 1499.00,
    originalPrice: 1999.00,
    stock: 30,
    category_id: '3d-printer-parts',
    category_name: '3D Printer & Scanner Parts',
    subcategory_name: '3D Printer Parts',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'curated-part-3',
    name: 'CR Touch Auto Bed Leveling Sensor Kit (Precision Metal Probe)',
    slug: 'cr-touch-auto-bed-leveling-sensor-kit',
    description: 'High-precision optical detection auto leveling sensor with durable retractable metal probe for automated mesh bed compensation.',
    price: 2450.00,
    originalPrice: 3199.00,
    stock: 22,
    category_id: '3d-printer-parts',
    category_name: '3D Printer & Scanner Parts',
    subcategory_name: '3D Printer Parts',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'curated-part-4',
    name: 'All-Metal Titanium Bimetal Heatbreak & Ceramic V6 Hotend Assembly',
    slug: 'all-metal-bimetal-v6-hotend-assembly',
    description: 'Ultra-efficient titanium-copper bimetal heatbreak preventing thermal creep. Supports high-temperature engineering filaments up to 300°C.',
    price: 1850.00,
    originalPrice: 2499.00,
    stock: 18,
    category_id: '3d-printer-parts',
    category_name: '3D Printer & Scanner Parts',
    subcategory_name: '3D Printer Parts',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'curated-part-5',
    name: 'AESUB Blue Vanishing 3D Scanning Spray (400ml Can)',
    slug: 'aesub-blue-vanishing-3d-scanning-spray',
    description: 'State-of-the-art sublimating antireflective spray for laser and optical 3D scanners. Evaporates completely within 4 hours without residue.',
    price: 2850.00,
    originalPrice: 3400.00,
    stock: 15,
    category_id: '3d-scanner-parts',
    category_name: '3D Printer & Scanner Parts',
    subcategory_name: '3D Scanner Accessories',
    image_url: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'curated-part-6',
    name: '3D Scanner Motorized 360° Automated Rotary Turntable (20cm)',
    slug: '3d-scanner-motorized-rotary-turntable',
    description: 'Heavy-duty motorized rotary table with matte anti-glare finish and USB power. Ideal for tabletop photogrammetry and 3D digitizing.',
    price: 3299.00,
    originalPrice: 4199.00,
    stock: 12,
    category_id: '3d-scanner-parts',
    category_name: '3D Printer & Scanner Parts',
    subcategory_name: '3D Scanner Accessories',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'curated-part-7',
    name: 'Precision High-Reflectivity 3D Scanning Marker Points (6mm / 1000 Pcs)',
    slug: 'reflective-3d-scanning-marker-points-6mm',
    description: 'High-contrast retroreflective circular tracking targets for handheld laser scanners. Essential for featureless smooth geometry.',
    price: 1199.00,
    originalPrice: 1699.00,
    stock: 50,
    category_id: '3d-scanner-parts',
    category_name: '3D Printer & Scanner Parts',
    subcategory_name: '3D Scanner Accessories',
    image_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'curated-part-8',
    name: 'Capricorn Premium XS Bowden PTFE Tubing (1 Meter) & Pneumatic Fittings',
    slug: 'capricorn-xs-ptfe-tubing-kit',
    description: 'High-lubricity fluoropolymer tubing with tight 1.9mm inner diameter tolerance for reduced retraction and sharper printing.',
    price: 649.00,
    originalPrice: 899.00,
    stock: 40,
    category_id: '3d-printer-parts',
    category_name: '3D Printer & Scanner Parts',
    subcategory_name: '3D Printer Parts',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600'
  }
];

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
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    created_at: new Date().toISOString()
  });
  return { id: docRef.id, ...product };
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, updates);
  return { id, ...updates };
};

export const deleteProduct = async (id: string) => {
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
          subject: `New Product Inquiry: ${inquiryData.productName}`,
          name: inquiryData.clientName,
          email: inquiryData.clientEmail,
          message: `New Product Inquiry for ${inquiryData.productName}\n\nClient Name: ${inquiryData.clientName}\nClient Email: ${inquiryData.clientEmail}\nClient Phone: ${inquiryData.clientPhone}\nQuantity: ${inquiryData.quantity}\n\nMessage:\n${inquiryData.message}`,
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
