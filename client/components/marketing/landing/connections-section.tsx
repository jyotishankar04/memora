"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { NetworkIcon as Network, PaletteIcon as Palette, ArmchairIcon as Armchair, LightbulbIcon as Lightbulb, Home01Icon as Home } from "@hugeicons/core-free-icons";

export default function ConnectionsSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">
      
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] dark:opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.06) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; r: 2px; }
          50% { opacity: 1; r: 3.5px; }
        }
        .float-card {
          animation: float-gentle 6s ease-in-out infinite;
        }
        .float-card-delay-1 {
          animation: float-gentle 7s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .float-card-delay-2 {
          animation: float-gentle 8s ease-in-out infinite;
          animation-delay: 3s;
        }
        .glow-dot-1 {
          animation: pulse-dot 2.5s ease-in-out infinite;
        }
        .glow-dot-2 {
          animation: pulse-dot 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-6 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            CONNECTED KNOWLEDGE
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            One thing always leads to another.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            SaveForLatter connects the things you save, helping you discover relationships you didn't notice before.
          </p>
        </div>

        {/* Network Graph Visual Representation */}
        <div className="mx-auto max-w-2xl relative min-h-[400px] flex items-center justify-center border border-border/50 bg-card/20 backdrop-blur-xs rounded-3xl p-6 shadow-xs">
          
          {/* Layered Connection Lines behind cards */}
          <div className="absolute inset-0 z-0">
            <svg className="w-full h-full" viewBox="0 0 600 400" fill="none">
              <defs>
                <linearGradient id="line-grad-co" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1447E6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1447E6" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Root -> Level 1 */}
              <path d="M300,70 L150,140" stroke="url(#line-grad-co)" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M300,70 L300,140" stroke="url(#line-grad-co)" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M300,70 L450,140" stroke="url(#line-grad-co)" strokeWidth="1.5" strokeDasharray="3,3" />
              
              {/* Level 1 -> Level 2 */}
              <path d="M150,170 L150,230" stroke="url(#line-grad-co)" strokeWidth="1.5" />
              <path d="M300,170 L300,230" stroke="url(#line-grad-co)" strokeWidth="1.5" />
              <path d="M450,170 L450,230" stroke="url(#line-grad-co)" strokeWidth="1.5" />
              
              {/* Level 2 -> Final Node */}
              <path d="M150,260 L300,330" stroke="url(#line-grad-co)" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M300,260 L300,330" stroke="url(#line-grad-co)" strokeWidth="1.5" strokeDasharray="3,3" />
              <path d="M450,260 L300,330" stroke="url(#line-grad-co)" strokeWidth="1.5" strokeDasharray="3,3" />

              {/* Pulsing glow dots flowing down the network lines */}
              <circle cx="300" cy="110" r="3" fill="#1447E6" className="glow-dot-1" />
              <circle cx="150" cy="200" r="3" fill="#1447E6" className="glow-dot-2" />
              <circle cx="450" cy="200" r="3" fill="#1447E6" className="glow-dot-1" />
              <circle cx="300" cy="290" r="3" fill="#1447E6" className="glow-dot-2" />
            </svg>
          </div>

          {/* Connected Cards Layer (Foreground) */}
          <div className="absolute inset-0 flex flex-col justify-between items-center py-6 px-4 z-10 select-none">
            
            {/* Top Node (Root) */}
            <div className="float-card rounded-full border border-primary/20 bg-muted/75 p-0.5 shadow-sm">
              <div className="flex items-center gap-2 px-4 py-1.5 border border-primary/25 bg-card rounded-full">
                <HugeiconsIcon icon={Home} strokeWidth={2.25} className="h-4 w-4 text-primary fill-current/10" />
                <span className="text-xs font-semibold text-foreground">Home Renovation</span>
              </div>
            </div>

            {/* Middle Row 1 (Core Topics) */}
            <div className="w-full flex justify-between max-w-lg px-2">
              <div className="float-card-delay-1 rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border/75 bg-card rounded-md">
                  <HugeiconsIcon icon={Palette} strokeWidth={2.25} className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-[11px] font-medium text-foreground">Paint</span>
                </div>
              </div>
              <div className="float-card rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border/75 bg-card rounded-md">
                  <HugeiconsIcon icon={Armchair} strokeWidth={2.25} className="h-3.5 w-3.5 text-primary fill-current/10" />
                  <span className="text-[11px] font-medium text-foreground">Furniture</span>
                </div>
              </div>
              <div className="float-card-delay-2 rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border/75 bg-card rounded-md">
                  <HugeiconsIcon icon={Lightbulb} strokeWidth={2.25} className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[11px] font-medium text-foreground">Lighting</span>
                </div>
              </div>
            </div>

            {/* Middle Row 2 (Details) */}
            <div className="w-full flex justify-between max-w-lg px-2">
              <div className="float-card-delay-2 rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                <div className="flex items-center gap-1 px-2.5 py-1.5 border border-border/75 bg-card rounded-md">
                  <span className="text-[10px] text-muted-foreground">Budget</span>
                </div>
              </div>
              <div className="float-card-delay-1 rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                <div className="flex items-center gap-1 px-2.5 py-1.5 border border-border/75 bg-card rounded-md">
                  <span className="text-[10px] text-muted-foreground">Style</span>
                </div>
              </div>
              <div className="float-card rounded-lg border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                <div className="flex items-center gap-1 px-2.5 py-1.5 border border-border/75 bg-card rounded-md">
                  <span className="text-[10px] text-muted-foreground">Stores</span>
                </div>
              </div>
            </div>

            {/* Bottom Node (Outcome) */}
            <div className="float-card-delay-1 rounded-full border border-primary/20 bg-muted/75 p-0.5 shadow-sm">
              <div className="flex items-center gap-2 px-4 py-1.5 border border-primary/25 bg-card rounded-full">
                <HugeiconsIcon icon={Network} strokeWidth={2.25} className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Dream Living Room</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
