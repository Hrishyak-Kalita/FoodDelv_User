// src/components/BackButton.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ to = -1 }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-2 text-red-500 hover:text-red-600 mb-4"
    >
      <ArrowLeft size={20} />
      <span>Back</span>
    </button>
  );
}
