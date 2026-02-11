import React, { useState } from 'react';
import { Download, X, Globe, Zap, FileText, Settings, Share2, Check, Layers } from 'lucide-react';
import { getAuth } from "firebase/auth";

export default function ExportButton({ postId, content, topic, onClose }) {
  const [format, setFormat] = useState("markdown");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copyState, setCopyState] = useState("COPY");
  const [includeMeta, setIncludeMeta] = useState(true);

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      
      const res = await fetch(`https://blog-post-backend-aqmp.onrender.com/api/blog-posts/${postId}/export?format=${format}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Export Failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'markdown' ? 'md' : format;
      link.setAttribute('download', `MANUSCRIPT_${Date.now()}.${extension}`);
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
      
      if (onClose) onClose();
    } catch (err) { 
      console.error("Download Error:", err); 
    } finally { 
      setIsProcessing(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-start justify-start pl-28 pt-[70px] bg-slate-900/10 backdrop-blur-[8px] animate-in fade-in duration-300">
      
      <div className="w-[22rem] bg-white/100 rounded-[2.5rem] p-8 relative border border-emerald-200/50 shadow-[0_0_50px_-10px_rgba(16,185,129,0.3),0_0_100px_-20px_rgba(16,185,129,0.15)] animate-in zoom-in-95 duration-300">
        
        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 border-[2px] border-emerald-400/20 animate-pulse rounded-[2.5rem]" />
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-emerald-600 transition-colors z-10">
          <X size={18}/>
        </button>

        <header className="mb-6 relative z-10">
          <div className="flex items-center gap-2 mb-1 text-emerald-600">
            <div className="relative">
              <Layers size={14} className="animate-pulse relative z-10" />
              <div className="absolute inset-0 bg-emerald-400 blur-md opacity-50" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-600 tracking-tighter">Export</h3>
        </header>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-2  gap-3">
            {[
              { id: 'markdown', label: 'MARKDOWN', icon: <Zap shadow-inner size={12}/> },
              { id: 'html', label: 'HTML', icon: <Globe shadow-inner size={12}/> },
              { id: 'pdf', label: 'PDF', icon: <FileText shadow-inner size={12}/> },
              { id: 'txt', label: 'TEXT', icon: <Settings shadow-inner size={12}/> }
            ].map((engine) => (
              <button
                key={engine.id}
                onClick={() => setFormat(engine.id)}
                className={`flex flex-col items-start gap-3 p-4 rounded-[1.5rem] border-2 transition-all duration-500 ${
                  format === engine.id 
                  ? 'bg-emerald-50/50 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/20' 
                  : 'bg-slate-200/60 border-slate-200/20 text-slate-400 hover:bg-white shadow-inner' 
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 ${format === engine.id ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white shadow-sm'}`}>
                  {engine.icon}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${format === engine.id ? 'text-emerald-700' : 'text-slate-400/60'}`}>{engine.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between px-5 py-4 bg-slate-200/60 rounded-2xl border border-slate-200/20 shadow-inner">
            <div className="text-left">
              <p className="text-[9px] font-black text-slate-900 uppercase">INJECT METADATA</p>
            </div>
            <button 
              onClick={() => setIncludeMeta(!includeMeta)}
              className={`w-10 h-5 rounded-full transition-all relative ${includeMeta ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-300/50'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${includeMeta ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={async () => {
                await navigator.clipboard.writeText(content);
                setCopyState("SYNCED");
                setTimeout(() => setCopyState("COPY"), 2000);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
            >
              {copyState === "SYNCED" ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              {copyState}
            </button>
            
            <button 
              onClick={handleExport}
              disabled={isProcessing}
              className="flex-[1.5] relative overflow-hidden py-4 bg-emerald-600 text-white rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? "PREPARING..." : "DOWNLOAD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}