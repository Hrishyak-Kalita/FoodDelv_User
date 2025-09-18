import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../context/UserContext";
import { getCoordinatesFromAddress } from "../../utils/deliveryDistance";

export default function AddressInput({ onSelectAddress }) {
  const { currentUser } = useUser();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    house: "",
    street: "",
    village: "",
    city: "",
    pin: "",
  });
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const fetchAddresses = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", currentUser.uid, "addresses")
        );
        const userAddresses = [];
        querySnapshot.forEach((doc) => {
          userAddresses.push({ id: doc.id, ...doc.data() });
        });
        setAddresses(userAddresses);
      } catch (err) {
        console.error("Error fetching addresses:", err.message);
      }
    };

    fetchAddresses();
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleSelect = (address) => {
    setSelectedId(address.id);
    onSelectAddress(address);
    setShowForm(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullAddress = `${formData.house}, ${formData.street}, ${formData.village}, ${formData.city} - ${formData.pin}`;
      const coords = await getCoordinatesFromAddress(fullAddress);

      if (editingId) {
        const docRef = doc(db, "users", currentUser.uid, "addresses", editingId);
        await updateDoc(docRef, {
          ...formData,
          lat: coords.lat,
          lng: coords.lng,
        });

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingId
              ? { id: editingId, ...formData, lat: coords.lat, lng: coords.lng }
              : addr
          )
        );
        showToast("Address updated successfully.");
      } else {
        const docRef = await addDoc(
          collection(db, "users", currentUser.uid, "addresses"),
          {
            ...formData,
            lat: coords.lat,
            lng: coords.lng,
          }
        );
        const newAddress = {
          id: docRef.id,
          ...formData,
          lat: coords.lat,
          lng: coords.lng,
        };
        setAddresses((prev) => [...prev, newAddress]);
        showToast("New address added successfully.");
      }

      setSelectedId(editingId || formData.id);
      onSelectAddress({
        id: editingId || formData.id,
        ...formData,
        lat: coords.lat,
        lng: coords.lng,
      });
      setFormData({
        name: "",
        phone: "",
        house: "",
        street: "",
        village: "",
        city: "",
        pin: "",
      });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving address:", err.message);
      alert("Failed to save address. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setFormData({
      name: address.name,
      phone: address.phone,
      house: address.house,
      street: address.street,
      village: address.village,
      city: address.city,
      pin: address.pin,
    });
  };

  return (
    <div>
      {toastMsg && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">{toastMsg}</div>
      )}

      {addresses.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Select Previous Address:</p>

          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 rounded border mb-2 ${
                selectedId === address.id
                  ? "border-blue-500 bg-blue-50"
                  : "bg-white"
              }`}
            >
              {editingId === address.id ? (
                <form onSubmit={handleFormSubmit} className="space-y-2">
                  {/* form inputs same as before */}
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="house"
                    placeholder="House / Building"
                    value={formData.house}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street / Road"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="village"
                    placeholder="Village / Colony"
                    value={formData.village}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="pin"
                    placeholder="Pin Code"
                    value={formData.pin}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                  />

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      {loading ? "Saving..." : "Update"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedId === address.id}
                      onChange={() => handleSelect(address)}
                      className="mr-2"
                    />
                    <span>{`${address.house}, ${address.street}, ${address.village}, ${address.city} - ${address.pin}`}</span>
                  </div>

                  <button
                    onClick={() => handleEdit(address)}
                    className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition-colors duration-200"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!showForm && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              name: "",
              phone: "",
              house: "",
              street: "",
              village: "",
              city: "",
              pin: "",
            });
          }}
        >
          Add New Address
        </button>
      )}

      {showForm && !editingId && (
        <form
          onSubmit={handleFormSubmit}
          className="space-y-2 bg-gray-50 p-4 rounded shadow-md"
        >
          {/* inputs same as before */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="house"
            placeholder="House / Building"
            value={formData.house}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="street"
            placeholder="Street / Road"
            value={formData.street}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="village"
            placeholder="Village / Colony"
            value={formData.village}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="pin"
            placeholder="Pin Code"
            value={formData.pin}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <div className="flex space-x-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-1/2"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({
                  name: "",
                  phone: "",
                  house: "",
                  street: "",
                  village: "",
                  city: "",
                  pin: "",
                });
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded w-1/2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
