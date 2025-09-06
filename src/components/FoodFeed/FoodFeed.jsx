import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useCart } from "../../context/CartContext";

export default function FoodFeed() {
  const { cart, addToCart } = useCart();
  const [foods, setFoods] = useState([]);
  const [showToast, setShowToast] = useState(false);

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

  const handleAddToCart = (food) => {
    addToCart(food);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500); // hide after 1.5s
  };

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
              className="p-5 rounded-2xl shadow-md hover:shadow-xl transition bg-white flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{food.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-bold text-red-500">₹{food.price}</p>
                <button
                  onClick={() => handleAddToCart(food)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-bounce">
          Added to cart! ({cart.length} items)
        </div>
      )}
    </div>
  );
}
