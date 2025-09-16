import { useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useCart } from "../../context/CartContext";

export default function FoodFeed() {
  const { cart, addToCart } = useCart();
  const [foods, setFoods] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "foods"), async (snapshot) => {
      const allFoods = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const restaurantRef = doc(db, "restaurants", data.restaurantId);
          const restaurantSnap = await getDoc(restaurantRef);

          const restaurantData = restaurantSnap.exists()
            ? restaurantSnap.data()
            : { name: "Unknown Restaurant", location: "Unknown" };

          return {
            id: docSnap.id,
            ...data,
            restaurantName: restaurantData.name,
            restaurantLocation: restaurantData.location,
          };
        })
      );
      setFoods(allFoods);
    }, (err) => console.error("Error fetching foods:", err));

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (food) => {
    addToCart(food);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
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
            <div key={food.id} className="p-5 rounded-2xl shadow-md hover:shadow-xl transition bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
                {food.imageUrl && <img src={food.imageUrl} alt={food.name} className="w-20 h-20 object-cover rounded-md" />}
                <p className="text-sm text-gray-600 mt-1">{food.description}</p>
                <h3 className="text-lg font-semibold text-gray-800">
                  {food.restaurantName} • {food.restaurantLocation}
                </h3>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-bold text-red-500">₹{food.price}</p>
                <button onClick={() => handleAddToCart(food)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-bounce">
          Added to cart! ({cart.length} items)
        </div>
      )}
    </div>
  );
}
