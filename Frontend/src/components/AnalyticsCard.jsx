// src/components/AnalyticsCard.jsx

export default function AnalyticsCard() {
  // Real Data synchronized with your dashboard state
  const stats = [
    { label: "Total Projects", value: "8", color: "text-slate-800" },
    { label: "Drafting", value: "4", color: "text-amber-500" }, 
    { label: "Published", value: "3", color: "text-[#2ecc91]" },
    { label: "Scheduled", value: "1", color: "text-teal-500" },
  ];

  return (
    <div className="relative group p-[1px] rounded-[3.5rem] bg-gradient-to-br from-white/60 to-emerald-500/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] overflow-hidden h-full animate-fadeIn">
      
      {/* Expansive Glass Body (min-h-[650px] to match project container) */}
      <div className="bg-white/75 backdrop-blur-2xl p-12 rounded-[3.4rem] min-h-[650px] border border-white/50 flex flex-col justify-between relative z-10">
        
        {/* Background Glows */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-200/30 rounded-full blur-[80px] -z-0" />
        
        <div className="space-y-12">
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-emerald-600">
              Analytics Overview
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">BlogGen AI Real-Time Metrics</p>
          </div>

          {/* Scaled Visualization for 8 Projects */}
          <div className="flex items-end justify-around h-40 py-4">
            {/* 38% represents 3 Published out of 8 Total */}
            <div className="relative h-32 w-32 rounded-full border-[12px] border-slate-100 flex items-center justify-center shadow-inner">
               <div className="absolute h-32 w-32 rounded-full border-[12px] border-[#2ecc91] border-t-transparent -rotate-45"></div>
               <span className="text-lg font-black text-slate-800">38%</span>
            </div>
            
            {/* Visual Bar Chart Distribution */}
            <div className="flex items-end gap-3">
              <div className="w-4 bg-amber-400 rounded-t-lg h-24 shadow-lg shadow-amber-100 animate-pulse"></div> {/* Drafts */}
              <div className="w-4 bg-[#2ecc91] rounded-t-lg h-16 shadow-xl shadow-emerald-100"></div> {/* Published */}
              <div className="w-4 bg-teal-400 rounded-t-lg h-8"></div> {/* Scheduled */}
            </div>
          </div>

          {/* Real Data List */}
          <div className="space-y-8 pt-10 border-t border-slate-100/80">
            {stats.map((item, index) => (
              <div key={index} className="flex justify-between items-center group/item">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] group-hover/item:text-emerald-600 transition-colors">
                  {item.label}
                </span>
                <span className={`text-2xl font-black ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full mt-10 py-5 bg-gradient-to-r from-[#2ecc91] to-emerald-500 hover:shadow-emerald-200 hover:scale-[1.02] text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.25em] transition-all shadow-2xl active:scale-95">
          View Full Report
        </button>
      </div>
    </div>
  );
}