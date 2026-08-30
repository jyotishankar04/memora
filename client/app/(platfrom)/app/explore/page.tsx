"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemoriesQuery } from "@/context/MemoryContext";
import { timeAgo } from "@/lib/time";
import { MemoryThumbnail } from "@/components/memory-thumbnail";

export default function ExplorePage() {
  const { data, isLoading } = useMemoriesQuery({ limit: 100 });

  // Rediscover the oldest saves in your library — the ones most likely to
  // have been forgotten since they were captured.
  const forgotten = useMemo(() => {
    const items = data?.items ?? [];
    return [...items].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(0, 6);
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Explore & Rediscover</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Surfacing older saves from your memory that are easy to forget about.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/45 bg-muted/75 p-1">
              <div className="p-5 rounded-lg border border-border/75 bg-card min-h-[140px] space-y-3">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-2.5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : forgotten.length === 0 ? (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Nothing to rediscover yet</h3>
          <p className="text-xs text-muted-foreground">Once you have older saves, they&apos;ll surface here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {forgotten.map((item) => (
            <Link
              key={item.id}
              href={`/app/memories/${item.id}`}
              className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all block group"
            >
              <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[140px] space-y-4 text-xs font-semibold">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-primary font-bold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded uppercase">
                      Forgotten Gem
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono shrink-0">{timeAgo(item.createdAt)}</span>
                  </div>

                  <MemoryThumbnail item={item} className="rounded-lg" />

                  <h4 className="text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-[9px] text-muted-foreground font-mono line-clamp-2 font-normal">{item.description}</p>
                  )}
                </div>

                <span className="text-[10px] font-bold text-primary flex items-center gap-0.5 group-hover:underline w-fit">
                  Revisit memory &rarr;
                </span>
              </div>
            </Link>
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
