// src/pages/Orders.jsx
import { Link } from "react-router-dom";

export default function MyOrders() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Orders 📦</h2>

      {/* Orders list (later from Firestore) */}
      <p className="text-gray-600">No orders yet.</p>

      {/* Back button */}
      <Link
        to="/"
        className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        ← Back to Food Feed
      </Link>
    </div>
  );
}
