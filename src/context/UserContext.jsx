// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, signInWithGoogle, logoutUser } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, loginWithGoogle, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
