import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "../firebase";  // Ensure Firebase is properly initialized
import { doc, setDoc } from "firebase/firestore";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }, { merge: true });
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };

  // ✅ Add this function to update the user's cart in Firestore
  const updateUserCart = async (cart) => {
    if (!currentUser?.uid) return;

    const cartRef = doc(db, "carts", currentUser.uid);
    try {
      await setDoc(cartRef, { items: cart });
      console.log("Cart updated successfully in Firestore");
    } catch (error) {
      console.error("Failed to update cart in Firestore:", error);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, loginWithGoogle, logout, updateUserCart }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
