"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { CompassIcon as Compass, ExternalLinkIcon as ExternalLink } from "@hugeicons/core-free-icons";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicCollection, type PublicMemoryItem } from "@/lib/collections";
import { MEMORY_TYPE_ICONS } from "@/lib/memory-icons";
import { timeAgo } from "@/lib/time";

export default function PublicCollectionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["collections", "public", slug],
    queryFn: () => getPublicCollection(slug),
    retry: false,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 max-w-5xl mx-auto w-full px-6">
        {isLoading ? (
          <div className="space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </div>
        ) : isError || !data ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="relative w-14 h-14 flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="w-12 h-12 rounded-2xl border border-primary/30 flex items-center justify-center bg-card shadow-md">
                <HugeiconsIcon icon={Compass} strokeWidth={2.25} className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Collection not found</h1>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
              This link is invalid or the owner has stopped sharing it.
            </p>
          </div>
        ) : (
          <>
            <div className="border-b border-border/20 pb-6 mb-8 space-y-2">
              <span className="text-3xl">{data.icon}</span>
              <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
              {data.description && <p className="text-sm text-muted-foreground max-w-xl">{data.description}</p>}
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pt-1">
                {data.memories.length} {data.memories.length === 1 ? "memory" : "memories"} &middot; shared via SaveForLatter
              </p>
            </div>

            {data.memories.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center">This collection is empty.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.memories.map((item) => (
                  <PublicMemoryCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <MainFooter />
    </div>
  );
}

function PublicMemoryCard({ item }: { item: PublicMemoryItem }) {
  const Icon = MEMORY_TYPE_ICONS[item.type] ?? Compass;
  const body = item.description || item.content;

  const card = (
    <div className="h-full rounded-xl border border-border/60 bg-card p-4 space-y-2 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          <HugeiconsIcon icon={Icon} strokeWidth={2.25} className="h-3 w-3" />
          {item.type}
        </span>
        {item.url && <HugeiconsIcon icon={ExternalLink} strokeWidth={2.25} className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
      <h3 className="text-sm font-semibold text-foreground line-clamp-2">{item.title}</h3>
      {body && <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{body}</p>}
      <p className="text-[10px] text-muted-foreground/70 font-mono pt-1">{timeAgo(item.createdAt)}</p>
    </div>
  );

  return item.url ? (
    <a href={item.url} target="_blank" rel="noopener noreferrer nofollow">
      {card}
    </a>
  ) : (
    card
  );
}
