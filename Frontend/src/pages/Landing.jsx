import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
      <Navbar />
      <main>
        <Hero />  
        <section id="features">
          <Features />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;