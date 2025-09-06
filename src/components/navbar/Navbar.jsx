import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AccountDropdown from "../account/AccountDropdown";
import { ShoppingCart } from "lucide-react"; // cart icon

export default function Navbar() {
  const { currentUser } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
   <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
  {/* Logo */}
  <Link
    to="/"
    className="text-xl md:text-2xl font-bold text-red-500 hover:text-red-600"
  >
    FoodieApp
  </Link>

  <div className="flex items-center space-x-4">
    {/* Cart */}
    <Link to="/cart" className="relative">
      <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-gray-700 hover:text-red-500" />
    </Link>

    {/* Login / Profile */}
    {!currentUser ? (
      <Link
        to="/login"
        className="px-3 md:px-4 py-2 text-sm md:text-base bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Login / Signup
      </Link>
    ) : (
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setShowDropdown(!showDropdown)}>
          <img
            src={currentUser.photoURL || "https://via.placeholder.com/40"}
            alt="profile"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border"
          />
        </button>
        {showDropdown && (
          <AccountDropdown onClose={() => setShowDropdown(false)} />
        )}
      </div>
    )}
  </div>
</nav>

  );
}
