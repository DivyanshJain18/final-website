import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const categories = [
  { name: "Robotic Components", slug: "robotic-components", description: "All robotic components" },
  { name: "Computer Components", slug: "computer-components", description: "All computer components" }
];

const subcategories = [
  { name: "Motors", slug: "motors", description: "Motors for robotics", category_slug: "robotic-components" },
  { name: "Sensors", slug: "sensors", description: "Sensors for robotics", category_slug: "robotic-components" },
  { name: "Processors", slug: "processors", description: "CPUs", category_slug: "computer-components" },
  { name: "Memory", slug: "memory", description: "RAM", category_slug: "computer-components" }
];

const products = [
  {
    name: "DC Motor 12V",
    slug: "dc-motor-12v",
    description: "High torque DC motor",
    price: 15.99,
    stock: 100,
    category_slug: "robotic-components",
    subcategory_slug: "motors",
    image_url: "https://picsum.photos/seed/motor/400/400"
  },
  {
    name: "Ultrasonic Sensor",
    slug: "ultrasonic-sensor",
    description: "Distance measuring sensor",
    price: 5.99,
    stock: 200,
    category_slug: "robotic-components",
    subcategory_slug: "sensors",
    image_url: "https://picsum.photos/seed/sensor/400/400"
  },
  {
    name: "Intel Core i7",
    slug: "intel-core-i7",
    description: "High performance CPU",
    price: 299.99,
    stock: 50,
    category_slug: "computer-components",
    subcategory_slug: "processors",
    image_url: "https://picsum.photos/seed/cpu/400/400"
  },
  {
    name: "16GB DDR4 RAM",
    slug: "16gb-ddr4-ram",
    description: "Fast memory",
    price: 79.99,
    stock: 150,
    category_slug: "computer-components",
    subcategory_slug: "memory",
    image_url: "https://picsum.photos/seed/ram/400/400"
  }
];

async function seed() {
  console.log("Starting seed...");
  
  // Clear existing data
  for (const collectionName of ["products", "categories", "subcategories"]) {
    const snap = await getDocs(collection(db, collectionName));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, collectionName, d.id));
    }
    console.log(`Cleared ${collectionName}`);
  }

  const categoryMap = {};
  for (const cat of categories) {
    const docRef = await addDoc(collection(db, "categories"), cat);
    categoryMap[cat.slug] = docRef.id;
    console.log(`Added category: ${cat.name}`);
  }

  const subcategoryMap = {};
  for (const subcat of subcategories) {
    const catId = categoryMap[subcat.category_slug];
    const docRef = await addDoc(collection(db, "subcategories"), {
      name: subcat.name,
      slug: subcat.slug,
      description: subcat.description,
      category_id: catId
    });
    subcategoryMap[subcat.slug] = docRef.id;
    console.log(`Added subcategory: ${subcat.name}`);
  }

  for (const prod of products) {
    const catId = categoryMap[prod.category_slug];
    const subcatId = subcategoryMap[prod.subcategory_slug];
    await addDoc(collection(db, "products"), {
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      category_id: catId,
      subcategory_id: subcatId,
      image_url: prod.image_url,
      createdAt: new Date().toISOString()
    });
    console.log(`Added product: ${prod.name}`);
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch(console.error);
