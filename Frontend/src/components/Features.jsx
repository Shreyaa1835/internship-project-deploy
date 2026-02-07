import React, { useState, useEffect } from 'react';
import { 
  Search, ListTree, PenTool, Sparkles, ShieldCheck, 
  CheckCircle2, Hash, Zap, ChevronRight, Target, Database, Terminal,
  Lightbulb, Fingerprint, BookOpen, PenLine, Info, Activity, Command
} from 'lucide-react';

const PipelineSimulation = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 0, label: "Topic", icon: Search, title: "Spark an Idea", desc: "Start by entering your favorite topic and keywords." },
    { id: 1, label: "Outline", icon: ListTree, title: "Organize Thoughts", desc: "Watch the AI build a clear outline for your story." },
    { id: 2, label: "Write", icon: PenTool, title: "Create Content", desc: "The AI writes your article line by line in real-time." },
    { id: 3, label: "Refine", icon: Sparkles, title: "Perfect the Tone", desc: "Polishing sentences to make them clear and professional." },
    { id: 4, label: "Verify", icon: ShieldCheck, title: "Ready to Post", desc: "Checking that your work is 100% unique and original." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 12000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-[#f0f4f3] px-12 pt-24 pb-64 min-h-[95vh] flex flex-col items-center overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-200/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10">
        <header className="mb-12 border-b border-slate-200/60 pb-6 flex justify-between items-end">
           <div>
              <h2 className="bg-gradient-to-r from-teal-400 via-emerald-500 to-emerald-700 bg-clip-text text-transparent font-black text-4xl tracking-tighter">
                The Features Behind the Masterpiece <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
              </h2>              
           </div>
           <div className="flex gap-2 mb-1">
              {[0,1,2,3,4].map(i => (
                <div key={i} className={`w-8 h-1 rounded-full transition-all duration-500 ${activeStep === i ? 'bg-emerald-500 w-12' : 'bg-slate-200'}`} />
              ))}
           </div>
        </header>

        <div className="flex gap-10 items-start h-[520px]">
          
          <div className="flex-1 h-full bg-white/95 backdrop-blur-xl rounded-[3rem] border border-white shadow-[0_0_80px_15px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden transition-all duration-700">
            
            <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
              <div className="flex gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-400/20" />
                <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
              </div>
              <div className="flex items-center gap-6">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                   {steps[activeStep].label}_INTERFACE
                 </div>
              </div>
            </div>

            <div className="flex-grow flex overflow-hidden relative">
               
               <div className="w-[40%] bg-slate-50/50 border-r border-slate-100 p-10 flex flex-col relative overflow-hidden" key={`info-${activeStep}`}>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100 mb-8">
                       <Lightbulb size={14} className="text-emerald-500" />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Working</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
                       {activeStep === 0 && "Spark Your Creativity"}
                       {activeStep === 1 && "Structuring the Narrative"}
                       {activeStep === 2 && "Generative Manuscript"}
                       {activeStep === 3 && "Surgical Polish"}
                       {activeStep === 4 && "Integrity Verification"}
                    </h3>
                    
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-emerald-200 pl-6 mb-8">
                       {activeStep === 0 && "Enter a topic and keywords to activate the semantic research agent. We scan global data to find the most relevant insights."}
                       {activeStep === 1 && "AI organizes unstructured research into a professional outline, mapping intent to logical clusters."}
                       {activeStep === 2 && "The writing engine streams high-density content line-by-line, maintaining a consistent conversational tone."}
                       {activeStep === 3 && "Refine grammar and rhythm automatically. We balance lexical density to ensure professional clarity."}
                       {activeStep === 4 && "Linguistic patterns are verified against global databases to guarantee 100% human-like originality."}
                    </p>

                    
                  </div>
                  <Command className="absolute -bottom-10 -left-10 w-40 h-40 text-slate-200/40 -rotate-12" />
               </div>

               <div className="w-[60%] p-12 flex flex-col justify-center relative bg-white/30 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/[0.02] animate-pulse pointer-events-none" />

                  {activeStep === 0 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Topic_Input</span>
                          </div>
                          <div className="w-full p-6 bg-white border border-emerald-100 rounded-[2rem] text-slate-800 text-2xl font-black tracking-tight overflow-hidden shadow-xl shadow-emerald-500/5 relative">
                             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                             <span className="animate-[typing_3s_steps(20)_forwards] whitespace-nowrap border-r-4 border-emerald-500 italic pr-2">The Future of AI </span>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="flex-1 py-5 bg-emerald-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20">
                             <Zap size={16} className="animate-pulse fill-white" /> Generate Post
                          </div>
                          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                             <Database size={24} />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* SCENE 1: OUTLINE REVEAL */}
                  {activeStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-1000">
                       <div className="flex items-center gap-4 p-6 bg-white rounded-[2.5rem] shadow-xl border-l-[12px] border-l-emerald-500 border border-emerald-50 animate-in slide-in-from-left-6">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                             <BookOpen size={20} />
                          </div>
                          <span className="text-xl font-black text-slate-800 italic tracking-tight">01. Introduction</span>
                       </div>
                       <div className="ml-20 space-y-6">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="flex gap-5 items-center animate-in fade-in" style={{ animationDelay: `${0.8 + i * 0.5}s`, animationFillMode: 'both' }}>
                               <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                  <ChevronRight size={14} className="stroke-[3px]" />
                                </div>
                               <div className={`h-3 bg-slate-100 rounded-full shadow-inner ${i === 0 ? 'w-full' : i === 1 ? 'w-2/3' : 'w-1/2'}`} />
                            </div>
                          ))}
                       </div>
                    </div>
                  )}

                  {/* SCENE 2: LIVE WRITING */}
                  {activeStep === 2 && (
                    <div className="flex flex-col animate-in zoom-in-95 duration-700">
                       <div className="flex items-center justify-between mb-8 bg-white/50 p-4 rounded-2xl border border-emerald-50">
                          <div className="flex items-center gap-2">
                             <PenLine size={16} className="text-emerald-600" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Drafting...</span>
                          </div>
                          <div className="flex gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                          </div>
                       </div>
                       <div className="font-serif text-slate-600 text-2xl leading-relaxed italic border-l-[12px] border-emerald-500/20 pl-12 py-8 bg-emerald-50/10 rounded-r-[3rem] relative">
                          <p className="animate-[typing_5s_steps(60)_forwards] overflow-hidden whitespace-nowrap border-r-4 border-emerald-500 pr-2">"In the fast-moving landscape of 2026..."</p>
                          <p className="opacity-30 mt-4 leading-tight text-lg">AI is rapidly shifting how we all work, live, and connect. Think about personalized suggestions...</p>
                          
                       </div>
                    </div>
                  )}

                  {/* SCENE 3: SIMPLE DIFF */}
                  {activeStep === 3 && (
                    <div className="flex flex-col gap-6 animate-in fade-in duration-1000 h-full justify-center">
                       <div className="bg-red-50/30 p-8 rounded-[3rem] border border-red-100 opacity-40 relative group">
                          <div className="absolute top-4 right-8 p-1 rounded bg-red-100 text-red-500 text-[7px] font-black uppercase">High Similarity</div>
                          <p className="text-sm text-red-800 line-through italic leading-relaxed">"The AI tool makes writing fast so you save a lot of time every day."</p>
                       </div>
                       <div className="bg-emerald-50/50 p-10 rounded-[3.5rem] border border-emerald-200 shadow-inner relative group animate-in slide-in-from-right-8">
                          <div className="absolute top-4 right-8 p-1 rounded bg-emerald-100 text-emerald-600 text-[7px] font-black uppercase">Unique_Optmized</div>
                          <p className="text-sm text-slate-800 font-bold italic leading-relaxed">"Autonomous creation improves your speed and professional clarity, optimizing your daily workflow."</p>
                          
                       </div>
                    </div>
                  )}

                  {/* SCENE 4: HUD */}
                  {activeStep === 4 && (
                    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-1000">
                       <div className="relative group">
                         <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
                         <div className="w-56 h-56 rounded-full border-[22px] border-emerald-50 bg-white shadow-2xl flex flex-col items-center justify-center relative transition-transform group-hover:scale-105">
                            <div className="absolute inset-[-15px] rounded-full border-[6px] border-emerald-500 border-t-transparent animate-[spin_4s_linear_infinite]" />
                            <span className="text-7xl font-black text-slate-800 italic tracking-tighter">15<span className="text-emerald-500">%</span></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Similarity</span>
                         </div>
                       </div>
                       <div className="bg-white/80 backdrop-blur-md text-slate-600 p-8 rounded-[3rem] shadow-xl border-t-[8px] border-t-emerald-500 w-full text-[13px] font-medium text-center italic leading-relaxed relative">
                          <Fingerprint className="absolute -top-6 left-1/2 -translate-x-1/2 text-emerald-500 w-12 h-12 bg-white rounded-2xl p-2 shadow-lg border border-emerald-50" />
                          <p className="mt-4">"Linguistic integrity verified. Your content is 100% unique and optimized for human-original reading experiences."</p>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* --- RIGHT: TIMELINE --- */}
          <div className="w-[300px] h-full flex flex-col relative px-4">
            <div className="absolute left-[36px] top-0 w-[2.5px] h-full bg-slate-200/80 z-0 rounded-full shadow-inner" />
            <div 
              className="absolute left-[36px] top-0 w-[2.5px] bg-emerald-500 z-0 shadow-[0_0_20px_rgba(16,185,129,1)] transition-all duration-1000 ease-in-out rounded-full" 
              style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />

            <div className="flex flex-col justify-between h-full relative z-10">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;
                const isCompleted = activeStep > step.id;

                return (
                  <button 
                    key={step.id} 
                    onClick={() => setActiveStep(step.id)} 
                    className="flex items-center gap-8 group cursor-pointer text-left py-1"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-[5px] transition-all duration-700
                      ${isActive ? 'bg-emerald-600 border-white text-white shadow-[0_0_40px_rgba(16,185,129,0.8)] scale-125 translate-x-2' 
                      : isCompleted ? 'bg-white border-emerald-500 text-emerald-500 shadow-lg' 
                      : 'bg-white border-slate-200 text-slate-300 hover:border-emerald-200'}`}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                    </div>
                    <div className={`transition-all duration-500 ${isActive ? 'translate-x-4 opacity-100' : 'opacity-40'}`}>
                       <span className={`text-[10px] font-black uppercase tracking-[0.3em] block mb-1 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                          PHASE_0{step.id + 1}
                       </span>
                       <h4 className={`text-xl font-black tracking-tighter ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                       </h4>
                       {isActive && (
                         <p className="text-[11px] font-semibold text-slate-500 mt-2 max-w-[180px] italic leading-tight animate-in fade-in slide-in-from-top-1">
                            {step.desc}
                         </p>
                       )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes typing { from { width: 0 } to { width: 100% } }
      `}</style>
    </section>
  );
};

export default PipelineSimulation;