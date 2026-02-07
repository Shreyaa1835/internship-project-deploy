export default function AnalyticsCard({ posts = [] }) {
  const total = posts.length;
  const drafting = posts.filter(p => ["RESEARCHING", "WRITING", "OUTLINE_READY", "Drafting", "Draft"].includes(p.status)).length;
  const published = posts.filter(p => p.status === "Published").length;
  const scheduled = posts.filter(p => p.status === "Scheduled").length;

  const completionRate = total > 0 ? Math.round((published / total) * 100) : 0;

  const stats = [
    { label: "Total Posts", value: total, color: "text-slate-800" },
    { label: "Drafting", value: drafting, color: "text-amber-500" }, 
    { label: "Published", value: published, color: "text-emerald-500" },
    { label: "Scheduled", value: scheduled, color: "text-teal-500" },
  ];

  return (
    <div className="relative h-full group">
      <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-[3.5rem] blur-xl opacity-10 transition duration-1000 group-hover:opacity-20"></div>
      
      <div className="relative bg-white/50 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/60 shadow-2xl h-full flex flex-col justify-between">
        <div className="space-y-10">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Metrics</h3>
          </div>

          <div className="flex items-center justify-around py-6 bg-slate-950/5 rounded-[2.5rem] border border-white/20 shadow-inner">
            <div className="relative h-24 w-24 rounded-full flex items-center justify-center shadow-lg bg-white/80 overflow-hidden">
               <div 
                 className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
                 style={{ 
                   background: `conic-gradient(#10b981 ${completionRate}%, #f1f5f9 0)` 
                 }}
               ></div>
               
               <div className="absolute inset-[10px] bg-white rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] z-10">
                  <span className="text-md font-black text-slate-800">{completionRate}%</span>
               </div>
            </div>
            
            <div className="flex items-end gap-2 h-20">
              <div 
                className="w-3 bg-amber-400 rounded-full shadow-lg shadow-amber-200/50 transition-all duration-700" 
                style={{ height: total > 0 ? `${Math.max((drafting/total) * 100, 10)}%` : '10%' }}
              ></div>
              <div 
                className="w-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200/50 transition-all duration-700" 
                style={{ height: total > 0 ? `${Math.max((published/total) * 100, 10)}%` : '10%' }}
              ></div>
              <div 
                className="w-3 bg-teal-400 rounded-full transition-all duration-700" 
                style={{ height: total > 0 ? `${Math.max((scheduled/total) * 100, 10)}%` : '10%' }}
              ></div>
            </div>
          </div>

          {/* Metrics List Section */}
          <div className="space-y-6">
            {stats.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-white/20 pb-4 last:border-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                <span className={`text-xl font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  );
}