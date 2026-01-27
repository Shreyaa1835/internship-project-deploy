// src/pages/CreatePost.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, Hash, Layout } from "lucide-react"; 

export default function CreatePost() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please provide a topic for the AI to research.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // **Console log to verify submission**
      console.log("Form submitted!", { topic, keywords });

      // Simulated delay for generating post
      await new Promise((res) => setTimeout(res, 2000));

      // Redirect after simulation
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to generate post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-300/60 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-200/70 rounded-full blur-[120px]" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-200/50 rounded-full blur-[100px]" />

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

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-6 text-left lg:pr-10">
          <div className="w-16 h-16 bg-white border border-emerald-100 rounded-2xl flex items-center justify-center text-[#2ecc91] shadow-md">
            <Sparkles size={32} />
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-tight">
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Masterpieces</span> with AI.
          </h1>
          <p className="text-slate-600 text-lg font-medium leading-relaxed">
            Transform your ideas into professionally written blog posts instantly using our advanced AI workspace.
          </p>
        </div>

        {/* RIGHT CONTENT: Frosted Glass Form */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-[3rem] blur opacity-20 group-hover:opacity-35 transition duration-1000"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-white p-8 lg:p-10 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* TOPIC INPUT */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Layout size={14} className="text-slate-700" />
                  Primary Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., The Ethics of AI"
                  className="w-full px-6 py-4 bg-white border border-emerald-200 rounded-2xl outline-none transition-all duration-300 text-slate-700 font-bold placeholder:text-slate-300
                    ring-4 ring-emerald-400/10 shadow-[0_0_20px_rgba(46,204,145,0.15)]
                    focus:border-emerald-400 focus:ring-emerald-400/20 focus:shadow-[0_0_25px_rgba(46,204,145,0.25)]"
                />
              </div>

              {/* KEYWORDS INPUT */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                  <Hash size={14} className="text-slate-700" />
                  Search Keywords
                </label>
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Ethics, AI Governance..."
                  rows="3"
                  className="w-full px-6 py-4 bg-white border border-emerald-200 rounded-2xl outline-none transition-all duration-300 text-slate-700 font-bold placeholder:text-slate-300 resize-none
                    ring-4 ring-emerald-400/10 shadow-[0_0_20px_rgba(46,204,145,0.15)]
                    focus:border-emerald-400 focus:ring-emerald-400/20 focus:shadow-[0_0_25px_rgba(46,204,145,0.25)]"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-white shadow-xl transition-all active:scale-[0.98] ${
                  loading 
                    ? "bg-slate-300 cursor-not-allowed text-slate-500" 
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 shadow-emerald-200/50"
                }`}
              >
                {loading ? "Generating..." : "Generate Post"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
