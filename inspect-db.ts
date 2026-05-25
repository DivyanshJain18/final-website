import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const snap = await getDocs(collection(db, "categories"));
    console.log(`categories: ${snap.size} documents`);
    snap.forEach(d => console.log("  ", d.id, d.data().name, d.data().slug));
  } catch (e) {
    console.error(`Error fetching categories:`, e.message);
  }
  process.exit(0);
}
run();
