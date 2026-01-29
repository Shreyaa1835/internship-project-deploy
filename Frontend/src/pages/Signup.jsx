import React from "react";
import Navbar from "../components/Navbar";
import SignupForm from "../components/SignupForm";
import Footer from "../components/Footer";
import { Sparkles } from "lucide-react";

export default function Signup() {
  return (
    <div className="min-h-screen relative flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      {/* --- BACKGROUND GLOW LAYER --- */}
      {/* Multi-toned neon blobs to match the Dashboard and Login aesthetic */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-emerald-400/30 rounded-full blur-[130px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-teal-300/30 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] right-[15%] w-[30%] h-[40%] bg-blue-400/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Glass Navbar */}
      <div className="relative z-[100] bg-white/30 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <Navbar />
      </div>

      <main className="flex-1 relative z-10 flex items-center justify-center py-24 px-4">
        <div className="relative group w-full max-w-md">
          
          {/* RADIANT OUTER GLOW: Fades in on hover for an interactive feel */}
          <div className="absolute -inset-4 bg-emerald-400/20 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

          

          {/* THE GLASS CONTAINER: High-transparency frosting */}
          <div className="relative bg-white/40 backdrop-blur-3xl p-10 md:p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden">
            
            {/* INTERNAL REFLECTION: Mimics light source on the glass surface */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

            {/* CONTENT AREA */}
            <div className="relative z-10">
               <div className="mb-8 text-center space-y-2">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Join Us</h2>
                 <p className="text-slate-500 text-sm font-bold">Begin your creative AI journey today.</p>
               </div>
               
               <SignupForm />
               
               
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}