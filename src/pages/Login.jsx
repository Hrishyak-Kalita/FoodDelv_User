// src/pages/Login.jsx
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { currentUser, loginWithGoogle } = useUser();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <button
        onClick={loginWithGoogle}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Continue with Google
      </button>
    </div>
  );
}
