"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemoriesQuery } from "@/context/MemoryContext";
import { timeAgo } from "@/lib/time";

export default function FavoritesPage() {
  const { data, isLoading } = useMemoriesQuery({ isFavorite: true, limit: 100 });
  const favorites = data?.items ?? [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Your bookmarked gems and high-value memories.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/45 bg-muted/75 p-1">
              <div className="p-4 rounded-lg border border-border/75 bg-card min-h-[160px] space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-10 rounded" />
                  <Skeleton className="h-4.5 w-4.5 rounded-full" />
                </div>
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-2.5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">No favorites yet</h3>
          <p className="text-xs text-muted-foreground">Star a memory to pin it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <Link
              key={item.id}
              href={`/app/memories/${item.id}`}
              className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 block group"
            >
              <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[160px] space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded uppercase">
                      {item.type}
                    </span>
                    <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-border/20 text-[9px] text-muted-foreground font-mono">
                  <span className="truncate max-w-[120px]">{item.source}</span>
                  <span>{timeAgo(item.createdAt)}</span>
                </div>
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
