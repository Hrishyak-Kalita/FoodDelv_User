// src/services/orders.js
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const placeOrder = async (restaurantId, items) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Please login first");
  }

  // Save under user's orders
  await addDoc(collection(db, "users", user.uid, "orders"), {
    restaurantId,
    items,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  // Save under central orders (for restaurants/admins)
  await addDoc(collection(db, "orders"), {
    userId: user.uid,
    restaurantId,
    items,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return "Order placed successfully!";
};
