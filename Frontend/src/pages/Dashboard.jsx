import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth"; 
import Sidebar from "../components/Sidebar"; 
import BlogPostList from "../components/BlogPostList";
import SearchBar from "../components/SearchBar";
import CreateButton from "../components/CreateButton";
import AnalyticsCard from "../components/AnalyticsCard";
import Footer from "../components/Footer";
import SchedulingTimeline from "../components/SchedulingTimeline"; 
import { Menu, Sparkles, FileText } from "lucide-react"; 

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [activeFilter, setActiveFilter] = useState("All");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [sidePanel, setSidePanel] = useState("analytics"); 

  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, [auth]);

  const userName = user?.email?.split('@')[0] || "User";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        if (!user) return; 

        const token = await user.getIdToken();
        const response = await fetch(`https://blog-post-backend-aqmp.onrender.com/api/blog-posts`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data.sort((a, b) => b.id - a.id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPosts();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (!searchQuery.trim()) {
      setSearchResults([]); 
      setIsSearching(false);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      try {
        const token = await user.getIdToken(); 
        const response = await fetch(
          `https://blog-post-backend-aqmp.onrender.com/api/blog-posts/search?query=${encodeURIComponent(searchQuery.trim())}`, 
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail?.[0]?.msg || errorData.detail || "Search failed");
        }
        
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search error:", err.message);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, user]);

  const scheduledTimelineData = posts
    .filter(post => post.status === "Scheduled")
    .sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate))
    .map(post => {
      const diffTime = new Date(post.publishDate) - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        ...post,
        remainingDays: diffDays > 0 ? `${diffDays} days` : "Today"
      };
    });

  const displayPosts = searchQuery.trim() ? searchResults : posts;

  const filteredPosts = displayPosts.filter(post => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Draft") {
      return ["Drafting", "WRITING", "OUTLINE_READY", "RESEARCHING", "Draft"].includes(post.status);
    }
    return post.status === (activeFilter === "Published" ? "Published" : activeFilter);
  });
  const filteredRecentPosts = filteredPosts.slice(0, 4);


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-300/40 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-200/40 rounded-full blur-[120px] pointer-events-none" />

      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        setSidePanel={setSidePanel} 
      />
      
      <header className="relative z-[100] bg-white/30 backdrop-blur-md border-b border-white/40 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white/80 hover:bg-emerald-50 rounded-2xl text-slate-600 transition-all active:scale-95 shadow-sm border border-white">
            <Menu size={22} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full"></div>
              <div className="relative w-full h-full bg-white border border-emerald-100 rounded-xl flex items-center justify-center text-[#2ecc91] shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="relative scale-75">
                  <FileText size={38} strokeWidth={1.5} className="text-emerald-600/80" />
                  <div className="absolute -bottom-1 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    <div className="w-1 h-3 bg-white rounded-full transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <span className="text-slate-800 font-black tracking-tight text-xl ">
             <span className="bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-400 bg-clip-text text-transparent"> BlogGenAI</span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-3">
            <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Workspace Active
            </p>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none capitalize">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{userName}!</span>
            </h1>
          </div>
          <CreateButton />
        </div>

        <div className="relative mb-14 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-100/30 to-teal-100/30 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row gap-6 items-center justify-between p-4 lg:p-5 bg-white/95 backdrop-blur-3xl rounded-[2.8rem] border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
            <div className="w-full lg:max-w-md transition-transform duration-300 focus-within:scale-[1.02]">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="flex items-center bg-slate-900/5 backdrop-blur-md p-1.5 rounded-[1.8rem] border border-slate-200/50 shadow-[inset_0_4px_8px_rgba(0,0,0,0.06)]">
              {["All", "Draft", "Published", "Scheduled"].map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`relative px-7 py-2.5 rounded-2xl text-[13px] font-black tracking-wide uppercase transition-all duration-500 ${activeFilter === f ? "text-emerald-700 bg-white shadow-sm" : "text-slate-500 hover:text-slate-900 opacity-70 hover:opacity-100"}`}>
                  {activeFilter === f && <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          <div className="xl:col-span-8">
              {loading && !isSearching ? (
                <div className="p-20 text-center text-slate-400 animate-pulse font-bold">Fetching masterpieces...</div>
              ) : error ? (
                <div className="p-20 text-center text-red-400 font-bold">Error: {error}</div>
              ) : filteredRecentPosts.length === 0 ? (
                <div className="p-20 text-center bg-white/50 rounded-[3rem] border border-dashed border-slate-200 shadow-sm transition-all">
                    <p className="text-slate-400 font-bold mb-4">{isSearching ? `Searching for "${searchQuery}"...` : "No posts found matching your filter."}</p>
                    {searchQuery && <button onClick={() => setSearchQuery("")} className="text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:text-emerald-500 transition-colors">Clear Search</button>}
                </div>
              ) : (
                <BlogPostList posts={filteredRecentPosts} />
              )}
          </div>

          
          <aside className="xl:col-span-4 space-y-8 sticky top-8 h-[calc(100vh-120px)]">
            {sidePanel === "analytics" ? (
                <AnalyticsCard posts={posts} />
            ) : (
                <SchedulingTimeline 
                    data={scheduledTimelineData} 
                    onBack={() => setSidePanel("analytics")}
                />
            )}
          </aside>
        </div>
      </main>
      <Footer/>
    </div>
  );
}