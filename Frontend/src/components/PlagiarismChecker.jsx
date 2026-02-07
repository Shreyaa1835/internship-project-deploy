import React, { useEffect, useState } from "react";
import { X, ShieldCheck, BarChart3, Sparkles, Zap, Cpu } from "lucide-react";

export default function PlagiarismChecker({ result, loading, onClose, onHumanize }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");

  const getVerdict = (score) => {
    if (score <= 20) return { text: "Highly Original" };
    if (score <= 50) return { text: "Moderate Similarity" };
    return { text: "High Similarity Risk" };
  };

  const verdict = getVerdict(animatedScore);

  useEffect(() => {
    if (!result || result.error) return;
    const target = Math.min(100, Math.max(0, Math.round(result.overall_similarity_score || 0)));
    let frameId;
    const animate = () => {
      setAnimatedScore(prev => {
        if (prev === target) {
          cancelAnimationFrame(frameId);
          return prev;
        }
        return prev < target ? prev + 1 : prev - 1;
      });
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
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

  const metrics = [
    { label: "Similarity Percentage", val: animatedScore },
    { label: "Matched Content Length", val: Math.round(animatedScore * 0.8) },
    { label: "Original Content Score", val: 100 - animatedScore },
    { label: "Rewrite Effort Needed", val: animatedScore > 50 ? 90 : animatedScore > 20 ? 50 : 15 }
  ];

  return (
    <div className="absolute inset-0 z-50 bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 backdrop-blur-3xl flex flex-col p-10 lg:p-14 overflow-y-auto">

      {/* HEADER */}
      <header className="relative flex flex-col items-center mb-14">
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-2 rounded-xl bg-emerald-100/70 border border-emerald-200 text-emerald-600 hover:bg-emerald-200 transition"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-emerald-50 flex items-center justify-center shadow-[0_15px_30px_rgba(16,185,129,0.7)] mb-4">
          <ShieldCheck size={24} />
        </div>

        <h1 className="text-xl font-black tracking-[0.25em] uppercase italic text-emerald-800">
          Plagiarism Check
        </h1>

        <div className="h-1 w-16 rounded-full bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 mt-3" />
      </header>

      <main className="flex flex-col gap-12 max-w-6xl mx-auto w-full">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* CIRCLE */}
          <div className="lg:col-span-5 rounded-[4rem] bg-emerald-50/60 backdrop-blur-xl p-12 flex items-center justify-center shadow-[0_40px_80px_rgba(16,185,129,0.7)]">
            <div className="relative w-72 h-72">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  stroke="#d1fae5"
                  strokeWidth="22"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  stroke="url(#emeraldGradient)"
                  strokeWidth="22"
                  fill="none"
                  strokeDasharray="276%"
                  strokeDashoffset={`${276 - (276 * animatedScore) / 100}%`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#74c5aa" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-black italic text-emerald-900 drop-shadow">
                  {animatedScore}%
                </span>
                <span className="text-[11px]  tracking-widest text-emerald-600 mt-2">
                  Similarity 
                </span>
              </div>
            </div>
          </div>

          {/* VECTOR ANALYSIS */}
          <div className="lg:col-span-7 rounded-[4rem] bg-emerald-50/70 backdrop-blur-xl p-12 shadow-[0_40px_80px_rgba(16,185,129,0.4)] flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px]  tracking-[0.45em] font-black text-emerald-600 flex items-center gap-3">
                <BarChart3 size={18} className="text-emerald-500" />
                  Analysis
              </h3>

              <div className="px-6 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-700 font-black text-[10px] uppercase tracking-widest shadow-inner">
                {verdict.text}
              </div>
            </div>

            <div className="space-y-8">
              {metrics.map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px]  font-black tracking-tight text-emerald-600">
                      {bar.label}
                    </span>
                    <span className="font-black text-emerald-700">
                      {bar.val}{i === 3 ? "" : "%"}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-emerald-100/70 p-0.5 shadow-inner overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                      style={{ width: `${bar.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COMMAND PLATE */}
        <div className="rounded-[3rem] bg-emerald-50/80 backdrop-blur-xl p-5 shadow-[0_35px_70px_rgba(16,185,129,0.7)] flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-emerald-200 pr-8 pl-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-400">
              <Sparkles size={20} />
            </div>
            <span className="text-[10px]  tracking-widest font-black text-emerald-600 w-24">
             Command Interface
            </span>
          </div>

          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Instruct AI to refine linguistic patterns..."
            className="flex-grow bg-transparent h-12 py-3 text-sm font-bold text-emerald-800 placeholder:text-emerald-300 outline-none resize-none"
          />

          <button
            onClick={() => onHumanize(userPrompt)}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-emerald-50 font-black  text-[11px] tracking-widest shadow-[0_15px_35px_rgba(16,185,129,0.6)] hover:scale-[1.02] active:scale-95 transition"
          >
            <Zap size={16} className="inline mr-2" />
            Refine Post
          </button>
        </div>

      </main>
    </div>
  );
}