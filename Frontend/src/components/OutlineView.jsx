import { CheckCircle2, ChevronRight, X } from "lucide-react";

export default function OutlineView({ outline, onApprove, onCancel }) {
  const data = typeof outline === "string" ? JSON.parse(outline) : outline;

  return (
    <div className="relative w-full h-full group">
      <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-[3.2rem] blur-xl opacity-20 group-hover:opacity-40 animate-pulse transition duration-1000"></div>

      <div className="relative bg-white/90 backdrop-blur-2xl p-8 lg:p-10 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(16,185,129,0.2)] border border-emerald-100/50 flex flex-col h-full animate-in zoom-in-95 duration-500 overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-100/30 to-transparent pointer-events-none" />

        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <CheckCircle2 size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              AI <span className="text-emerald-600">Drafting...</span>
            </h2>
          </div>
          <button 
            onClick={onCancel} 
            className="text-slate-300 hover:text-emerald-500 hover:rotate-90 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sequential Line Reveal Area */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[400px] relative z-10">
          {data.sections?.map((sec, i) => (
            <div
              key={i}
              className="group/sec border-l-2 border-emerald-100 hover:border-emerald-400 pl-6 py-1 animate-in fade-in slide-in-from-left-4 duration-700 transition-colors"
              style={{ animationDelay: `${i * 0.6}s`, animationFillMode: 'both' }}
            >
              <h3 className="font-black text-slate-800 text-lg mb-3 group-hover/sec:text-emerald-700 transition-colors">
                {sec.heading}
              </h3>
              <ul className="space-y-2">
                {sec.points?.map((p, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-slate-500 text-sm font-bold items-start animate-in fade-in slide-in-from-top-1 duration-500"
                    style={{ 
                      animationDelay: `${(i * 0.6) + (j * 0.15) + 0.3}s`, 
                      animationFillMode: 'both' 
                    }}
                  >
                    <ChevronRight size={14} className="text-emerald-400 mt-1 shrink-0 group-hover/sec:translate-x-1 transition-transform" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Approve Button: Elevated Glow */}
        <button
          onClick={onApprove}
          className="relative z-10 w-full mt-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
        >
          Approve & Start Writing
        </button>
      </div>
    </div>
  );
}