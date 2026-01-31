import React from 'react';
import { Edit3, Sparkles } from 'lucide-react';

export default function ContentEditor({ content, setContent }) {
  return (
    <div className="w-full min-h-[600px] flex flex-col gap-6 animate-in fade-in duration-700">
      {/* Editor Header Decor */}
      <div className="flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Edit3 size={18} />
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
            Neural_Editor_Active
          </span>
        </div>
        <div className="flex items-center gap-2 text-emerald-500/50 italic text-xs font-medium">
          <Sparkles size={14} />
          Auto-sync enabled
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="relative flex-grow group">
        <div className="absolute inset-0 bg-emerald-400/5 rounded-[4rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="
            relative z-10 w-full h-[700px] p-12 lg:p-16 
            /* Match the main canvas styling */
            bg-white/80 backdrop-blur-3xl 
            border-[3px] border-emerald-100/50 
            rounded-[4rem] outline-none 
            /* Smooth focus transition with emerald glow */
            focus:border-emerald-400 focus:shadow-[0_0_40px_rgba(16,185,129,0.15)] 
            transition-all duration-500
            /* Typography */
            font-medium text-xl text-slate-800 leading-[1.8] 
            placeholder:text-slate-300 placeholder:italic
            resize-none shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)]
            custom-scrollbar
          "
          placeholder="Unleash your intelligence here..."
        />
      </div>
      
      {/* Footer Info */}
      <div className="px-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between">
        <span>Characters: {content?.length || 0}</span>
        <span>Words: {content ? content.trim().split(/\s+/).length : 0}</span>
      </div>
    </div>
  );
}