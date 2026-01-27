import { useNavigate } from "react-router-dom";

export default function CreateButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/blog-posts/create")}
      className="
        flex items-center gap-2
        bg-gradient-to-br from-emerald-400 to-teal-700
        text-white px-8 py-3.5
        rounded-[2rem] font-bold text-lg
        shadow-lg hover:brightness-110
        transition-all active:scale-95
      "
    >
      Create Blog <span className="text-sm">🖋️</span>
    </button>
  );
}
