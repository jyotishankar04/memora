"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon as Sparkles, PlusIcon as Plus, Search01Icon as Search, XIcon as X, Delete02Icon as Trash2, MoreHorizontalIcon as MoreHorizontal, StarIcon as Star, GridIcon as Grid, ListIcon as List, Copy01Icon as Copy } from "@hugeicons/core-free-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Memory, MemoryType } from "@/types/memory";
import { useMemoriesQuery, useToggleFavoriteMutation, useDeleteMemoryMutation } from "@/context/MemoryContext";
import { timeAgo, timelineGroup } from "@/lib/time";
import { isMemoryProcessing } from "@/lib/memory-processing";
import { MEMORY_TYPE_ICONS } from "@/lib/memory-icons";
import { MemoryThumbnail } from "@/components/memory-thumbnail";
import { getPlatformFallback } from "@/lib/platform-fallback";
import { QueryErrorState } from "@/components/query-error-state";

const FILTER_TYPE: Record<string, MemoryType | undefined> = {
  all: undefined,
  links: "web",
  notes: "note",
  videos: "video",
  images: "image",
  files: "document",
};

export default function MemoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [activeCardMenu, setActiveCardMenu] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useMemoriesQuery({
    type: FILTER_TYPE[currentFilter],
    q: searchQuery.trim() || undefined,
    limit: 100,
  });
  const memories = data?.items ?? [];
  // Derived from the live (auto-refetching) list rather than a frozen
  // snapshot, so the drawer picks up enrichment as soon as it lands instead
  // of staying stuck on "Still processing" until it's closed and reopened.
  const selectedMemory = memories.find((m) => m.id === selectedMemoryId) ?? null;

  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const deleteMutation = useDeleteMemoryMutation();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onError: (err) => toast.add({ title: "Couldn't delete that memory", description: err instanceof Error ? err.message : undefined, type: "error" }),
    });
    if (selectedMemoryId === id) setSelectedMemoryId(null);
  };

  const toggleStar = (item: Memory, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteMutation.mutate(
      { id: item.id, isFavorite: !item.isFavorite },
      { onError: (err) => toast.add({ title: "Couldn't update favorite", description: err instanceof Error ? err.message : undefined, type: "error" }) },
    );
  };

  // Group into timeline buckets in the order items already arrive (createdAt desc from the API).
  const groupedEntries: { group: string; items: Memory[] }[] = [];
  for (const item of memories) {
    const group = timelineGroup(item.createdAt);
    let bucket = groupedEntries.find((g) => g.group === group);
    if (!bucket) {
      bucket = { group, items: [] };
      groupedEntries.push(bucket);
    }
    bucket.items.push(item);
  }

  return (
    <div className="flex h-full w-full overflow-hidden relative">

      {/* Memories content list */}
      <ScrollArea className="flex-1 min-h-0">
      <div className="px-6 py-10 space-y-8">

        {/* Header Title */}
        <div className="flex md:max-w-10/12 m-auto items-center justify-between border-b border-border/20 pb-4" data-tour="memories-header">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Memories</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Browse your digital memory timeline &middot; <span className="font-semibold text-foreground">{memories.length} Saves</span>
            </p>
          </div>

          <Link
            href="/app"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "rounded-full px-4 text-xs font-bold bg-primary text-white flex items-center gap-1.5"
            )}
          >
            <HugeiconsIcon icon={Plus} strokeWidth={2.25} className="h-4 w-4" /> Save
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 pt-2 md:max-w-10/12 m-auto">
          <div className="relative flex items-center max-w-xs w-full">
            <HugeiconsIcon icon={Search} strokeWidth={2.25} className="absolute left-3.5 h-4 w-4 text-primary stroke-[2.5] z-10" />
            <Input
              type="text"
              placeholder="Search your memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 rounded-xl text-xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Filters pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All" },
              { id: "links", label: "Websites" },
              { id: "notes", label: "Notes" },
              { id: "videos", label: "Videos" },
              { id: "images", label: "Images" },
              { id: "files", label: "Files" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all text-nowrap select-none",
                  currentFilter === tab.id
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls view togglers */}
          <div className="flex items-center gap-2 text-xs">

            {/* View selectors */}
            <div className="flex items-center border border-border/60 rounded-lg bg-card overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 hover:bg-muted transition-colors", viewMode === "grid" ? "text-primary bg-primary/5" : "text-muted-foreground")}
              >
                <HugeiconsIcon icon={Grid} strokeWidth={2.25} className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 hover:bg-muted transition-colors", viewMode === "list" ? "text-primary bg-primary/5" : "text-muted-foreground")}
              >
                <HugeiconsIcon icon={List} strokeWidth={2.25} className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
          </div>
        </div>

        {/* Timeline body items */}
        {isError ? (
          <QueryErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="space-y-10 pt-2">
            <div className="space-y-4">
              <Skeleton className="h-3 w-20" />
              <div className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3"
                  : "flex flex-col gap-3"
              )}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border/45 bg-muted/75 p-1">
                    {viewMode === "grid" ? (
                      <div className="rounded-lg border border-border/75 bg-card p-2.5 min-h-[128px] space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-3.5 w-10 rounded" />
                          <Skeleton className="h-3.5 w-3.5 rounded-full" />
                        </div>
                        <Skeleton className="aspect-video w-full rounded-md" />
                        <Skeleton className="h-2.5 w-4/5" />
                        <Skeleton className="h-2 w-2/5" />
                      </div>
                    ) : (
                      <div className="rounded-lg border border-border/75 bg-card p-3.5 flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-3 w-1/3" />
                          <Skeleton className="h-2.5 w-1/2" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : memories.length > 0 ? (
          <div className="space-y-10 pt-2">
            {groupedEntries.map(({ group, items: groupItems }) => (
              <div key={group} className="space-y-4 flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-mono">
                    {group}
                  </h3>
                  <div className="flex-1 h-px bg-border/40" />
                </div>

                <div className={cn(
                  viewMode === "grid"
                    ? " w-full md:max-w-10/12 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
                    : " w-full md:max-w-10/12 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] flex-col"
                )}>
                  {groupItems.map((item) => {
                    const TypeIcon = MEMORY_TYPE_ICONS[item.type];

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedMemoryId(item.id)}
                        className={cn(
                          "rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 relative group cursor-pointer"
                        )}
                      >
                        <div className={cn(
                          "rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full transition-colors",
                          viewMode === "grid" ? "p-2.5 min-h-32 space-y-2" : "p-3.5 flex-row items-center gap-4"
                        )}>

                          {viewMode === "grid" && (
                            <>
                              <div className="flex items-center justify-between text-[7px] font-mono text-muted-foreground relative">
                                <span className="bg-primary/5 border border-primary/15 px-1.5 py-0.5 rounded text-primary uppercase font-bold flex items-center gap-1">
                                  <HugeiconsIcon icon={TypeIcon} strokeWidth={2.25} className="h-2 w-2" /> {item.type}
                                </span>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => toggleStar(item, e)}
                                    className="text-muted-foreground hover:text-amber-500 transition-colors"
                                  >
                                    <HugeiconsIcon icon={Star} strokeWidth={2.25} className={cn("h-3 w-3", item.isFavorite ? "fill-amber-500 text-amber-500" : "")} />
                                  </button>

                                  <button
                                    onClick={(e) => { e.stopPropagation(); setActiveCardMenu(activeCardMenu === item.id ? null : item.id); }}
                                    className="text-muted-foreground hover:text-foreground h-5 w-5 rounded-full flex items-center justify-center hover:bg-muted"
                                  >
                                    <HugeiconsIcon icon={MoreHorizontal} strokeWidth={2.25} className="h-3 w-3" />
                                  </button>
                                </div>

                                {activeCardMenu === item.id && (
                                  <div className="absolute right-0 top-6 w-32 bg-card border border-border rounded-lg shadow-lg py-1 z-30 text-[10px] font-bold text-foreground">
                                    {[
                                      { label: "Copy link", icon: Copy, action: () => navigator.clipboard.writeText(item.url ?? item.source ?? "") },
                                      { label: "Delete", icon: Trash2, action: () => handleDelete(item.id) }
                                    ].map((m) => (
                                      <button
                                        key={m.label}
                                        onClick={(e) => { e.stopPropagation(); m.action(); setActiveCardMenu(null); }}
                                        className="w-full px-3 py-1.5 hover:bg-muted text-left flex items-center gap-2"
                                      >
                                        <HugeiconsIcon icon={m.icon} strokeWidth={2.25} className="h-3 w-3 opacity-60" />
                                        <span>{m.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {item.type !== "note" && <MemoryThumbnail item={item} />}

                              {item.type === "note" && (
                                <div className="p-2 border border-border/60 bg-muted/20 rounded-md text-[9px] text-muted-foreground leading-relaxed font-mono line-clamp-3">
                                  {item.description}
                                </div>
                              )}

                              <div className="space-y-0.5">
                                <h4 className="text-[11px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
                                  {item.title}
                                </h4>
                                <span className="text-[8px] text-muted-foreground truncate block font-mono">
                                  {item.source}
                                </span>
                              </div>

                              <div className="flex items-center justify-between pt-1.5 border-t border-border/20">
                                <div className="flex flex-wrap gap-1 min-w-0">
                                  {item.tags.slice(0, 2).map(t => (
                                    <span key={t} className="text-[6.5px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1 py-0.5 rounded truncate max-w-13">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                                <span className="text-[7.5px] text-muted-foreground font-mono shrink-0 ml-1">{timeAgo(item.createdAt)}</span>
                              </div>
                            </>
                          )}

                          {viewMode === "list" && (
                            <div className="flex-1 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                  <HugeiconsIcon icon={TypeIcon} strokeWidth={2.25} className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                    {item.title}
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">{item.source}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 shrink-0 font-mono text-[9px] text-muted-foreground">
                                <span className="hidden sm:inline">{timeAgo(item.createdAt)}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                  className="h-8 w-8 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors"
                                >
                                  <HugeiconsIcon icon={Trash2} strokeWidth={2.25} className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 max-w-sm mx-auto space-y-4">
            <h3 className="text-sm font-semibold text-foreground">No saves match current filters</h3>
            <p className="text-xs text-muted-foreground">Try clearing tags filters or search query to browse files.</p>
          </div>
        )}

      </div>
      </ScrollArea>

      {/* DETAIL SLIDE DRAWER */}
      {selectedMemory && (
        <div className="w-80 border-l border-border bg-card flex flex-col shrink-0 z-40 relative animate-slide-left">

          <div className="p-5 border-b border-border/20 flex items-center justify-between shrink-0">
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-foreground truncate">{selectedMemory.title}</h3>
              <span className="text-[9px] font-mono text-muted-foreground truncate block">{selectedMemory.source}</span>
            </div>
            <button
              onClick={() => setSelectedMemoryId(null)}
              className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              <HugeiconsIcon icon={X} strokeWidth={2.25} className="h-4 w-4" />
            </button>
          </div>

          <ScrollArea className="flex-1 min-h-0">
          <div className="p-5 space-y-6 text-xs leading-relaxed">

            <MemoryThumbnail item={selectedMemory} className="rounded-lg" />

            {/* Plain-language preview status — never the raw fetchStatus (see docs/URL_CAPTURE_AND_PREVIEW.md's UI copy guidance). */}
            {!isMemoryProcessing(selectedMemory) && selectedMemory.previewStatus && selectedMemory.previewStatus !== "available" && (
              <p className="text-[10px] text-muted-foreground -mt-3">
                {selectedMemory.previewSource === "browser"
                  ? "Preview captured from your browser."
                  : `Preview unavailable${selectedMemory.platform ? ` · ${getPlatformFallback(selectedMemory.platform).label}` : ""}.`}
              </p>
            )}

            {selectedMemory.description && (
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-muted-foreground">DESCRIPTION</span>
                <p className="text-[10px] text-foreground/90 font-medium">{selectedMemory.description}</p>
              </div>
            )}
            <div className="pt-4">
              <Link
                href={`/app/memories/${selectedMemory.id}`}
              >
                <Button className="w-full py-4 cursor-pointer font-bold">
                  Open detailed view &rarr;
                </Button>
              </Link>
            </div>
            {selectedMemory.tags.length > 0 && (
              <div className="space-y-1 border-t border-border/20 pt-3">
                <span className="text-[8px] font-mono text-muted-foreground block">TAGS</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedMemory.tags.map(tag => (
                    <span key={tag} className="text-[8px] font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 border-t border-border/20 pt-4">
              <div className="flex items-center gap-1 text-primary">
                <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-3.5 w-3.5 fill-current" />
                <span className="text-[9px] font-bold uppercase tracking-wider">AI Summary</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {selectedMemory.inferredIntent ??
                  (isMemoryProcessing(selectedMemory)
                    ? "Still processing — this updates automatically in a few seconds."
                    : "No AI summary available for this memory.")}
              </p>
            </div>
            

            {selectedMemory.extractedFields && Object.keys(selectedMemory.extractedFields).length > 0 && (
              <div className="space-y-2 border-t border-border/20 pt-4">
                <span className="text-[8px] font-mono text-muted-foreground block">
                  {selectedMemory.contentType ? selectedMemory.contentType.replace(/_/g, " ").toUpperCase() : "DETAILS"}
                </span>
                <dl className="space-y-1.5">
                  {Object.entries(selectedMemory.extractedFields).map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between gap-3">
                      <dt className="text-[9px] text-muted-foreground shrink-0 capitalize">
                        {key.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()}
                      </dt>
                      <dd className="text-[10px] text-foreground/90 font-medium text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            

          </div>
          </ScrollArea>
        </div>
      )}

      {/* Drawer animations CSS */}
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
