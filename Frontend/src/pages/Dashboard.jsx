import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth"; 
import Sidebar from "../components/Sidebar"; 
import BlogPostList from "../components/BlogPostList";
import SearchBar from "../components/SearchBar";
import CreateButton from "../components/CreateButton";
import AnalyticsCard from "../components/AnalyticsCard";
import Footer from "../components/Footer";
import { Menu, Sparkles } from "lucide-react"; 

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const auth = getAuth();
  const user = auth.currentUser;
  const userName = user?.email?.split('@')[0] || "User";

  // --- FETCH LOGIC: Firebase Token Integration ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        if (!user) throw new Error("No authenticated user found");

        // Requirement: Include Firebase auth token in request headers
        const token = await user.getIdToken();

        const response = await fetch(`http://localhost:8000/api/blog-posts`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Secure Token-based Auth
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch posts from server");
        const data = await response.json();
        
        // Sorting by ID or date descending (latest first)
        const sortedData = data.sort((a, b) => b.id - a.id);
        setPosts(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPosts();
  }, [user]);

  // --- SLICING & FILTERING LOGIC ---
  // Requirement: Main feed shows only the last 4 posts
  const recentPostsSlice = posts.slice(0, 4);

  const filteredRecentPosts = recentPostsSlice.filter(post => {
    if (activeFilter === "All") return true;
    // Requirement: Drafts captures work-in-progress states
    if (activeFilter === "Drafts") {
      return ["Drafting", "WRITING", "OUTLINE_READY", "RESEARCHING", "Draft"].includes(post.status);
    }
    // Requirement: Published only shows final "Published" status
    if (activeFilter === "Published") {
      return post.status === "Published";
    }
    return post.status === activeFilter;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-300/40 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-200/40 rounded-full blur-[120px] pointer-events-none" />

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <header className="relative z-[100] bg-white/30 backdrop-blur-md border-b border-white/40 px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white/80 hover:bg-emerald-50 rounded-2xl text-slate-600 transition-all active:scale-95 shadow-sm border border-white"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                <Sparkles className="text-white" size={20} />
             </div>
             <span className="text-slate-800 font-black tracking-tight text-xl uppercase">
                AI <span className="text-emerald-600">Generator</span>
             </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex-grow">
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-3">
            <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
               Workspace Active
            </p>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none capitalize">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{userName}!</span>
            </h1>
          </div>
          <CreateButton />
        </div>

        {/* --- SEARCH & FILTER SECTION --- */}
        <div className="relative mb-14 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-100/30 to-teal-100/30 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row gap-6 items-center justify-between p-4 lg:p-5 bg-white/95 backdrop-blur-3xl rounded-[2.8rem] border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
            <div className="w-full lg:max-w-md transition-transform duration-300 focus-within:scale-[1.02]">
              <SearchBar />
            </div>

            {/* RECESSED FILTER WELL UI */}
            <div className="flex items-center bg-slate-900/5 backdrop-blur-md p-1.5 rounded-[1.8rem] border border-slate-200/50 shadow-[inset_0_4px_8px_rgba(0,0,0,0.06)]">
              {["All", "Drafts", "Published", "Scheduled"].map((f) => {
                const isActive = activeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`relative px-7 py-2.5 rounded-2xl text-[13px] font-black tracking-wide uppercase transition-all duration-500 ${
                      isActive 
                        ? "text-emerald-700 bg-white shadow-sm scale-100 opacity-100" 
                        : "text-slate-500 hover:text-slate-900 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          <div className="xl:col-span-8">
              
              {loading ? (
                <div className="p-20 text-center text-slate-400 animate-pulse font-bold">Fetching masterpieces...</div>
              ) : error ? (
                <div className="p-20 text-center text-red-400 font-bold">Error: {error}</div>
              ) : filteredRecentPosts.length === 0 ? (
                <div className="p-20 text-center text-slate-400 font-bold">Empty State: No posts found.</div>
              ) : (
                <BlogPostList posts={filteredRecentPosts} />
              )}
          </div>

          {/* ASIDE: Analytics + Full Directory */}
          <aside className="xl:col-span-4 space-y-8 sticky top-8">
              <AnalyticsCard posts={posts} />
              
              
          </aside>
        </div>
      </main>
      <Footer/>
    </div>
  );
}