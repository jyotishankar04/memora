"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, Clock, RotateCcw } from "lucide-react";

export default function ExplorePage() {
  const discoveries = [
    { title: "SaaS Onboarding UX layout", source: "Captured 6 months ago · 4 similar updates found", href: "/app/memories/mem-1" },
    { title: "PostgreSQL B-Tree Indexes Tuning", source: "Captured a year ago today · 2 related saves", href: "/app/memories/mem-3" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Explore & Rediscover</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Surfacing forgotten ideas, bookmarks, and notes that align with your current development interests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {discoveries.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
            <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[140px] space-y-4 text-xs font-semibold">
              <div>
                <span className="text-[8px] font-mono text-primary font-bold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase">
                  Forgotten Gem
                </span>
                
                <h4 className="text-foreground leading-snug mt-3">{item.title}</h4>
                <span className="text-[9px] text-muted-foreground font-mono mt-1 block">{item.source}</span>
              </div>
              
              <Link 
                href={item.href}
                className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline w-fit"
              >
                Revisit memory &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
