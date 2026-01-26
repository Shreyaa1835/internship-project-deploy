import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!email) formErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      formErrors.email = "Invalid email address";

    if (!password) formErrors.password = "Password is required";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      console.log("Login submitted:", { email, password });
    }
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-[0_0_40px_10px_rgba(16,185,129,0.15)] w-full max-w-md animate-fadeIn">
      <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-1"
        >
          Login
        </button>
      </form>

      {/* Signup Link */}
      <p className="mt-4 text-center text-gray-600 text-sm">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-emerald-600 font-medium hover:underline"
        >
          Signup
        </Link>
      </p>

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s forwards; }
      `}</style>
    </div>
  );
}
