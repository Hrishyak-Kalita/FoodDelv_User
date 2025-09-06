import React from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext"; // to get logged-in user

const PaymentButton = ({ food }) => {
  const { currentUser } = useUser();

  const handleCheckout = async () => {
    if (!currentUser) {
      alert("Please login to place an order!");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/create-checkout-session", {
        foodId: food.id,
        foodName: food.name,
        foodPrice: food.price,
        restaurantId: food.restaurantId,
        userId: currentUser.uid,
      });

      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error starting checkout.");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
    >
      Order Now
    </button>
  );
};

export default PaymentButton;
