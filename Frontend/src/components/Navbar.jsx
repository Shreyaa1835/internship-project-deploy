import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <span className="text-emerald-600 font-bold text-2xl">
          AI Blog Post Generator
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-600 text-sm">
              {user.email}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-emerald-300 text-emerald-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-50"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
