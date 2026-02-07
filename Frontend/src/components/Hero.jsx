import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const lines = [
    "Introducing AI-powered content creation...",
    "Generating blog ideas and outlines...",
    "Writing high-quality paragraphs automatically...",
    "Refining tone, grammar, and style in real-time..."
  ];

  const [typedLines, setTypedLines] = useState(new Array(lines.length).fill(""));
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const scrollToFeatures = () => {
    const featureSection = document.getElementById("features");
    if (featureSection) {
      featureSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const typingSpeed = 50;
    const delayBetweenLines = 800;

    const typeInterval = setInterval(() => {
      const currentLineText = lines[currentLineIndex];
      if (!currentLineText) return;

      if (currentCharIndex < currentLineText.length) {
        setTypedLines((prev) => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLineText.slice(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          if (currentLineIndex === lines.length - 1) {
            setTypedLines(new Array(lines.length).fill(""));
            setCurrentLineIndex(0);
            setCurrentCharIndex(0);
          } else {
            setCurrentLineIndex((prev) => prev + 1);
            setCurrentCharIndex(0);
          }
        }, delayBetweenLines);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [currentCharIndex, currentLineIndex]);

  return (
    <section className="relative px-12 pt-24 pb-64 min-h-[95vh] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white overflow-hidden">
      
      <div className="relative z-10 space-y-6">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>

        <div className="relative z-20">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-500 leading-snug lg:leading-snug mb-8 animate-fadeIn">
            AI Blog Post Generator
          </h1>

          <p className="text-lg text-gray-700 max-w-md animate-fadeIn delay-200">
            Automate your content creation with intelligent AI. Generate structured, high-quality blog posts in seconds.
          </p>

          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => navigate("/signup")}
              className="bg-emerald-700 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-300 transition-all transform hover:-translate-y-1 animate-fadeIn delay-400"
            >
              Start Writing for Free
            </button>
            <button 
              onClick={scrollToFeatures}
              className="bg-white hover:bg-gray-50 text-emerald-700 px-6 py-4 rounded-xl font-semibold text-lg border border-emerald-400 shadow-md transition-all transform hover:-translate-y-1 animate-fadeIn delay-500"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="bg-white rounded-3xl border border-emerald-400 shadow-[0_0_80px_15px_rgba(16,185,129,0.2)] overflow-hidden w-full max-w-2xl h-[500px] transition-transform transform hover:scale-105">
          <div className="bg-gray-50 px-4 py-3 border-b border-emerald-50 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/60 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400/60 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/60 shadow-inner"></div>
          </div>

          <div className="p-8 flex gap-6 h-full">
            <div className="w-1/3 space-y-4">
              {['Topic', 'Research', 'Drafting', 'Refining', 'Integrity'].map((step, i) => (
                <div key={i} className={`h-8 rounded-lg flex items-center px-3 text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${i === currentLineIndex ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-300'}`}>
                  {step}
                </div>
              ))}
            </div>

            <div className="w-2/3 border-l border-emerald-50 pl-4 space-y-2 overflow-hidden">
              {lines.map((line, idx) => (
                <p
                  key={idx}
                  className={`h-6 text-sm leading-6 overflow-hidden whitespace-nowrap ${
                    idx === currentLineIndex 
                    ? "text-emerald-700 font-semibold" 
                    : "text-slate-300"
                  }`}
                >
                  {typedLines[idx] || ""}
                  {idx === currentLineIndex && (
                    <span className="inline-block w-[2px] h-4 bg-emerald-500 animate-blink ml-1 align-middle shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s forwards; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulseSlow 8s ease-in-out infinite; }

        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>
    </section>
  );
};

export default Hero;