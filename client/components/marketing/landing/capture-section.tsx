"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon as Sparkles, GlobeIcon as Globe, Camera01Icon as Camera, StickyNote01Icon as StickyNote, Video01Icon as Video, Image01Icon as Image } from "@hugeicons/core-free-icons";

export default function CaptureSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] dark:opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.06) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      {/* Animation classes */}
      <style>{`
        @keyframes float-circle {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          50% { transform: translate(3px, -5px) rotate(1deg); }
        }
        .float-central {
          animation: float-circle 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .float-central {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            CAPTURE WITHOUT THINKING
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            One click from anywhere.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            Whatever you're looking at, SaveForLatter is always close by.
          </p>
        </div>

        {/* Orbit Flow Diagram */}
        <div className="mx-auto max-w-xl h-64 md:h-80 relative flex items-center justify-center mb-16 select-none">
          
          {/* SVG Connection Lines */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 500 300" fill="none">
              <defs>
                <linearGradient id="flow-in-grad-ca" x1="0%" y1="0%" x2="50%" y2="50%">
                  <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1447E6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              
              {/* Lines from outer nodes to center (250, 150) */}
              <path d="M250,55 L250,110" stroke="url(#flow-in-grad-ca)" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M105,90 L210,135" stroke="url(#flow-in-grad-ca)" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M395,90 L290,135" stroke="url(#flow-in-grad-ca)" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M145,225 L215,165" stroke="url(#flow-in-grad-ca)" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M355,225 L285,165" stroke="url(#flow-in-grad-ca)" strokeWidth="1.5" strokeDasharray="3,3" />
            </svg>
          </div>

          {/* Central Logo Core Node */}
          <div className="float-central z-10 p-5 rounded-2xl border border-primary/30 bg-background shadow-[0_12px_40px_rgba(20,71,230,0.18)] text-center flex flex-col items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_2px_10px_rgba(20,71,230,0.3)] mb-2">
              <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-5.5 w-5.5 fill-current" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-foreground uppercase">SAVEFORLATTER</span>
          </div>

          {/* Orbital Nodes — content sources, not platforms (platforms live in their own section) */}
          {/* Top: Websites */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <HugeiconsIcon icon={Globe} strokeWidth={2.25} className="h-3.5 w-3.5 text-blue-500" />
            <span>Websites</span>
          </div>

          {/* Left-Top: Photos */}
          <div className="absolute top-12 left-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <HugeiconsIcon icon={Image} strokeWidth={2.25} className="h-3.5 w-3.5 text-pink-500" />
            <span>Instagram / Photos</span>
          </div>

          {/* Right-Top: Videos */}
          <div className="absolute top-12 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <HugeiconsIcon icon={Video} strokeWidth={2.25} className="h-3.5 w-3.5 text-red-500" />
            <span>YouTube / Video</span>
          </div>

          {/* Bottom-Left: Notes and ideas */}
          <div className="absolute bottom-6 left-12 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <HugeiconsIcon icon={StickyNote} strokeWidth={2.25} className="h-3.5 w-3.5 text-amber-500" />
            <span>Notes / Ideas</span>
          </div>

          {/* Bottom-Right: Screenshots */}
          <div className="absolute bottom-6 right-12 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <HugeiconsIcon icon={Camera} strokeWidth={2.25} className="h-3.5 w-3.5 text-primary" />
            <span>Screenshots</span>
          </div>

        </div>

      </div>
    </section>
  );
}
