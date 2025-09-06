import { useState } from "react";
import LocationPicker from "../location/LocationPicker";
import { getDistanceAndETA, calculateDeliveryCharge } from "../../utils/deliveryDistance";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function Checkout({ cart, user, restaurant }) {
  const [userLocation, setUserLocation] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const handleLocationSelect = async (loc) => {
    setUserLocation(loc);
    const { distanceKm, etaMinutes } = await getDistanceAndETA(loc, restaurant.location);
    const deliveryCharge = calculateDeliveryCharge(distanceKm);
    setDeliveryInfo({ distanceKm, etaMinutes, deliveryCharge });
  };

  const placeOrder = async () => {
    if (!userLocation || !deliveryInfo) return alert("Select location first!");

    const totalItems = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalAmount = totalItems + deliveryInfo.deliveryCharge;

    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      restaurantId: restaurant.id,
      items: cart,
      userLocation,
      restaurantLocation: restaurant.location,
      distanceKm: deliveryInfo.distanceKm,
      etaMinutes: deliveryInfo.etaMinutes,
      deliveryCharge: deliveryInfo.deliveryCharge,
      totalAmount,
      status: "Pending",
      createdAt: Timestamp.now()
    });

    alert("Order placed successfully!");
  };

  return (
    <div>
      <h2>Checkout</h2>
      <LocationPicker onLocationSelect={handleLocationSelect} />

      {deliveryInfo && (
        <div className="mt-4">
          <p>Distance: {deliveryInfo.distanceKm.toFixed(1)} km</p>
          <p>ETA: {deliveryInfo.etaMinutes} mins</p>
          <p>Delivery Charge: ₹{deliveryInfo.deliveryCharge}</p>
          <p>
            Total: ₹
            {cart.reduce((sum, item) => sum + item.price * item.qty, 0) +
              deliveryInfo.deliveryCharge}
          </p>
        </div>
      )}

      <button onClick={placeOrder} className="bg-green-600 text-white px-4 py-2 mt-3">
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
