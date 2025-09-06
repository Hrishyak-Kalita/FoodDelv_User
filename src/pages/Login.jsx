// src/pages/Login.jsx
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginWithGoogle, currentUser } = useUser();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    navigate("/");
  };

  if (currentUser) {
    navigate("/");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white shadow-xl rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">Login to FoodieApp</h2>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 px-6 py-3 w-full bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
