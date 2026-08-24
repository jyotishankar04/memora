"use client";

import React from "react";
import Link from "next/link";
import { Globe, Video, StickyNote } from "lucide-react";

export default function RecentPage() {
  const recentTimeline = [
    { id: "mem-1", title: "Linear Dashboard", type: "web", time: "2 min ago", source: "linear.app" },
    { id: "mem-2", title: "Building a SaaS in 2026", type: "video", time: "2 hours ago", source: "youtube.com" },
    { id: "mem-3", title: "Memora duplicate saves idea", type: "note", time: "Yesterday", source: "Personal Note" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recent</h1>
        <p className="text-xs text-muted-foreground mt-1">
          A timeline of your latest saved discoveries and quick notes.
        </p>
      </div>

      <div className="space-y-6">
        {recentTimeline.map((item, idx) => {
          let TypeIcon = Globe;
          if (item.type === "video") TypeIcon = Video;
          if (item.type === "note") TypeIcon = StickyNote;

          return (
            <div key={item.id} className="relative flex gap-6 pb-6 border-l border-border/60 pl-6 last:pb-0">
              {/* Timeline bubble */}
              <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-background border border-primary flex items-center justify-center text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
              </div>

              <div className="flex-1 rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs max-w-xl">
                <div className="p-4 rounded-lg border border-border/75 bg-card flex justify-between items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-foreground">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{item.source}</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono shrink-0">{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
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
