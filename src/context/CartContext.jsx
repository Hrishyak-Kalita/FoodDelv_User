import { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "./UserContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { currentUser } = useUser();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchCart = async () => {
        const docRef = doc(db, "carts", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().cart;
          setCart(Array.isArray(data) ? data : []); // Ensure data is array
        } else {
          setCart([]);
        }
      };

      fetchCart();
    } else {
      setCart([]);  // Ensure cart is always array
    }
  }, [currentUser]);

  const saveCartToFirestore = async (updatedCart) => {
    if (!currentUser) return;
    const docRef = doc(db, "carts", currentUser.uid);
    await setDoc(docRef, { cart: updatedCart });
  };

  const addToCart = (newItem) => {
  if (!cart || !newItem) return;

  const validItem = {
    id: newItem.id,
    name: newItem.name || "Unnamed Food",
    price: typeof newItem.price === "number" ? newItem.price : 0,
    imageUrl: newItem.imageUrl || "",
    restaurantId: newItem.restaurantId || "unknown",
    restaurantName: newItem.restaurantName || "Unknown",
  };

  setCart((prevCart) => {
    const existingItem = prevCart.find(item => item.id === validItem.id);
    const updatedCart = existingItem
      ? prevCart.map(item =>
          item.id === validItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...prevCart, { ...validItem, quantity: 1 }];

    saveCartToFirestore(updatedCart);
    return updatedCart;
  });
};

  const reduceQuantity = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);

      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
  };
  const increaseQuantity = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )

      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(item => item.id !== id);
      saveCartToFirestore(updatedCart);
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, reduceQuantity,increaseQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
