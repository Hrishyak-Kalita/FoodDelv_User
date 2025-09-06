import { db } from "../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export default function DevSeed() {
  const seed = async () => {
    // Restaurant
    const r = await addDoc(collection(db, "restaurants"), {
      name: "Bombay Spice",
      cuisine: "Indian, North Indian",
      rating: 4.4,
      imageUrl: "https://images.unsplash.com/photo-1604908176997-4316651451cf?q=80&w=1200",
      location: { lat: 19.076, lng: 72.8777 },
    });

    // Menu Items (subcollection)
    await setDoc(doc(collection(db, "restaurants", r.id, "menuItems")), {
      name: "Butter Chicken",
      price: 249,
      description: "Creamy tomato gravy, boneless chicken",
      imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229f5a3?q=80&w=1200",
    });
    await setDoc(doc(collection(db, "restaurants", r.id, "menuItems")), {
      name: "Paneer Tikka",
      price: 199,
      description: "Smoky paneer with spices",
      imageUrl: "https://images.unsplash.com/photo-1625944529780-c60bd0f71b4a?q=80&w=1200",
    });

    alert("Seeded! Restaurant ID: " + r.id);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Dev Seed</h2>
      <button onClick={seed}>Seed Sample Restaurant + Menu</button>
    </div>
  );
}
