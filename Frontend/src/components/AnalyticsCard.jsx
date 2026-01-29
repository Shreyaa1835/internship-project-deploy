export default function AnalyticsCard() {
  const stats = [
    { label: "Total Projects", value: "8", color: "text-slate-800" },
    { label: "Drafting", value: "4", color: "text-amber-500" }, 
    { label: "Published", value: "3", color: "text-emerald-500" },
    { label: "Scheduled", value: "1", color: "text-teal-500" },
  ];

  return (
    <div className="relative h-full group">
      {/* Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-[3.5rem] blur-xl opacity-10 transition duration-1000 group-hover:opacity-20"></div>
      
      {/* Glass Body */}
      <div className="relative bg-white/50 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl h-full flex flex-col justify-between">
        <div className="space-y-10">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Metrics</h3>
            <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Real-time Performance</p>
          </div>

          <div className="flex items-center justify-around py-6 bg-white/30 rounded-[2.5rem] border border-white/40">
            <div className="relative h-24 w-24 rounded-full border-[10px] border-white/50 flex items-center justify-center shadow-lg">
               <div className="absolute h-24 w-24 rounded-full border-[10px] border-emerald-500 border-t-transparent -rotate-45"></div>
               <span className="text-md font-black text-slate-800">38%</span>
            </div>
            <div className="flex items-end gap-2 h-20">
              <div className="w-3 bg-amber-400 rounded-full h-[80%] shadow-lg shadow-amber-200/50"></div>
              <div className="w-3 bg-emerald-500 rounded-full h-[60%] shadow-lg shadow-emerald-200/50"></div>
              <div className="w-3 bg-teal-400 rounded-full h-[40%]"></div>
            </div>
          </div>

          <div className="space-y-6">
            {stats.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-white/20 pb-4 last:border-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                <span className={`text-xl font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full mt-8 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl">
          Detailed Insights
        </button>
      </div>
    </div>
  );
}