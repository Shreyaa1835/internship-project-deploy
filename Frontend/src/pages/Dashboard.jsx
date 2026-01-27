// src/pages/Dashboard.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar"; 
import Navbar from "../components/Navbar";
import BlogPostList from "../components/BlogPostList";
import SearchBar from "../components/SearchBar";
import CreateButton from "../components/CreateButton";
import AnalyticsCard from "../components/AnalyticsCard";
import Footer from "../components/Footer";
import { Menu } from "lucide-react"; 

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [activeFilter, setActiveFilter] = useState("All");
  
  const allPosts = [
    { id: 1, title: "AI Blog Post 1", status: "Drafting", date: "5 min ago" },
    { id: 2, title: "AI Blog Post 2", status: "Published", date: "Jan 25, 2026" },
    { id: 3, title: "AI Blog Post 3", status: "Error - See details", date: "" },
    { id: 4, title: "AI Blog Post 4", status: "Scheduled", date: "Jan 27, 2026" },
  ];

  const filteredPosts = allPosts.filter(post => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Drafts") return post.status === "Drafting";
    return post.status === activeFilter;
  });

  const userEmail = localStorage.getItem("userEmail") || "guest@example.com"; 
  const userName = userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] relative flex flex-col">
      {/* Sidebar Controlled via props */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* --- SCROLLABLE HEADER --- */}
      {/* CHANGE: Changed 'sticky top-0' to 'relative' so it scrolls away with the content.
          Everything else (z-index, bg, padding, flex alignment) remains identical.
      */}
      <header className="relative z-[100] bg-white border-b border-slate-100 px-6 py-4 flex items-center shadow-sm">
        
        {/* Left Side: 3-Bar Menu Trigger */}
        <div className="flex-none pr-8 border-r border-slate-100">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-all hover:text-[#2ecc91] active:scale-95 shadow-sm"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Center: Branding Title */}
        <div className="flex-1 pl-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2ecc91] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm uppercase">A</span>
          </div>
          <span className="text-slate-800 font-black tracking-tight text-lg uppercase">
            AI Blog Post <span className="text-[#2ecc91]">Generator</span>
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12">
        {/* Greeting Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{userName}!</span>
            </h1>
            <p className="text-slate-500 font-medium">Your creative AI workspace is ready.</p>
          </div>
          <CreateButton />
        </div>

        {/* Search & Filter Bar Section */}
        <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] border border-slate-100/50 mb-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="w-full lg:max-w-md">
            <SearchBar />
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            {["All", "Drafts", "Published", "Scheduled"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeFilter === f 
                    ? "bg-white text-[#2ecc91] shadow-md scale-105" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="flex flex-col xl:flex-row gap-10 items-stretch">
          {/* Left: Blog Post Cards */}
          <div className="flex-1">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-1 bg-slate-100"></div>
             </div>
             <BlogPostList posts={filteredPosts} />
          </div>

          {/* Right: Analytics Sidebar */}
          <aside className="w-full xl:w-[380px]">
            <AnalyticsCard />
          </aside>
        </div>
      </main>
      <Footer/>
    </div>
  );
}