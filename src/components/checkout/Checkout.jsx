import { useLocation, useNavigate } from "react-router-dom";
export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedAddress, deliveryCharge, totalAmount } = location.state || {}; // Redirect if accessed directly or invalid data
  if (
    !selectedAddress ||
    deliveryCharge === undefined ||
    totalAmount === undefined
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        {" "}
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          {" "}
          No delivery address selected or invalid order.{" "}
        </h2>{" "}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow"
          onClick={() => navigate("/cart")}
        >
          {" "}
          Back to Cart{" "}
        </button>{" "}
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      {" "}
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Checkout 🧾
      </h1>{" "}
      {/* Delivery Address */}{" "}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        {" "}
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Delivery Address
        </h2>{" "}
        <p className="text-gray-600">{selectedAddress.fullAddress}</p>{" "}
      </div>{" "}
      {/* Order Summary */}{" "}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        {" "}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Order Summary
        </h2>{" "}
        <div className="flex justify-between mb-2">
          {" "}
          <span className="text-gray-600">Items Total:</span>{" "}
          <span className="font-medium">
            ₹{(totalAmount - deliveryCharge).toFixed(2)}
          </span>{" "}
        </div>{" "}
        <div className="flex justify-between mb-2">
          {" "}
          <span className="text-gray-600">Delivery Charge:</span>{" "}
          <span className="font-medium">₹{deliveryCharge.toFixed(2)}</span>{" "}
        </div>{" "}
        <hr className="my-2" />{" "}
        <div className="flex justify-between mt-2">
          {" "}
          <span className="text-gray-800 font-bold text-lg">
            Total Amount:
          </span>{" "}
          <span className="text-gray-800 font-bold text-lg">
            ₹{totalAmount.toFixed(2)}
          </span>{" "}
        </div>{" "}
      </div>{" "}
      {/* Payment */}{" "}
      <div className="bg-white p-6 rounded-xl shadow-md">
        {" "}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Payment Method
        </h2>{" "}
        <p className="text-gray-600 mb-4">
          Currently using simulated payment. Integrate real gateway here.
        </p>{" "}
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-200">
          {" "}
          Pay Now{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
