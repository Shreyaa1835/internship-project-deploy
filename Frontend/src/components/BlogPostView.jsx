import { Calendar, Clock, Zap, BrainCircuit, Quote } from "lucide-react";

export default function BlogPostView({ post }) {
  const outline = typeof post?.outline === "string" 
    ? JSON.parse(post.outline) 
    : post?.outline || { sections: [] };

  const formatDate = (postData) => {
    const rawDate = postData?.created_at || postData?.createdAt || postData?.date;
    
    if (!rawDate) {
      return new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).toUpperCase();
    }

    try {
      const date = new Date(rawDate);
      if (isNaN(date.getTime())) throw new Error("Invalid");

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).toUpperCase();
    } catch (e) {
      return "JAN 31, 2026"; 
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      <div className="lg:col-span-7 space-y-16 text-left">
        <header className="space-y-10">
          
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1.1] italic">
            {post?.topic}
          </h1>

          <div className="flex flex-wrap items-center gap-10 text-[12px] font-bold text-slate-400 uppercase tracking-[0.4em] pl-8 border-l-[4px] border-emerald-500">
            <span className="flex items-center gap-3 font-black">
              <Calendar size={20} className="text-emerald-600"/> 
              {formatDate(post)}
            </span>
            <span className="flex items-center gap-3 font-black">
              <Clock size={20} className="text-emerald-600"/> 15 Min Read
            </span>
            <span className="bg-slate-900 text-emerald-400 px-7 py-2 rounded-full border border-emerald-500/30 text-[10px] uppercase">
              {post?.status || 'Published'}
            </span>
          </div>
        </header>

        <article className="prose prose-slate prose-xl max-w-none">
          <div className="text-slate-800 leading-[1.8] text-2xl font-medium whitespace-pre-wrap first-letter:text-8xl first-letter:font-black first-letter:text-emerald-600 first-letter:mr-5 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-2">
            {post?.content}
          </div>
        </article>
      </div>

      <aside className="lg:col-span-5 relative">
        <div className="sticky top-10 space-y-10 h-fit">
          
          <div className="
            bg-white/98             
            border-2 
            border-emerald-400/40   
            rounded-[4.5rem] 
            p-12 
            backdrop-blur-2xl
            relative
            shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1),0_0_50px_rgba(16,185,129,0.1)]
            before:absolute before:inset-0 before:rounded-[4.5rem] before:shadow-[inset_0_0_40px_white] before:pointer-events-none
          ">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.6em] flex items-center gap-5">
                <BrainCircuit size={28} className="text-emerald-600" /> Outline
              </h3>
              <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_20px_#34d399]" />
            </div>
            
            <div className="space-y-12 relative">
              <div className="absolute left-[11px] top-8 bottom-8 w-[2px] bg-emerald-200/50" />
              
              {outline?.sections?.map((section, idx) => (
                <div key={idx} className="relative pl-14 group cursor-pointer transition-all">
                  <div className="absolute left-0 top-1.5 w-6 h-6 bg-white border-[5px] border-emerald-500 rounded-full z-10 group-hover:scale-125 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                  
                  <h4 className="text-[11px] font-black text-emerald-500 uppercase mb-2 tracking-[0.3em]">Node_0{idx + 1}</h4>
                  <p className="text-xl font-black text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
                    {section.heading}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}