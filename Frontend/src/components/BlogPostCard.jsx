// src/components/BlogPostCard.jsx

export default function BlogPostCard({ post }) {
  const isDraft = post.status === 'Drafting';
  const isError = post.status.includes('Error');

  // DYNAMIC IMAGE LOGIC
  // We use the post ID to ensure each card gets a different professional image
  // Keywords are strictly filtered for tech/workspace to avoid sensitive results
  const keywords = ["technology", "minimal", "workspace", "abstract", "code", "laptop"];
  const selectedKeyword = keywords[post.id % keywords.length];
  const uniqueImageUrl = `https://loremflickr.com/400/250/${selectedKeyword}?lock=${post.id}`;

  return (
    <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-br from-emerald-400/40 via-transparent to-teal-400/40 shadow-lg transition-all duration-500 hover:shadow-emerald-200/50 hover:-translate-y-2 group h-full">
      <div className="bg-white p-6 rounded-[2.45rem] h-full flex flex-col justify-between relative overflow-hidden">
        
        <div className="relative z-10">
          {/* Header Badge */}
          <div className="flex justify-between items-start mb-4">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-4 py-2 rounded-xl font-bold text-[10px] tracking-widest uppercase shadow-md shadow-emerald-100">
              {post.title}
            </div>
          </div>

          {/* DYNAMIC THUMBNAIL PREVIEW */}
          <div className="relative w-full h-44 mb-6 rounded-2xl overflow-hidden border border-slate-100 group-hover:shadow-md transition-shadow duration-300 bg-slate-50">
            <img 
              src={uniqueImageUrl} 
              alt={post.title}
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
              key={post.id}
            />
            
            {/* Error Overlay */}
            {isError && (
              <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white/90 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
                  Action Required
                </span>
              </div>
            )}
          </div>

          {/* Status & Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ring-4 ${
                isError ? 'bg-red-500 ring-red-50' : 
                isDraft ? 'bg-amber-400 ring-amber-50' : 
                'bg-[#2ecc91] ring-emerald-50'
              } ${!isError && 'animate-pulse'}`} />
              <p className={`text-[10px] font-black tracking-[0.2em] uppercase ${isError ? 'text-red-500' : 'text-slate-500'}`}>
                {post.status}
              </p>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
              {isDraft 
                ? "AI is currently researching and outlining the best points for this topic..." 
                : "Your blog post has been successfully generated and is ready for review."}
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {post.date || "Just now"}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-10 flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
          <div className="flex gap-3">
            <button className="text-slate-300 hover:text-[#2ecc91] transition-colors p-2 hover:bg-emerald-50 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </button>
            <button className="text-slate-300 hover:text-red-400 transition-colors p-2 hover:bg-red-50 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>

          <button className="bg-[#111827] text-white px-8 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all shadow-lg hover:bg-[#2ecc91] active:scale-95">
            View
          </button>
        </div>
      </div>
    </div>
  );
}