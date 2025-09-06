import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AccountDropdown from "../account/AccountDropdown";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { currentUser } = useUser();
  const { cart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      <Link to="/" className="text-xl font-bold text-red-500">
        FoodieApp
      </Link>

      <div className="flex items-center gap-4">
        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700 hover:text-red-500 transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h14l-1.35 6.75a1 1 0 01-.98.75H6a1 1 0 01-1-.75L3 6H21"
            />
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {cart.length}
            </span>
          )}
        </Link>

        {/* User Account */}
        {!currentUser ? (
          <Link
            to="/login"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Login / Signup
          </Link>
        ) : (
          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)}>
              <img
                src={currentUser.photoURL || "https://via.placeholder.com/40"}
                alt="profile"
                className="w-10 h-10 rounded-full"
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
