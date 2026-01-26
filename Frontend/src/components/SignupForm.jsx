import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebase/firebaseConfig"; // Make sure this path is correct

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    // Basic validation
    if (!email) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = "Invalid email address";

    if (!password) formErrors.password = "Password is required";

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    // Firebase signup
    setLoading(true);
    const auth = getAuth(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signup successful:", userCredential.user);
      alert("Account created successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "Email already exists" });
      } else if (error.code === "auth/weak-password") {
        setErrors({ password: "Password should be at least 6 characters" });
      } else if (error.code === "auth/invalid-email") {
        setErrors({ email: "Invalid email format" });
      } else {
        alert("Signup failed: " + error.message);
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
        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-xl font-bold text-white shadow-md transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {/* Login Link */}
      <p className="mt-3 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-600 hover:underline">
          Login
        </Link>
      </p>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s forwards;
        }
      `}</style>
    </div>
  );
}
