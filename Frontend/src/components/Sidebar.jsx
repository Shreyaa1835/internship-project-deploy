// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig"; 
import { signOut } from "firebase/auth";
import { Home, FileText, CheckCircle, Clock, AlertCircle, Settings, LogOut, X, User } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  // Extract user info from localStorage
  const userEmail = localStorage.getItem("userEmail") || "guest@example.com"; 
  const userName = userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1);

  const menuItems = [
    { icon: <Home size={20}/>, label: "Dashboard", path: "/dashboard" },
    { icon: <FileText size={20}/>, label: "Drafting", path: "/drafts" },
    { icon: <CheckCircle size={20}/>, label: "Published", path: "/published" },
    { icon: <Clock size={20}/>, label: "Scheduled", path: "/scheduled" },
    { icon: <AlertCircle size={20}/>, label: "Errors", path: "/errors" },
  ];

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth); // Sign out from Firebase
        localStorage.removeItem("userEmail");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <>
      {/* SIDEBAR DRAWER */}
      <aside className={`fixed top-0 left-0 z-[110] w-72 bg-[#1e293b] min-h-screen flex flex-col border-r border-slate-700/50 transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* --- HEADER: Profile on Left, Close Icon on Right --- */}
        <div className="p-6 flex items-center justify-between border-b border-slate-700/30">
          
          {/* User Profile Section (Left Side) */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-none w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <User size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-white font-bold text-sm truncate">{userName}</span>
              <span className="text-slate-500 text-[10px] font-medium truncate">{userEmail}</span>
            </div>
          </div>

          {/* Close Button (Right Side) */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="flex-none p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm tracking-wide
                ${isActive ? "bg-[#2ecc91]/10 text-[#2ecc91] shadow-inner" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}
              `}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-700/50 space-y-2">
          <NavLink to="/settings" onClick={() => setIsOpen(false)} className={({ isActive }) => `w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm ${isActive ? "text-white bg-slate-800" : "text-slate-400 hover:text-white"}`}>
            <Settings size={20} /> Settings
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm group">
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-[105] transition-opacity duration-300"
        />
      )}
    </>
  );
}