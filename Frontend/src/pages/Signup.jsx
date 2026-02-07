import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SignupForm from "../components/SignupForm";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function Signup() {
  const [notification, setNotification] = useState(null);

  return (
    <div className="h-screen relative flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-emerald-400/30 rounded-full blur-[130px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-teal-300/30 rounded-full blur-[130px] pointer-events-none" />

      {/* Navbar */}
      <div className="relative z-[100] bg-white/30 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <Navbar />
      </div>

      {notification && (
        <div
          className={`fixed top-[100px] left-10 z-[99999] flex items-center gap-3 px-8 py-5 rounded-[1.5rem] border backdrop-blur-2xl shadow-2xl animate-slideLeft ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-800"
              : "bg-red-500/10 border-red-400/30 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={22} className="text-emerald-500" />
          ) : (
            <AlertCircle size={22} className="text-red-500" />
          )}

          <span className="font-black text-sm uppercase tracking-tight italic">
            {notification.message}
          </span>
        </div>
      )}

      <main className="flex-1 relative z-10 flex items-center justify-center p-4">
        <div className="relative group w-full max-w-sm lg:max-w-md transform scale-90 md:scale-100">
          
          <div className="absolute -inset-4 bg-emerald-400/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <div className="relative bg-white/40 backdrop-blur-3xl p-8 md:p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-6 text-center space-y-1">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
                  Join Us
                </h2>
                <p className="text-slate-500 text-xs md:text-sm font-bold">
                  Begin your creative AI journey today.
                </p>
              </div>

              <SignupForm setNotification={setNotification} />
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(-100px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
}
