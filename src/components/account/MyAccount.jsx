import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import BackButton from "../BackButton/BackButton";
export default function MyAccount() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData({
          displayName: user.displayName || "",
          email: user.email || "",
          phoneNumber: "",
          address: "",
        });
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, userData);
      setIsEditing(false);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to save user data:", err);
    }
  };

  if (!user) return null; // avoid flicker

  return (
    <div className="max-w-xl mx-auto p-6">
        <div className="flex justify-between">
      <h2 className="text-2xl font-bold mb-6">Account Details 👤</h2>
      <BackButton/>
      </div>
      <div className="space-y-4">
        <label className="block">
          <span className="font-medium">Name:</span>
          <input
            type="text"
            name="displayName"
            value={userData.displayName}
            onChange={handleChange}
            readOnly={!isEditing}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="font-medium">Email:</span>
          <input
            type="email"
            name="email"
            value={userData.email}
            readOnly
            className="mt-1 block w-full rounded border px-3 py-2 bg-gray-100"
          />
        </label>

        <label className="block">
          <span className="font-medium">Phone Number:</span>
          <input
            type="tel"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            readOnly={!isEditing}
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="font-medium">Address:</span>
          <textarea
            name="address"
            value={userData.address}
            onChange={handleChange}
            readOnly={!isEditing}
            className="mt-1 block w-full rounded border px-3 py-2"
            rows={3}
          />
        </label>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}
