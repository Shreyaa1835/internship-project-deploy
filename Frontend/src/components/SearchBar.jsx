export default function SearchBar() {
  return (
    <div className="relative group w-full">
      {/* Icon with subtle color transition */}
      <span className="absolute inset-y-0 left-5 flex items-center text-slate-400 pointer-events-none group-focus-within:text-[#2ecc91] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </span>
      
      <input
        type="text"
        placeholder="Search blog posts..."
        /* - border-2: Sets the width
           - border-[#2ecc91]: Sets the permanent color
           - focus:ring-4: Adds the soft glow only on click
        */
        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-[#2ecc91] rounded-2xl shadow-sm focus:ring-4 focus:ring-[#2ecc91]/10 focus:shadow-lg focus:shadow-emerald-50 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
      />
    </div>
  );
}