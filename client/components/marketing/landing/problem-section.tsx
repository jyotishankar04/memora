"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark01Icon as Bookmark, Video01Icon as Video, Image01Icon as Image, StickyNote01Icon as StickyNote, SparklesIcon as Sparkles } from "@hugeicons/core-free-icons";

export default function ProblemSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      {/* Inline styles for custom keyframe animations */}
      <style>{`
        @keyframes float-y-1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-y-2 {
          0%, 100% { transform: translateY(-4px); }
          50% { transform: translateY(4px); }
        }
        @keyframes float-y-3 {
          0%, 100% { transform: translateY(2px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes float-y-4 {
          0%, 100% { transform: translateY(-2px); }
          50% { transform: translateY(6px); }
        }
        @keyframes flow-dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-float-1 { animation: float-y-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-y-2 7s ease-in-out infinite; }
        .animate-float-3 { animation: float-y-3 5s ease-in-out infinite; }
        .animate-float-4 { animation: float-y-4 8s ease-in-out infinite; }
        .flow-line {
          stroke-dasharray: 6, 4;
          animation: flow-dash 1.2s linear infinite;
        }
        .pulse-glow-ring {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle background glow effect */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 blur-[120px]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.12) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            THE PROBLEM
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Everything worth saving is scattered.
          </h2>
          <p className="mt-6 text-balance text-muted-foreground text-base md:text-lg leading-relaxed">
            You save a website in your bookmarks, a reel on Instagram, a video on YouTube, and an idea in your notes. Months later, you remember the thing — but not where you saved it.
          </p>
          <p className="mt-4 font-semibold text-primary text-base md:text-lg">
            SaveForLatter puts it all in one place.
          </p>
        </div>

        {/* Scattered to Unified Visual Grid */}
        <div 
          className="mx-auto max-w-4xl p-6 md:p-10 rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-md relative shadow-sm dark:shadow-2xl dark:shadow-black/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-11 gap-6 md:gap-4 items-center">
            
            {/* Left Side: Scattered (Col span 4) */}
            <div className="grid grid-cols-2 gap-3 md:col-span-4 z-10">
              
              {/* Bookmarks Card */}
              <div className="animate-float-1 rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
                <div className="p-4 rounded-lg border border-border/75 bg-card hover:border-primary/20 transition-colors h-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 mb-2">
                    <HugeiconsIcon icon={Bookmark} strokeWidth={2.25} className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-medium text-foreground">Bookmarks</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">247 saved links</p>
                </div>
              </div>

              {/* YouTube Card */}
              <div className="animate-float-2 rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
                <div className="p-4 rounded-lg border border-border/75 bg-card hover:border-primary/20 transition-colors h-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600 mb-2">
                    <HugeiconsIcon icon={Video} strokeWidth={2.25} className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-medium text-foreground">YouTube</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Saved videos</p>
                </div>
              </div>

              {/* Screenshots Card */}
              <div className="animate-float-3 rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
                <div className="p-4 rounded-lg border border-border/75 bg-card hover:border-primary/20 transition-colors h-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 mb-2">
                    <HugeiconsIcon icon={Image} strokeWidth={2.25} className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-medium text-foreground">Screenshots</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">1,284 images</p>
                </div>
              </div>

              {/* Notes Card */}
              <div className="animate-float-4 rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
                <div className="p-4 rounded-lg border border-border/75 bg-card hover:border-primary/20 transition-colors h-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 mb-2">
                    <HugeiconsIcon icon={StickyNote} strokeWidth={2.25} className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-xs font-medium text-foreground">Notes</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Random ideas</p>
                </div>
              </div>

            </div>

            {/* Middle: Flowing Arrow Visual (Col span 3) */}
            <div className="flex items-center justify-center md:col-span-3">
              {/* Horizontal SVG line for desktop */}
              <div className="hidden md:block w-full px-4">
                <svg className="w-full h-12" viewBox="0 0 120 24" fill="none">
                  <defs>
                    <linearGradient id="flow-gradient-p" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#1447E6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#1447E6" />
                    </linearGradient>
                  </defs>
                  <path d="M5,12 H108" stroke="url(#flow-gradient-p)" strokeWidth="2.5" strokeLinecap="round" className="flow-line" />
                  <path d="M103,7 L111,12 L103,17" stroke="#1447E6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>

              {/* Vertical SVG line for mobile */}
              <div className="block md:hidden py-2">
                <svg className="w-8 h-16" viewBox="0 0 24 64" fill="none">
                  <defs>
                    <linearGradient id="flow-gradient-p-v" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#1447E6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#1447E6" />
                    </linearGradient>
                  </defs>
                  <path d="M12,5 V52" stroke="url(#flow-gradient-p-v)" strokeWidth="2.5" strokeLinecap="round" className="flow-line" />
                  <path d="M7,47 L12,55 L17,47" stroke="#1447E6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>

            {/* Right Side: Unified (Col span 4) */}
            <div className="flex flex-col items-center justify-center md:col-span-4 z-10 w-full">
              <div className="rounded-xl border border-primary/20 bg-muted/75 p-1 shadow-md max-w-[240px] w-full">
                <div className="relative p-6 rounded-lg border border-primary/30 bg-card text-center group hover:border-primary transition-all duration-300 h-full flex flex-col items-center">
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-lg border border-primary/20 scale-105 pointer-events-none pulse-glow-ring" />
                  
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4 shadow-[0_0_20px_rgba(20,71,230,0.4)] group-hover:rotate-12 transition-transform duration-300">
                    <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-5.5 w-5.5 fill-current" />
                  </div>
                  
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                    SAVEFORLATTER
                  </span>
                  <h4 className="text-sm font-semibold text-foreground mt-2">
                    One Searchable Memory
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                    Automatically indexed, summarized, and searchable using natural language.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom copy */}
        <p className="text-center text-sm font-medium text-muted-foreground mt-12 tracking-wide">
          One place for everything you don't want to forget.
        </p>
      </div>
    </section>
  );
}
