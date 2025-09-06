// src/components/FoodFeed/FoodFeed.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useCart } from "../../context/CartContext";

export default function FoodFeed() {
  const { cart, addToCart } = useCart();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const restaurantsSnap = await getDocs(collection(db, "restaurants"));
        const allFoods = [];

        for (let restaurant of restaurantsSnap.docs) {
          const foodsSnap = await getDocs(
            collection(db, "restaurants", restaurant.id, "foods")
          );
          for (let foodDoc of foodsSnap.docs) {
            const foodData = foodDoc.data();
            allFoods.push({
              id: foodDoc.id,
              restaurantId: restaurant.id,
              restaurantName: restaurant.data().name || "Unnamed Restaurant",
              ...foodData,
            });
          }
        }

        setFoods(allFoods);
      } catch (err) {
        console.error("Error fetching foods:", err);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Food Feed 🍔</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {foods.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            No foods available right now.
          </p>
        ) : (
          foods.map((food) => (
            <div
              key={food.id}
              className="p-5 bg-white border rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col, feed-grid"
            >
              {/* Image Placeholder */}
              <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Food Image</span>
              </div>

              <h3 className="text-lg font-semibold">{food.name}</h3>
              <p className="text-gray-600 flex-grow">{food.description}</p>
              <p className="mt-2 font-bold text-blue-700 text-lg">
                ₹{food.price}
              </p>
              <p className="text-sm text-gray-500">
                by {food.restaurantName}
              </p>

              <button
                onClick={() => addToCart(food)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
