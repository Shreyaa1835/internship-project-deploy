import React from "react";
import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";
import { Sparkles } from "lucide-react";

export default function Login() {
  return (
    <div className="h-screen relative flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-emerald-400/30 rounded-full blur-[130px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-teal-300/30 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] right-[15%] w-[30%] h-[40%] bg-blue-400/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-[100] bg-white/30 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <Navbar />
      </div>

      <div className="flex-1 relative z-10 flex items-center justify-center p-4">
        <div className="relative group w-full max-w-sm lg:max-w-md transform scale-90 md:scale-100">
          
          <div className="absolute -inset-4 bg-emerald-400/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

          <div className="relative bg-white/40 backdrop-blur-3xl p-8 md:p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

            {/* CONTENT AREA */}
            <div className="relative z-10">
               <div className="mb-6 text-center space-y-1">
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Welcome Back</h2>
                 <p className="text-slate-500 text-xs md:text-sm font-bold">Your masterpieces are waiting.</p>
               </div>
               
               <div className="space-y-4">
                 <LoginForm />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}