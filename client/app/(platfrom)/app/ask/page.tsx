"use client";

import React from "react";
import { Sparkles, Search, Link2, Layers } from "lucide-react";

const PREVIEW_FEATURES = [
  {
    icon: Search,
    title: "Ask across everything you've saved",
    description: "“What have I saved about AI agents?” — answered from your own memories, not the open web.",
  },
  {
    icon: Link2,
    title: "Grounded answers, with sources",
    description: "Every answer links back to the exact memories it came from, so you can verify and dig deeper.",
  },
  {
    icon: Layers,
    title: "Find connections you'd have missed",
    description: "Surfaces patterns across memories you saved weeks or months apart.",
  },
];

export default function AskPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 h-full flex items-center justify-center">
      <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="h-14 w-14 bg-primary/5 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="h-7 w-7 fill-current" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
              Coming soon
            </span>
            <h1 className="text-xl font-bold tracking-tight pt-1">Ask SaveForLatter</h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              A chat interface for your second brain — ask a question in plain language and get an answer
              grounded in what you&apos;ve actually saved. We&apos;re still building it.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-left">
          {PREVIEW_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-border/45 bg-muted/40"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <feature.icon className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-foreground">{feature.title}</h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative flex items-center opacity-50 pointer-events-none select-none">
          <input
            disabled
            placeholder="Ask SaveForLatter about your saves..."
            className="w-full bg-muted/30 border border-border rounded-full pl-4 pr-12 py-3.5 text-xs text-foreground"
          />
          <div className="absolute right-2 h-9 w-9 rounded-full bg-primary/40 text-white flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
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
