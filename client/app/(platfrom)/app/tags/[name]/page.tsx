"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Tag as TagIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemoriesQuery } from "@/context/MemoryContext";
import { timeAgo } from "@/lib/time";
import { MemoryThumbnail } from "@/components/memory-thumbnail";

export default function TagDetailPage() {
  const params = useParams();
  const router = useRouter();
  const name = decodeURIComponent(params.name as string);

  const { data, isLoading } = useMemoriesQuery({ tag: name, limit: 100 });
  const memories = data?.items ?? [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <button
        onClick={() => router.push("/app/tags")}
        className="text-xs font-semibold hover:text-primary flex items-center gap-1 text-muted-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to tags
      </button>

      <div className="flex items-center gap-4 border-b border-border/20 pb-6">
        <div className="h-14 w-14 border rounded-2xl bg-primary/5 border-primary/20 text-primary flex items-center justify-center shrink-0">
          <TagIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
          <span className="text-[10px] font-mono text-muted-foreground mt-1 block font-semibold">
            {isLoading ? "Loading…" : `${memories.length} saved ${memories.length === 1 ? "memory" : "memories"}`}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/45 bg-muted/75 p-1">
              <div className="p-4 rounded-lg border border-border/75 bg-card min-h-[165px] space-y-3">
                <Skeleton className="h-3.5 w-14 rounded" />
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-2.5 w-full" />
                <div className="flex items-center justify-between pt-2.5 border-t border-border/20">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-2.5 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Nothing tagged &ldquo;{name}&rdquo; yet</h3>
          <p className="text-xs text-muted-foreground">Tag a memory with it from its detail page or the capture form.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((item) => (
            <Link
              key={item.id}
              href={`/app/memories/${item.id}`}
              className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 block group"
            >
              <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[165px] space-y-4">
                <MemoryThumbnail item={item} className="rounded-lg" />
                <div className="space-y-2">
                  <span className="text-[8px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded uppercase">
                    {item.type}
                  </span>
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
