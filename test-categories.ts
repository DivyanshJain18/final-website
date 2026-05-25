import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const snap = await getDocs(collection(db, "categories"));
    console.log("Found", snap.size, "categories");
    snap.forEach(doc => console.log(doc.id, doc.data()));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
