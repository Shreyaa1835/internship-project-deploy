import React, { useEffect, useState } from "react";

export default function BlogPostCard({ post: initialPost }) {
  // Local state allows the card to update "live" when polling detects a change
  const [post, setPost] = useState(initialPost);
  
  const isWriting = post.status === 'WRITING';
  const isPublished = post.status === 'Published';
  const isError = post.status === 'ERROR';

  // --- LIVE POLLING LOGIC ---
  useEffect(() => {
    let interval;

    // Only start polling if the status is currently 'WRITING'
    if (isWriting) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/blog-posts/${post.id}`);
          if (response.ok) {
            const updatedPost = await response.json();
            
            // Sync the card UI with the backend database
            setPost(updatedPost);

            // Stop polling immediately once the status is no longer 'WRITING'
            if (updatedPost.status !== 'WRITING') {
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 3000); // Check every 3 seconds
    }

    return () => clearInterval(interval);
  }, [isWriting, post.id]);

  // Dynamic Image Logic
  const uniqueImageUrl = `https://loremflickr.com/400/250/technology,minimal?lock=${post.id}`;

  return (
    <div className="group relative h-full">
      {/* GLOW AURA: Intensifies on hover */}
      <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-10 transition duration-500"></div>
      
      {/* MAIN GLASS CONTAINER */}
      <div className="relative bg-white/60 backdrop-blur-2xl p-6 rounded-[2.8rem] border border-white/60 shadow-xl flex flex-col h-full transition-all duration-500 group-hover:translate-y-[-8px]">
        
        {/* IMAGE SECTION */}
        <div className="relative h-44 mb-6 rounded-[2rem] overflow-hidden border border-white/40 shadow-inner bg-slate-50">
          <img 
            src={uniqueImageUrl} 
            alt={post.topic} 
            className={`w-full h-full object-cover transition-all duration-700 ${isWriting ? 'blur-[2px] opacity-60' : 'group-hover:scale-110'}`} 
          />
          
          {/* Status Badge Over Image */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${
              isWriting ? 'bg-blue-500 animate-ping' : 
              isError ? 'bg-red-500' : 'bg-emerald-500'
            }`} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">
              {isWriting ? "Writing..." : post.status}
            </span>
          </div>
        </div>

        {/* PROGRESS BAR: Only visible during active background generation */}
        {isWriting && (
          <div className="w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-blue-500 animate-pulse w-3/4 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
        )}

        {/* CONTENT AREA */}
        <div className="space-y-3 flex-grow">
          <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
            {post.topic || "Untitled Post"} 
          </h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed opacity-80 line-clamp-2">
            {isWriting 
              ? "AI is currently expanding your approved outline into a full-length masterpiece..." 
              : "Professional content drafting optimized for engagement and reach."}
          </p>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {post.date || "Just now"}
          </span>
          
          <button 
            disabled={isWriting}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
              isWriting 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : isPublished 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200/50 hover:-translate-y-0.5" 
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200/50 hover:-translate-y-0.5"
            }`}
          >
            {isWriting ? "Processing" : isPublished ? "Read Post" : "Edit Post"}
          </button>
        </div>
      </div>
    </div>
  );
}