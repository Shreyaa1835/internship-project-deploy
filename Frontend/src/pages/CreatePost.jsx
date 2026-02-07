import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; 
import { Sparkles, ArrowLeft, Hash, Layout, FileText } from "lucide-react"; 
import OutlineView from "../components/OutlineView";

export default function CreatePost() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [status, setStatus] = useState("idle"); 
  const [postId, setPostId] = useState(null);
  const [outline, setOutline] = useState(null);
  
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    let interval;
    if (status === "researching" && postId && user) {
      interval = setInterval(async () => {
        try {
          const token = await user.getIdToken();
          
          const response = await fetch(`http://localhost:8000/api/blog-posts/${postId}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}` 
            }
          });
          
          if (response.status === 404) return; 
          if (!response.ok) throw new Error("Server communication error");
          
          const data = await response.json();
          
          if (data.status === "OUTLINE_READY") {
            try {
              let rawOutline = data.outline;
              if (typeof rawOutline === "string") {
                rawOutline = rawOutline.replace(/```json|```/g, "").trim();
              }

              const parsedOutline = typeof rawOutline === "string" 
                ? JSON.parse(rawOutline) 
                : rawOutline;
                
              setOutline(parsedOutline);
              setStatus("ready");
              setLoading(false);
              clearInterval(interval);
            } catch (parseErr) {
              console.error("JSON Parse Error:", parseErr);
              setError("The AI generated an invalid format. Trying again...");
            }
          }

          if (data.status === "ERROR") {
            setError("AI Research failed (Quota or Connection issue).");
            setLoading(false);
            setStatus("idle");
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000); 
    }
    return () => clearInterval(interval);
  }, [status, postId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please provide a topic for the AI to research.");
      return;
    }

    if (!user) {
      setError("You must be logged in to generate posts.");
      return;
    }

    setError("");
    setLoading(true);
    setStatus("researching"); 

    try {
      const token = await user.getIdToken();

      const response = await fetch("http://localhost:8000/api/blog-posts", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          topic, 
          keywords
        }),
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(errorDetail.detail || "Failed to start research");
      }

      const data = await response.json();
      setPostId(data.postId); 

    } catch (err) {
      setError(err.message);
      setLoading(false);
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] relative overflow-hidden flex flex-col items-center justify-center p-6 text-capitalize">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-300/60 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-200/70 rounded-full blur-[120px]" />

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-[50]">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 transition-colors font-bold text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <div className={`grid lg:grid-cols-2 gap-12 items-start w-full transition-all duration-700`}>
          
          {/* LEFT CONTENT */}
          <div className="space-y-6 text-left lg:pr-10 lg:pt-10">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full"></div>
              <div className="relative w-full h-full bg-white border border-emerald-100 rounded-[1.5rem] flex items-center justify-center text-[#2ecc91] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="relative">
                  <FileText size={38} strokeWidth={1.5} className="text-emerald-600/80" />
                  <Sparkles size={18} className="absolute -top-2.5 -right-2.5 text-emerald-400 fill-emerald-400 animate-pulse" />
                  <div className="absolute -bottom-1 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    <div className="w-1 h-3 bg-white rounded-full transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-tight">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Masterpieces</span> with AI.
            </h1>
            <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-md">
              Transform your ideas into professionally written blog posts instantly using our advanced AI workspace.
            </p>
          </div>

          {/* RIGHT CONTENT: Form Card Area */}
          <div className="relative group w-full min-h-[500px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-[3rem] blur opacity-20 group-hover:opacity-35 transition duration-1000"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl border border-white p-8 lg:p-10 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden h-full">
              
              {/* RESEARCHING OVERLAY */}
              {status === "researching" && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[3rem]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                  <p className="font-black text-emerald-600 uppercase tracking-widest text-sm text-center px-6">
                    AI is researching and structuring your outline...
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                    <Layout size={14} className="text-emerald-600" />
                    Primary Topic
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The Ethics of AI"
                    className="w-full px-6 py-4 bg-white border border-emerald-200 rounded-2xl outline-none transition-all duration-300 text-slate-700 font-bold placeholder:text-slate-300 ring-4 ring-emerald-400/10 shadow-[0_0_20px_rgba(46,204,145,0.15)] focus:border-emerald-400 focus:ring-emerald-400/20"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                    <Hash size={14} className="text-emerald-600" />
                    Search Keywords
                  </label>
                  <textarea
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Ethics, AI Governance..."
                    rows="3"
                    className="w-full px-6 py-4 bg-white border border-emerald-200 rounded-2xl outline-none transition-all duration-300 text-slate-700 font-bold placeholder:text-slate-300 resize-none ring-4 ring-emerald-400/10 shadow-[0_0_20px_rgba(46,204,145,0.15)] focus:border-emerald-400 focus:ring-emerald-400/20"
                  />
                </div>

                {error && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-xs font-bold">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-white shadow-xl transition-all ${
                    loading ? "bg-slate-300 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105"
                  }`}
                >
                  {loading ? "Creating..." : "Generate Outline"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {status === "ready" && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-transparent" 
              onClick={() => setStatus("idle")} 
            />
            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 pointer-events-none">
              <div className="invisible" /> 
              <div className="pointer-events-auto h-full min-h-[500px]">
                <OutlineView 
                  outline={outline} 
                  postId={postId} 
                  onCancel={() => setStatus("idle")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}