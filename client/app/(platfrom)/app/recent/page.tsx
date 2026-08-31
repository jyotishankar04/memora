"use client";

import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemoriesQuery } from "@/context/MemoryContext";
import { timeAgo, timelineGroup } from "@/lib/time";
import { MEMORY_TYPE_ICONS } from "@/lib/memory-icons";
import type { Memory } from "@/types/memory";
import { QueryErrorState } from "@/components/query-error-state";

export default function RecentPage() {
  const { data, isLoading, isError, refetch } = useMemoriesQuery({ limit: 40 });
  const items = data?.items ?? [];

  // Group into timeline buckets in the order items already arrive (createdAt desc from the API).
  const groupedEntries: { group: string; items: Memory[] }[] = [];
  for (const item of items) {
    const group = timelineGroup(item.createdAt);
    let bucket = groupedEntries.find((g) => g.group === group);
    if (!bucket) {
      bucket = { group, items: [] };
      groupedEntries.push(bucket);
    }
    bucket.items.push(item);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 animate-fade-in">
      <div className="border-b border-border/20 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Recent</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Your latest saves, most recent first — pick up where you left off.
        </p>
      </div>

      {isError ? (
        <QueryErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative flex gap-5 pb-2 pl-8">
              <div className="absolute left-1.5 top-1 h-3 w-3 rounded-full bg-muted border-2 border-background ring-1 ring-border" />
              <div className="flex-1 rounded-2xl border border-border/45 bg-card p-4 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-2.5 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Nothing saved yet</h3>
          <p className="text-xs text-muted-foreground">Capture a link, note, or file to see your timeline come to life.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedEntries.map(({ group, items: groupItems }) => (
            <div key={group} className="space-y-4">
              <div className="flex items-center gap-3 sticky top-0 z-10 bg-background/95 backdrop-blur-xs py-1 -mx-1 px-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-mono whitespace-nowrap">
                  {group}
                </h3>
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-[9px] font-mono text-muted-foreground/70 shrink-0">{groupItems.length}</span>
              </div>

              <div className="relative pl-8">
                {/* Connecting line running through the whole group */}
                <div className="absolute left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-border via-border/60 to-transparent" />

                <div className="space-y-4">
                  {groupItems.map((item) => {
                    const TypeIcon = MEMORY_TYPE_ICONS[item.type];
                    return (
                      <div key={item.id} className="relative">
                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-background border-2 border-primary shadow-[0_0_0_3px_var(--background)]" />

                        <Link
                          href={`/app/memories/${item.id}`}
                          className="group flex items-center gap-4 rounded-2xl border border-border/45 bg-card p-3.5 shadow-xs hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 overflow-hidden">
                            {item.faviconUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable-domain favicon
                              <img src={item.faviconUrl} alt="" className="h-6 w-6 rounded-sm object-contain" />
                            ) : (
                              <TypeIcon className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                              {item.description || item.source}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-primary/5 text-primary px-2 py-0.5 rounded-full">
                              {item.type}
                            </span>
                            <span className="text-[9px] text-muted-foreground font-mono">{timeAgo(item.createdAt)}</span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
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
