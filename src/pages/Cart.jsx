import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { currentUser } = useUser();
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Redirect guests to login
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null; // prevent flicker

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart 🛒</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {/* Proceed */}
          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
