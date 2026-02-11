import React, { useState } from 'react';
import { X, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAuth } from "firebase/auth";

export default function SchedulePicker({ postId, onClose, onFinish }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const changeMonth = (offset) => setViewDate(new Date(currentYear, currentMonth + offset, 1));

  const handleDateClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(currentYear, currentMonth, day);
    setSelectedDate(newDate);
  };

  const updateTime = (unit, value) => {
    const newDate = new Date(selectedDate);
    if (unit === 'h') {
      const newHours = (newDate.getHours() + value + 24) % 24;
      newDate.setHours(newHours);
    } else {
      const newMinutes = (newDate.getMinutes() + value + 60) % 60;
      newDate.setMinutes(newMinutes);
    }
    setSelectedDate(newDate);
  };

  const handleSchedule = async () => {
    setIsProcessing(true);
    console.log(`🚀 EXECUTING SCHEDULE: Post ID [${postId}] at [${selectedDate.toLocaleString()}]`);

    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`https://blog-post-backend-aqmp.onrender.com/api/blog-posts/${postId}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ scheduledAt: selectedDate.toISOString() })
      });
      if (res.ok) {
        console.log("✅ TERMINAL: Schedule Persisted Successfully in Database.");
        onFinish();
      }
    } catch (err) {
      console.error("❌ TERMINAL ERROR:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-start justify-start pl-28 pt-[40px] bg-slate-900/10 backdrop-blur-[6px] animate-in fade-in duration-300">
      <div className="w-[24rem] bg-white/80 rounded-[2.5rem] p-8 relative border border-emerald-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_80px_rgba(16,185,129,0.2)] animate-in zoom-in-95 duration-300">
        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 border-[2px] border-emerald-400/20 animate-pulse rounded-[2.5rem]" />
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-emerald-600 transition-colors z-50">
          <X size={18} />
        </button>

        <header className="mb-6 relative z-10">
          <h3 className="text-2xl font-black text-emerald-600 tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            Schedule
          </h3>
        </header>

        <div className="space-y-6 relative z-10">
          <div className="bg-white rounded-[2rem] p-5 border border-emerald-50 shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)] transition-all">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex gap-2 relative z-50">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-50 rounded-lg transition-all text-slate-400 cursor-pointer">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-50 rounded-lg transition-all text-slate-400 cursor-pointer">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
                <span key={`${d}-${index}`} className="text-[8px] font-black text-slate-300 mb-2">{d}</span>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`e-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square flex items-center justify-center rounded-xl text-[10px] font-bold transition-all cursor-pointer relative z-20 ${isSelected ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-400/50 scale-110' : 'hover:bg-emerald-50 text-slate-600'}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative p-5 bg-white rounded-[2rem] border border-emerald-50 shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)] transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(16,185,129,0.4)]">
            <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-[2rem] pointer-events-none" />
            <div className="relative flex items-center justify-between z-10">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-emerald-600/60 uppercase tracking-[0.2em] mb-1">Time_Matrix</span>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-emerald-500" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {selectedDate.getHours() >= 12 ? 'PM' : 'AM'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-slate-200/50 border border-slate-300/20 shadow-inner">
                <div className="flex flex-col items-center gap-1">
                  <button onClick={() => updateTime('h', 1)} className="text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer relative z-30">
                    <ChevronLeft size={12} className="rotate-90" />
                  </button>
                  <span className="text-lg font-black text-slate-800 tabular-nums">
                    {selectedDate.getHours().toString().padStart(2, '0')}
                  </span>
                  <button onClick={() => updateTime('h', -1)} className="text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer relative z-30">
                    <ChevronLeft size={12} className="-rotate-90" />
                  </button>
                </div>

                <span className="text-slate-300 font-black animate-pulse">:</span>

                <div className="flex flex-col items-center gap-1">
                  <button onClick={() => updateTime('m', 5)} className="text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer relative z-30">
                    <ChevronLeft size={12} className="rotate-90" />
                  </button>
                  <span className="text-lg font-black text-slate-800 tabular-nums">
                    {selectedDate.getMinutes().toString().padStart(2, '0')}
                  </span>
                  <button onClick={() => updateTime('m', -5)} className="text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer relative z-30">
                    <ChevronLeft size={12} className="-rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSchedule}
            disabled={isProcessing}
            className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(16,185,129,0.4)] hover:bg-emerald-500 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? "SYNCING_NODES..." : "EXECUTE SCHEDULE"}
          </button>
        </div>
      </div>
    </div>
  );
}