"use client";

import React from "react";
import { Sparkles, Globe, BarChart2 } from "lucide-react";

export default function InsightsPage() {
  const topics = [
    { name: "AI & RAG", percentage: 80 },
    { name: "Design", percentage: 60 },
    { name: "SaaS Systems", percentage: 50 },
    { name: "Development", percentage: 40 },
    { name: "Product Design", percentage: 30 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your memory insights</h1>
        <p className="text-xs text-muted-foreground mt-1">
          A visual look at what topics and connections you've been exploring recently.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl text-xs font-semibold">
        {[
          { label: "Total Saves", value: "248" },
          { label: "This Month", value: "42" },
          { label: "Topics Map", value: "17" },
          { label: "Collections", value: "8" }
        ].map((item, idx) => (
          <div key={idx} className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
            <div className="p-4 rounded-lg border border-border/75 bg-card">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">{item.label}</span>
              <span className="text-lg font-bold text-foreground mt-1 block">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        
        {/* Left Side: Topic progress bars */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What you've been exploring</h3>
          
          <div className="space-y-3.5 text-xs font-semibold">
            {topics.map((t, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-foreground">
                  <span>{t.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{t.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${t.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: AI insight block */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1">
            <Sparkles className="h-4 w-4 fill-current" /> AI Insights
          </h3>
          
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-1">
            <div className="p-5 rounded-lg border border-primary/10 bg-card space-y-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground block">✦ You seem increasingly interested in AI agents.</span>
              <p>
                You've saved 18 related memories in the last 30 days. Most of these cover tool calling, RAG optimizations, and local-first memory configurations.
              </p>
              <p className="text-[10px]">
                We've adjusted your smart collections suggestions to prioritize this trend.
              </p>
            </div>
          </div>
        </div>

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
