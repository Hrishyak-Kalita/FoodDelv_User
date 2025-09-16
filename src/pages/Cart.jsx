import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import AddressInput from "../components/location/AddressInput";
import {
  calculateDistanceInKm,
  calculateDeliveryCharge,
} from "../utils/deliveryDistance";

export default function Cart() {
  const { currentUser } = useUser();
  const { cart, reduceQuantity, increaseQuantity, removeFromCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();

  // Calculate total amount
  useEffect(() => {
    const foodTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = foodTotal + (deliveryCharge || 0);
    setTotalAmount(total);
  }, [cart, deliveryCharge]);

  // Handle address selection
  const handleAddressSelect = async (address) => {
    setSelectedAddress(address);
    if (address.lat && address.lng) {
      const restaurantLat = 26.452533; // Example: Bangalore
      const restaurantLng = 91.529157;
      const distance = calculateDistanceInKm(
        restaurantLat,
        restaurantLng,
        address.lat,
        address.lng
      );
      const charge = calculateDeliveryCharge(distance);
      setDeliveryCharge(charge);
    } else {
      setDeliveryCharge(0);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <p className="mb-4 text-gray-700">
          You need to login to view cart and order.
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          onClick={() => (window.location.href = "/login")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Cart 🛒</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => reduceQuantity(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
                <p className="font-bold text-red-500">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Delivery Address</h3>
        <AddressInput onSelectAddress={handleAddressSelect} />

        {!selectedAddress && cart.length > 0 && (
          <p className="text-red-500 mt-2 text-sm">
            Please select or add an address to proceed.
          </p>
        )}
      </div>

      {selectedAddress && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
          <h4 className="font-semibold text-lg mb-2">Order Summary</h4>
          <p>
            Items Total: ₹
            {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          </p>
          <p>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</p>
          <p className="font-bold mt-2">Total: ₹{totalAmount.toFixed(2)}</p>

          <button
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            onClick={() => {
              if (!selectedAddress) return;
              const fullAddress = `${selectedAddress.house}, ${selectedAddress.street}, ${selectedAddress.village}, ${selectedAddress.city} - ${selectedAddress.pin}`;
              navigate("/checkout", {
                state: {
                  selectedAddress: { ...selectedAddress, fullAddress },
                  deliveryCharge,
                  totalAmount,
                },
              });
            }}
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
}
