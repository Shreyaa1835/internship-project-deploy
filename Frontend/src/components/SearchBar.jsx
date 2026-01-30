export default function SearchBar() {
  return (
    <div className="relative group w-full">
      <span className="absolute inset-y-0 left-5 flex items-center text-slate-500 z-10 pointer-events-none group-focus-within:text-emerald-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </span>
      
      <input
        type="text"
        placeholder="Search blog posts..."
        className="
          w-full pl-14 pr-6 py-4 
          /* DARK TINT INNER: This is key for contrast against a bright outer bar */
          bg-slate-900/5 
          backdrop-blur-xl
          border border-slate-200/50
          rounded-2xl 
          /* DEEP INNER SHADOW: Forces the depth effect */
          shadow-[inset_0_4px_8px_rgba(0,0,0,0.08)] 
          /* FOCUS: Switches to a clean bright white when active */
          focus:bg-white 
          focus:ring-4 
          focus:ring-emerald-500/15 
          focus:border-emerald-500/40
          focus:shadow-none
          outline-none 
          transition-all 
          placeholder:text-slate-400 
          font-bold 
          text-slate-700
        "
      />
    </div>
  );
}