"use client";

import React from "react";
import { Sparkles, Globe, Smartphone, Laptop, Code, Video, Image } from "lucide-react";

const channels = [
  { name: "Web", desc: "Save any page instantly.", icon: Globe },
  { name: "Mobile", desc: "Share anything directly to Memora.", icon: Smartphone },
  { name: "Extension", desc: "Save without leaving the page.", icon: Globe },
  { name: "Desktop", desc: "Capture from anywhere with a shortcut.", icon: Laptop },
];

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
            Whatever you're looking at, Memora is always close by.
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
              <Sparkles className="h-5.5 w-5.5 fill-current" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-foreground uppercase">MEMORA</span>
          </div>

          {/* Orbital Nodes */}
          {/* Top: Browser Extension */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <Globe className="h-3.5 w-3.5 text-blue-500" />
            <span>Extension</span>
          </div>

          {/* Left-Top: Social Images */}
          <div className="absolute top-12 left-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <Image className="h-3.5 w-3.5 text-pink-500" />
            <span>Instagram / Web</span>
          </div>

          {/* Right-Top: Videos */}
          <div className="absolute top-12 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <Video className="h-3.5 w-3.5 text-red-500" />
            <span>YouTube / Video</span>
          </div>

          {/* Bottom-Left: Code repositories */}
          <div className="absolute bottom-6 left-12 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <Code className="h-3.5 w-3.5 text-foreground" />
            <span>GitHub / Dev</span>
          </div>

          {/* Bottom-Right: Mobile apps */}
          <div className="absolute bottom-6 right-12 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card shadow-xs text-xs font-semibold text-foreground">
            <Smartphone className="h-3.5 w-3.5 text-primary" />
            <span>Mobile App</span>
          </div>

        </div>

        {/* Channels Cards Grid (Double Bordered Cards!) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {channels.map((chan, idx) => {
            const Icon = chan.icon;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full">
                  <div>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">{chan.name}</h4>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{chan.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
