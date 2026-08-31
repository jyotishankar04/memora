"use client";

import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemoriesQuery } from "@/context/MemoryContext";
import { timeAgo } from "@/lib/time";
import { MEMORY_TYPE_ICONS } from "@/lib/memory-icons";

export default function RecentPage() {
  const { data, isLoading } = useMemoriesQuery({ limit: 30 });
  const recent = data?.items ?? [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recent</h1>
        <p className="text-xs text-muted-foreground mt-1">
          A timeline of your latest saved discoveries and quick notes.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative flex gap-6 pb-6 border-l border-border/60 pl-6 last:pb-0">
              <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-background border border-border" />
              <div className="flex-1 rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs max-w-xl">
                <div className="p-4 rounded-lg border border-border/75 bg-card flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Nothing saved yet</h3>
          <p className="text-xs text-muted-foreground">Capture a link, note, or file to see it appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {recent.map((item) => {
            const TypeIcon = MEMORY_TYPE_ICONS[item.type];

            return (
              <div key={item.id} className="relative flex gap-6 pb-6 border-l border-border/60 pl-6 last:pb-0">
                {/* Timeline bubble */}
                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-background border border-primary flex items-center justify-center text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </div>

                <Link
                  href={`/app/memories/${item.id}`}
                  className="flex-1 rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs max-w-xl hover:border-primary/20 transition-all group"
                >
                  <div className="p-4 rounded-lg border border-border/75 bg-card flex justify-between items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-foreground truncate group-hover:text-primary transition-colors">{item.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">{item.source}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-muted-foreground font-mono shrink-0">{timeAgo(item.createdAt)}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

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
