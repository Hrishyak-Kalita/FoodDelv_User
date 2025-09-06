// src/components/account/AccountDropdown.jsx
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function AccountDropdown({ onClose }) {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/"); // back to home
  };

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-4 z-50">
      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="flex flex-col space-y-3 mt-6">
        <p className="font-semibold">{currentUser?.displayName || "User"}</p>
        <p className="text-sm text-gray-600">{currentUser?.email}</p>

        <Link
          to="/Myorders"
          onClick={onClose}
          className="text-blue-600 hover:underline"
        >
          My Orders
        </Link>

        <Link
          to="/cart"
          onClick={onClose}
          className="text-blue-600 hover:underline"
        >
          My Cart
        </Link>

        <button
          onClick={handleLogout}
          className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
