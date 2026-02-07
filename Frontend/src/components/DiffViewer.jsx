import React from 'react';
import { Check, Undo2, ArrowRightLeft, Sparkles, FileText } from 'lucide-react';

export default function DiffViewer({ oldText, newText, onApply, onDiscard }) {
  if (!newText) return null;

  return (
    <div className="absolute inset-0 z-[50] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      
      <div className="p-8 border-b flex justify-between items-center bg-slate-50/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-br from-emerald-700 to-teal-600 text-white rounded-[1.2rem] shadow-lg shadow-emerald-100">
            <ArrowRightLeft size={22} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black  tracking-tighter uppercase text-slate-800 flex items-center gap-2">
            Preview
            </h2>
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-1 italic">
              
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onDiscard} 
            className="group px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100 flex items-center gap-2"
          >
            <Undo2 size={16} className="group-hover:-rotate-45 transition-transform" /> Discard Changes
          </button>
          <button 
            onClick={onApply} 
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl bg-gradient-to-r from-emerald-600 to-teal-600
 hover:bg-emerald-600 transition-all flex items-center gap-2 active:scale-95"
          >
            <Check size={16} /> Apply Changes
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden bg-[#fcfdfd]">
        
        {/* LEFT SIDE: Original  */}
        <div className="flex-1 border-r border-slate-100 flex flex-col overflow-hidden group/original">
          <div className="p-6 bg-slate-100/50 border-b border-slate-100 flex items-center gap-3">
             <FileText size={14} className="text-slate-400" />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original_Manuscript</span>
          </div>
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-slate-50/30">
            <div className="text-sm leading-relaxed text-slate-400 line-through decoration-red-200/60 whitespace-pre-wrap italic font-medium opacity-80 group-hover/original:opacity-100 transition-opacity">
              {oldText}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Humanized  */}
        <div className="flex-1 flex flex-col overflow-hidden group/humanized shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.03)]">
          <div className="p-6 bg-emerald-50/30 border-b border-emerald-50 flex items-center gap-3">
             <Sparkles size={14} className="text-emerald-500" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Refined_Manuscript</span>
          </div>
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-white">
            <div className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-bold bg-emerald-50/10 rounded-2xl p-2">
              {newText}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER:  */}
      <div className="px-8 py-4 bg-white border-t border-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-6">
            <div className="flex flex-col">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Structural_Integrity</span>
               <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%] animate-pulse" />
               </div>
            </div>
         </div>
         <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em]">Review required before database commit</p>
      </div>

    </div>
  );
}