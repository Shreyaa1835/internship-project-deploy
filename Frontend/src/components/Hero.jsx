import React, { useState, useEffect } from "react";

const Hero = () => {
  const lines = [
    "Introducing AI-powered content creation...",
    "Generating blog ideas and outlines...",
    "Writing high-quality paragraphs automatically...",
    "Refining tone, grammar, and style in real-time..."
  ];

  const [typedLines, setTypedLines] = useState([]);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = 50; 
    const delayBetweenLines = 800;

    const typeInterval = setInterval(() => {
      const currentLine = lines[currentLineIndex];
      if (!currentLine) return;

      const nextChar = currentLine[currentCharIndex];
      setTypedLines((prev) => {
        const newLines = [...prev];
        if (!newLines[currentLineIndex]) newLines[currentLineIndex] = "";
        newLines[currentLineIndex] += nextChar;
        return newLines;
      });

      setCurrentCharIndex((prev) => prev + 1);

      if (currentCharIndex + 1 === currentLine.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentLineIndex((prev) => (prev + 1) % lines.length);
          setCurrentCharIndex(0);
          setTypedLines((prev) => {
            const newLines = [...prev];
            if (currentLineIndex + 1 === lines.length) return [];
            return newLines;
          });
        }, delayBetweenLines);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [currentCharIndex, currentLineIndex]);

  return (
    <section className="relative px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white overflow-hidden">
      

      {/* Left Hero Text */}
<div className="relative z-10 space-y-6">
  {/* Background shape */}
  <div className="absolute -top-16 -left-16 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse-slow"></div>

  <h1 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-400 leading-snug lg:leading-snug mb-8 animate-fadeIn">
  AI Blog Post Generator
</h1>


  <p className="text-lg text-gray-700 max-w-md animate-fadeIn delay-200">
    Automate your content creation with intelligent AI. Generate structured, high-quality blog posts in seconds.
  </p>

  <div className="flex gap-4 mt-6">
    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-1 animate-fadeIn delay-400">
      Start Writing for Free
    </button>
    <button className="bg-white hover:bg-gray-100 text-emerald-600 px-6 py-4 rounded-xl font-semibold text-lg border border-emerald-200 shadow-md transition-all transform hover:-translate-y-1 animate-fadeIn delay-500">
      Learn More
    </button>
  </div>

 

  {/* Animations */}
  <style>{`
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 1s forwards; }
    .animate-fadeIn.delay-200 { animation-delay: 0.2s; }
    .animate-fadeIn.delay-400 { animation-delay: 0.4s; }
    .animate-fadeIn.delay-500 { animation-delay: 0.5s; }

    @keyframes pulseSlow {
      0%, 100% { transform: scale(1); opacity: 0.4; }
      50% { transform: scale(1.1); opacity: 0.6; }
    }
    .animate-pulse-slow { animation: pulseSlow 6s ease-in-out infinite; }

    @keyframes bounceSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    .animate-bounce-slow { animation: bounceSlow 4s ease-in-out infinite; }
  `}</style>
</div>


      {/* Right Hero Mockup */}
      <div className="relative z-10">
        <div className="bg-white rounded-3xl border border-emerald-300 shadow-[0_0_40px_10px_rgba(16,185,129,0.15)] overflow-hidden w-full max-w-2xl h-[500px] transition-transform transform hover:scale-105">
          
          <div className="bg-gray-50 px-4 py-3 border-b flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>

          {/* Editor Container */}
            <div className="p-8 flex gap-6 h-full">
              {/* Sidebar Steps */}
              <div className="w-1/3 space-y-4">
                {['Enter topic', 'Analyze SEO', 'Drafting', 'Tone check', 'Finish'].map((step, i) => (
                  <div key={i} className={`h-8 rounded-lg flex items-center px-3 text-[11px] font-bold uppercase tracking-wider ${i === currentLineIndex ? 'bg-emerald-50 text-emerald-600' : 'text-slate-300'}`}>
                    {step}
                  </div>
                ))}
              </div>

            <div className="w-2/3 border-l pl-4 space-y-2 overflow-hidden">
              {lines.map((line, idx) => (
                <p
                  key={idx}
                  className="h-6 text-gray-700 leading-6 overflow-hidden whitespace-nowrap"
                >
                  {typedLines[idx] || ""}
                  {idx === currentLineIndex && (
                    <span className="animate-blink">|</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      
      <style>{`
        @keyframes blink {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
