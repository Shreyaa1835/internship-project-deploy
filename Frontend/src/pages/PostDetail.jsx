import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { 
  ArrowLeft, Home, Command, FileText, Settings, 
  Sparkles, Activity, Zap, Edit3, BookOpen 
} from "lucide-react";
import BlogPostView from "../components/BlogPostView";
import ContentEditor from "../components/ContentEditor";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        
        const res = await fetch(`http://localhost:8000/api/blog-posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Post_Not_Found");
          if (res.status === 401) throw new Error("Unauthorized_Access");
          throw new Error("Neural_Sync_Failure");
        }

        const data = await res.json();
        setPost(data);
        setEditedContent(data.content); 
      } catch (err) { 
        console.error("Sync Error:", err);
        setError(err.message);
      }
    };
    fetchPost();
  }, [id]);

  // ERROR UI: Displays if post is missing or unauthorized
  if (error) return (
    <div className="min-h-screen bg-[#F4F9F7] flex flex-col items-center justify-center font-sans p-10">
      <div className="bg-white border-[3px] border-red-400 rounded-[3rem] p-16 shadow-2xl text-center max-w-2xl">
        <h2 className="text-4xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">
          {error.replace(/_/g, ' ')}
        </h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8">
          The requested neural data could not be retrieved from the manuscript vault.
        </p>
        <button 
          onClick={() => navigate("/dashboard")}
          className="bg-red-500 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-lg hover:bg-red-600 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  // LOADING UI: Shown while fetching post data
  if (!post) return (
    <div className="min-h-screen bg-[#F4F9F7] flex items-center justify-center font-black text-emerald-800 uppercase tracking-[0.8em] animate-pulse">
      Neural_Sync_Active
    </div>
  );

  return (
    <div className="h-screen w-full flex p-4 lg:p-8 font-sans relative overflow-hidden bg-[#f0f4f3]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-300/40 rounded-full blur-[120px] animate-pulse pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-200/40 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 1. FIXED SIDEBAR */}
      <aside className="w-20 hidden xl:flex flex-col items-center py-10 gap-10 bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] shadow-xl z-20 h-fit sticky top-8">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-lg border border-emerald-50">
          <Command size={24} />
        </div>
        <div className="flex flex-col gap-8 flex-grow">
          <Home size={22} className="text-slate-400 hover:text-emerald-500 cursor-pointer transition-all" onClick={() => navigate("/dashboard")} />
          <FileText size={22} className="text-emerald-600" />
          <Activity size={22} className="text-slate-400 hover:text-emerald-500 cursor-pointer" />
        </div>
        <Settings size={22} className="text-slate-400" />
      </aside>

      {/* 2. MAIN STAGE */}
      <main className="flex-grow ml-0 xl:ml-8 flex flex-col gap-6 relative z-10 h-full">
        
        {/* HEADER WITH EDIT TOGGLE */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 bg-white/70 backdrop-blur-lg border border-white rounded-[2.5rem] shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => navigate("/dashboard")} 
            className="
              relative overflow-hidden
              bg-emerald-600 hover:bg-emerald-500 
              text-white px-10 py-4 rounded-[1.8rem] 
              font-black text-[11px] uppercase tracking-[0.4em] 
              transition-all duration-300
              shadow-[0_0_25px_rgba(16,185,129,0.4),0_15px_35px_-5px_rgba(5,150,105,0.4)] 
              border border-emerald-400/50
              hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]
              active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft size={16} color="white" strokeWidth={3} /> 
              Dashboard
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
          </button>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-3 bg-white border-2 border-emerald-500 text-emerald-600 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-50 transition-all active:scale-95"
            >
              {isEditing ? <><BookOpen size={16} /> Read Mode</> : <><Edit3 size={16} /> Edit Mode</>}
            </button>

            <button className="bg-emerald-600 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2">
              <Zap size={14} className="fill-white" /> Commit Masterpiece
            </button>
          </div>
        </div>

        {/* MAIN CANVAS */}
        <div className="
          min-h-[85vh] 
          flex-grow 
          overflow-y-auto 
          pr-2 
          custom-scrollbar 
          bg-white/95 
          backdrop-blur-3xl 
          border-[3px] border-emerald-400/10 
          rounded-[5rem] 
          relative 
          transition-all duration-700 ease-out
          
          /* BASE SHADOW: Deep lift + Subtle emerald aura */
          shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15),0_0_40px_rgba(16,185,129,0.08)]
          
          /* HOVER EFFECT: Lift up and expand the emerald glow */
          hover:-translate-y-2
          hover:shadow-[0_60px_130px_-30px_rgba(0,0,0,0.2),0_0_60px_rgba(16,185,129,0.25)]
          hover:border-emerald-400/30
        ">
          <div className="p-10 lg:p-20 min-h-full">
            {isEditing ? (
              <ContentEditor content={editedContent} setContent={setEditedContent} />
            ) : (
              <BlogPostView post={{...post, content: editedContent}} />
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98133; border-radius: 10px; }
      `}} />
    </div>
  );
}