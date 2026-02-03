// =======================
// IMPORTS
// =======================
import React, { useEffect, useState } from "react";
import {
  X,
  ShieldCheck,
  Cpu,
  Sparkles,
  Target,
  BarChart3,
  Activity,
  Zap,
  ChevronRight
} from "lucide-react";

/**
 * =========================================
 * PlagiarismChecker COMPONENT 
 * =========================================
 */
export default function PlagiarismChecker({
  result,
  loading,
  onClose,
  onHumanize
}) {

  // =======================
  // STATE VARIABLES
  // =======================
  const [animatedScore, setAnimatedScore] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");

  // =======================
  // SCORE ANIMATION EFFECT
  // =======================
  useEffect(() => {
    if (!result || result.error || result.status === "RESOURCE_EXHAUSTED") return;
    const target = Math.round(result.overall_similarity_score || 0);
    let frame;

    const animate = () => {
      setAnimatedScore(prev => {
        if (prev === target) return prev;
        return prev < target ? prev + 1 : prev - 1;
      });
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [result]);

  // =======================
  // LOADING SCREEN
  // =======================
  if (loading) {
    return (
      <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-700 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-300/40 rounded-full blur-[120px] animate-pulse" />
        
        <div className="relative flex flex-col items-center gap-8 scale-110">
          <div className="w-36 h-36 rounded-[2.5rem] border-[3px] border-emerald-100 flex items-center justify-center relative animate-scan-pulse bg-white/80 shadow-2xl">
            <Cpu size={56} className="text-emerald-500 relative z-10" />
            <div className="absolute inset-[-10px] rounded-full border-2 border-dashed border-emerald-300/40 animate-spin-slow" />
            <div className="absolute inset-0 rounded-[2.2rem] border-4 border-t-emerald-500 animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="text-emerald-700 font-black tracking-[0.5em] text-xs uppercase mb-3 text-center w-full">Manuscript Scan</h2>
            <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest italic text-center w-full">Mapping Linguistic Pattern Vectors...</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line shadow-[0_0_20px_2px_rgba(16,185,129,0.6)]" />

        <style>{`
          @keyframes scan-pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2); }
            50% { transform: scale(1.02); box-shadow: 0 0 40px 10px rgba(16, 185, 129, 0.1); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2); }
          }
          @keyframes scan-line { 0% { top: 0%; } 100% { top: 100%; } }
          .animate-spin-slow { animation: spin 8s linear infinite; }
          .animate-scan-pulse { animation: scan-pulse 2s infinite ease-in-out; }
          .animate-scan-line { animation: scan-line 3s cubic-bezier(0.4, 0, 0.2, 1) infinite; position: absolute; }
        `}</style>
      </div>
    );
  }

  // SILENT ERROR HANDLING
  if (!result || result.error || result.status === "RESOURCE_EXHAUSTED") return null;

  return (
    <div className="absolute inset-0 z-50 bg-[#F1F5F9]/95 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom-6 duration-700 overflow-hidden p-6 lg:p-8 h-full">
      
      
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-emerald-300/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-teal-200/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Area with high-diffusion shadow */}
      <header className="relative z-10 flex items-center justify-between mb-6 bg-white/70 backdrop-blur-md border border-white p-5 rounded-[2.2rem] shadow-[0_10px_40px_-15px_rgba(16,185,129,0.2)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase italic">
              Manuscript <span className="text-emerald-600">HUD</span>
            </h1>
            <p className="text-[8px] text-emerald-500 font-black tracking-[0.3em] uppercase mt-1 flex items-center gap-2">
              <Zap size={8} className="fill-emerald-500" /> PRO MATRIX V2.5
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
          <X size={20} />
        </button>
      </header>

      <main className="relative z-10 flex-1 h-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch pb-2">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-hidden">
            
            {/* 1. Similarity Meter - Added multi-layered glow shadow */}
            <div className="bg-white/80 border border-white rounded-[2.8rem] p-6 flex flex-col items-center shadow-[0_20px_60px_-15px_rgba(16,185,129,0.25),0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden flex-[1.5] justify-center group">
               <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-[2.8rem] blur-lg opacity-100"></div>
              
              <div className="relative w-48 h-48 lg:w-56 lg:h-56">
                <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                  <circle cx="50%" cy="50%" r="44%" stroke="#f0fdf4" strokeWidth="14" fill="none" />
                  <circle cx="50%" cy="50%" r="44%" stroke="url(#hudGrad)" strokeWidth="14" fill="none" 
                    strokeDasharray="276%" strokeDashoffset={`${276 - (276 * animatedScore) / 100}%`} strokeLinecap="round" 
                    className="transition-all duration-1000 ease-out" />
                  <defs>
                    <linearGradient id="hudGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-5xl font-black text-slate-800 italic">{animatedScore}%</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Similarity_Index</span>
                </div>
              </div>
            </div>

            {/* 2. Pattern Analysis */}
            <div className="bg-white/80 border border-white rounded-[2.5rem] p-6 space-y-4 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.15)] flex-1 flex flex-col justify-center backdrop-blur-md">
               <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <BarChart3 size={12} className="text-emerald-500" /> Pattern_Analysis
               </h3>
               <div className="space-y-4">
                 {[{ label: "Generic Phrasing", val: Math.max(0, animatedScore - 5) }, { label: "Neural Likelihood", val: animatedScore }].map((bar, i) => (
                   <div key={i} className="space-y-2">
                     <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-tight">
                       <span>{bar.label}</span><span className="text-emerald-600 font-bold">{bar.val}%</span>
                     </div>
                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000" style={{ width: `${bar.val}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-full overflow-hidden">
            
            {/* 3. Verdict Container - Fixed Height with Internal Scroll */}
            <div className="bg-white/95 border border-white rounded-[2.8rem] p-7 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)] relative overflow-hidden group border-l-[5px] border-l-emerald-500 flex-[0.8] flex flex-col">
               <div className="absolute top-0 right-0 p-6 opacity-[0.06] text-emerald-500 group-hover:rotate-12 transition-transform duration-700">
                <Activity size={60} />
               </div>
               <h4 className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] uppercase text-emerald-600 mb-3 italic shrink-0">
                 <Target size={14} /> Scan Verdict
               </h4>
               {/* SCROLLABLE INNER CONTENT */}
               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <p className="text-slate-600 leading-relaxed text-[15px] font-medium italic border-l-2 border-emerald-100 pl-5">
                   "{result.analysis_summary}"
                 </p>
               </div>
            </div>

            {/* 4. Rewrite Command */}
            <div className="flex-[1.5] bg-white/80 border border-white rounded-[2.8rem] p-7 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col gap-5 relative overflow-hidden group backdrop-blur-md">
              <div className="flex items-center gap-3 text-slate-800 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Sparkles size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Rewrite_Command</span>
              </div>

              <textarea
                value={userPrompt}
                onChange={e => setUserPrompt(e.target.value)}
                placeholder="Give AI instructions to refine patterns..."
                className="flex-1 w-full resize-none bg-white/50 border border-emerald-100 rounded-[1.8rem] p-6 text-sm outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-400/5 shadow-inner custom-scrollbar"
              />

              <button
                onClick={() => onHumanize(userPrompt)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] transition-all duration-300 flex items-center justify-center gap-4 shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4),0_0_15px_rgba(16,185,129,0.2)] active:scale-[0.98] shrink-0"
              >
                <Zap size={16} className="fill-white" />
                Refine Masterpiece
              </button>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98133; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}} />
    </div>
  );
}