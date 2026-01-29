import React, { useState, useEffect } from "react";
import { Search, List, Edit3, ShieldCheck } from "lucide-react";

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(-1); 

  const features = [
    {
      icon: Search,
      title: "AI Research",
      desc: "Automatically gathers relevant insights.",
      previewText:
        "Analyzing search intent and extracting valuable information",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    },
    {
      icon: List,
      title: "Auto Outline",
      desc: "Builds a logical content structure.",
      previewText:
        "Generating headings and structuring the content flow",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    },
    {
      icon: Edit3,
      title: "Smart Editing",
      desc: "Improves clarity and tone.",
      previewText:
        "Refining grammar, tone, and formatting automatically",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    {
      icon: ShieldCheck,
      title: "Plagiarism Check",
      desc: "Ensures originality.",
      previewText:
        "Checking content originality and uniqueness",
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3",
    },
  ];

  /* Auto-hover cycling every 3 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="relative bg-gray-50/80 py-24 px-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-12">
        Features
      </h2>

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
              className="
                relative
                bg-white
                p-6
                rounded-2xl
                border border-gray-100
                shadow-[0_0_20px_rgba(16,185,129,0.15)]
                hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]
                transition-all duration-300
                cursor-pointer
                text-center
                flex flex-col items-center
              "
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <Icon className="text-emerald-600" size={22} />
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>

              {/* Large Preview Panel */}
              {isActive && (
                <div
                  className={`
                    absolute z-50
                    -top-12
                    ${index === 0 ? "left-0" : ""}
                    ${index === features.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2"}
                    w-[560px]
                    bg-white rounded-3xl
                    shadow-2xl
                    border border-gray-100
                    p-6
                    animate-preview
                  `}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-[220px] object-cover rounded-2xl mb-5"
                  />

                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title} – In Action
                  </h4>

                  <p className="text-base text-gray-600 flex items-center gap-1">
                    {feature.previewText}
                    <span className="typing-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes previewEnter {
            from {
              opacity: 0;
              transform: translate(-50%, 16px) scale(0.92);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0) scale(1);
            }
          }

          .animate-preview {
            animation: previewEnter 0.25s ease-out;
          }

          .typing-dots span {
            animation: blink 1.4s infinite both;
          }

          .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
          }

          .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes blink {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </section>
  );
};

export default Features;