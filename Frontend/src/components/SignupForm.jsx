import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import app from "../firebase/firebaseConfig";

export default function SignupForm({ setNotification }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!email) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = "Invalid email address";
    if (!password) formErrors.password = "Password is required";

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setLoading(true);
    const auth = getAuth(app);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);

      setNotification({ type: "success", message: "Account created successfully!" });

      setTimeout(() => {
        setNotification(null);
        navigate("/login");
      }, 2500);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "Email already exists" });
      } else {
        setNotification({ type: "error", message: "Signup failed: " + error.message });
        setTimeout(() => setNotification(null), 4000);
      }
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-[0_0_40px_10px_rgba(16,185,129,0.15)] w-full max-w-md animate-fadeIn">
      <h2 className="text-3xl font-bold text-emerald-600 mb-4 text-center">
        Sign Up
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1 font-bold text-xs uppercase tracking-widest">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-bold text-xs uppercase tracking-widest">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 ${
            loading
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
          }`}
        >
          {loading ? "Initializing..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-xs text-center text-slate-400 font-bold uppercase tracking-widest">
        Have an account?{" "}
        <Link to="/login" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
          Login
        </Link>
      </p>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s forwards;
        }
      `}</style>
    </div>
  );
}
