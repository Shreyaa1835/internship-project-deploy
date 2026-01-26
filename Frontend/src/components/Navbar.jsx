import React from 'react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100 px-8 py-4 flex justify-between items-center transition-all">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <span className="text-emerald-600 font-bold text-2xl tracking-tight hover:text-emerald-500 transition-colors">
          AI Blog Post Generator
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 font-medium">
  
  <a
    href="#"
    className="
      bg-white hover:bg-gray-100 text-emerald-600 px-4 py-2 rounded-lg font-semibold text-sm border border-emerald-200 shadow-md transition-all transform hover:-translate-y-0.5
    "
  >
    Login
  </a>

  
  <a
    href="#"
    className="
      bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md shadow-emerald-200 transition-all transform hover:-translate-y-0.5
    "
  >
    Signup
  </a>
</div>

    </nav>
  );
};

export default Navbar;
