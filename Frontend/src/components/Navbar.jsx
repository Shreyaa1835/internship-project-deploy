import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { FileText } from "lucide-react"; 

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isHomePage = location.pathname === "/";

  const solidEmerald = "bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-100";
  const ghostEmerald = "border border-emerald-300 text-emerald-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-all";

  return (
    <nav className="sticky top-0 z-[500] bg-white shadow-sm border-b px-8 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full"></div>
            <div className="relative w-full h-full bg-white border border-emerald-100 rounded-xl flex items-center justify-center text-[#2ecc91] shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="relative scale-[0.65]">
                <FileText size={38} strokeWidth={1.5} className="text-emerald-600/80" />
                <div className="absolute -bottom-1 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <div className="w-1 h-3 bg-white rounded-full transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
          <span className="bg-gradient-to-r from-teal-400 via-emerald-500 to-emerald-700 bg-clip-text text-transparent font-black text-2xl tracking-tighter">
            BlogGenAI
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && !isLoginPage && !isSignupPage && !isHomePage ? (
          <>
            <span className="text-gray-600 text-sm font-medium">{user.email}</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
              Logout
            </button>
          </>
        ) : (
          <>
            {isLoginPage && (
              <>
                <Link to="/" className={ghostEmerald}>Home</Link>
                <Link to="/signup" className={solidEmerald}>Signup</Link>
              </>
            )}
            {isSignupPage && (
              <>
                <Link to="/login" className={ghostEmerald}>Login</Link>
                <Link to="/" className={solidEmerald}>Home</Link>
              </>
            )}
            {isHomePage && (
              <>
                {user ? (
                   <>
                    <Link to="/dashboard" className={solidEmerald}>Dashboard</Link>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">Logout</button>
                   </>
                ) : (
                  <>
                    <Link to="/login" className={ghostEmerald}>Login</Link>
                    <Link to="/signup" className={solidEmerald}>Signup</Link>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;