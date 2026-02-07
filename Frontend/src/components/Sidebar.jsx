import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig"; 
import { signOut } from "firebase/auth";
import { Home, FileText, Settings, LogOut, X, User, Calendar, BarChart3 } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen, setSidePanel }) {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "guest@example.com"; 
  const userName = userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1);

  const menuItems = [
    { icon: <Home size={20}/>, label: "Dashboard", path: "/dashboard" },
    { icon: <FileText size={20}/>, label: "Create Post", path: "/blog-posts/create" },
    // ENSURE THIS ACTION IS "schedule" to trigger the hotswap logic
    { icon: <Calendar size={20}/>, label: "Post Schedule", action: "schedule" },
    { icon: <BarChart3 size={20}/>, label: "Analytics", action: "analytics" },
  ];

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth); 
        localStorage.removeItem("userEmail");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const itemBaseStyles = `relative group/item w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 font-bold text-sm text-left`;
  const inactiveStyles = `text-slate-400 hover:bg-emerald-500/5 hover:text-emerald-400`;
  const activeStyles = `bg-emerald-500/10 text-emerald-400 group-hover/nav:bg-transparent group-hover/nav:text-slate-400 hover:!bg-emerald-500/10 hover:!text-emerald-400`;

  return (
    <>
      <aside className={`fixed top-0 left-0 z-[110] w-72 bg-[#1e293b] min-h-screen flex flex-col border-r border-slate-700/50 transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* HEADER */}
        <div className="p-6 flex items-center justify-between border-b border-slate-700/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-none w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
              <User size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-white font-bold text-sm truncate">{userName}</span>
              <span className="text-slate-500 text-[10px] font-medium truncate">{userEmail}</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors">
            <X size={22} />
          </button>
        </div>

        <nav className="group/nav flex-1 px-4 py-6 space-y-3">
          {menuItems.map((item, index) => {
            if (item.action) {
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSidePanel(item.action); 
                    setIsOpen(false);
                  }}
                  className={`${itemBaseStyles} ${inactiveStyles}`}
                >
                  <div className="absolute left-0 top-1/3 bottom-1/3 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-300 opacity-0 scale-y-75 group-hover/item:opacity-100 group-hover/item:scale-y-100" />
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={index}
                to={item.path}
                end 
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  ${itemBaseStyles}
                  ${isActive ? activeStyles : inactiveStyles}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className={`
                      absolute left-0 top-1/3 bottom-1/3 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-300
                      ${isActive 
                        ? "opacity-100 scale-y-100 group-hover/nav:opacity-0 group-hover/nav:scale-y-75 group-hover/item:!opacity-100 group-hover/item:!scale-y-100" 
                        : "opacity-0 scale-y-75 group-hover/item:opacity-100 group-hover/item:scale-y-100"}
                    `} />
                    <span className="relative z-10">{item.icon}</span>
                    <span className="relative z-10">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="p-6 border-t border-slate-700/50 space-y-2">
          <NavLink to="/settings" end onClick={() => setIsOpen(false)} className={({ isActive }) => `w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-sm transition-all ${isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>
            <Settings size={20} /> Settings
          </NavLink>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-red-500/5 rounded-xl transition-all font-bold text-sm group">
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </aside>

      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 z-[105]" />}
    </>
  );
}