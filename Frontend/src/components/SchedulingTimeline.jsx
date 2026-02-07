import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Edit3, 
  RotateCcw, 
  Zap, 
  Inbox,
  ArrowUpRight
} from "lucide-react";

export default function SchedulingTimeline({ data = [] }) {
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // 1. DYNAMIC DATE EXTRACTION
  // ---------------------------------------------------------
  const getPostTime = (post) => {
    const rawDate = post?.scheduledDate || post?.date || post?.scheduled_at;
    if (!rawDate) return Infinity; 
    
    const parsed = new Date(rawDate).getTime();
    return isNaN(parsed) ? Infinity : parsed;
  };

  // ---------------------------------------------------------
  // 2. FILTERING & CHRONOLOGICAL SORTING
  // ---------------------------------------------------------
  const sortedPosts = useMemo(() => {
    const now = Date.now();
    
    return [...data]
      // Only include posts that are scheduled for the future or have no date (Infinity)
      .filter(post => getPostTime(post) >= now)
      // Sort: Earliest scheduled mission always at the top
      .sort((a, b) => getPostTime(a) - getPostTime(b));
  }, [data]);

  // ---------------------------------------------------------
  // 3. UTILITIES
  // ---------------------------------------------------------
  const calculateProgress = (status = "") => {
    const map = { 
      RESEARCHING: 25, 
      OUTLINE_READY: 45, 
      WRITING: 70, 
      DRAFTING: 85, 
      REFINING: 95, 
      SCHEDULED: 100 
    };
    return map[String(status).toUpperCase()] || 15;
  };

  const formatScheduleLabel = (post) => {
    const timestamp = getPostTime(post);
    if (timestamp === Infinity) return "Unscheduled";
    
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div id="mission-timeline" className="relative h-full group">
      <div className="relative bg-transparent -mt-5 pt-2 pb-2 px-2 p-4 h-[750px] flex flex-col overflow-hidden">
        
        <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar relative z-10">
          
          {/* HEADER NODE */}
          <div className="relative pl-12 mb-12 group/header">
            <div className="absolute left-[-4px] top-0 w-1 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
            <div className="absolute left-[19px] top-10 bottom-[-48px] w-1 bg-emerald-500/20 rounded-full" />
            
            <div className="absolute left-0 top-0 z-10">
              <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.2)]">
                <Zap size={18} fill="white" className="drop-shadow-sm" />
              </div>
            </div>
            
            <div className="pt-2 relative z-10">
              <h3 className="text-4xl font-black tracking-tighter leading-none italic bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(16,185,129,0.1)]">
                Pending Publication
              </h3>
            </div>
          </div>

          {sortedPosts.length > 0 ? (
            sortedPosts.map((post, index) => {
              const isFirst = index === 0;
              const progressPercentage = calculateProgress(post.status);
              
              return (
                <div key={post.id || index} className="relative pl-12 mb-12 group/card">
                  {index !== sortedPosts.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-48px] w-1 bg-emerald-500/20 rounded-full" />
                  )}
                  
                  {/* STATUS NODE */}
                  <div className="absolute left-0 top-0 z-10">
                    {isFirst && (
                       <div className="absolute inset-[-4px] bg-emerald-500/20 rounded-2xl animate-pulse blur-sm" />
                    )}
                    
                    <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-500
                      ${isFirst ? 'bg-emerald-500 text-white scale-110' : 'bg-white text-slate-300'}`}>
                      {isFirst ? <Zap size={18} fill="white" className="drop-shadow-sm" /> : <Clock size={18} />}
                    </div>
                  </div>

                  {/* Card UI */}
                  <div className="p-7 rounded-[2.8rem] border border-white/60 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(16,185,129,0.15)] hover:border-emerald-100 group-hover/card:translate-x-1">
                    
                    <div className="flex justify-between items-start mb-5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {formatScheduleLabel(post)}
                        </span>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-[1.1] break-words">
                          {post.title || post.topic || "Untitled Post"}
                        </h4>
                      </div>
                      <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* Progress Bar Area */}
                    <div className="space-y-2 mb-8">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{post.status || "IDLE"}</span>
                        <span className="text-[11px] font-black text-emerald-600">{progressPercentage}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                          style={{ width: `${progressPercentage}%` }} 
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-5 border-t border-slate-50">
                      <button onClick={() => navigate(`/blog-posts/${post.id}`)} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => navigate(`/blog-posts/${post.id}?action=reschedule`)} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        <RotateCcw size={14} /> Re-Schedule
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-20">
              <Inbox size={60} className="mb-4 text-slate-200" />
              <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Zero Future Missions</p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffffff44; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ffffff; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #eaf3f044 transparent; }
      `}} />
    </div>
  );
}