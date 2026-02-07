import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-12 px-12">
      <div className="flex flex-wrap justify-between items-center gap-8">
        <div className="flex gap-8 font-medium">
          <a href="#" className="hover:text-emerald-400 transition">About</a>
          <a href="#" className="hover:text-emerald-400 transition">Services</a>
          <a href="#" className="hover:text-emerald-400 transition text-emerald-500">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-400 transition">Terms of Service</a>
        </div>
        <div className="text-sm text-emerald-500/80">
          © 2026 BlogGenAI rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;