"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon as Star, MoreHorizontalIcon as MoreHorizontal, Calendar03Icon as CalendarIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import { timeAgo } from "@/lib/time";
import { MEMORY_TYPE_ICONS } from "@/lib/memory-icons";
import { MemoryThumbnail } from "@/components/memory-thumbnail";
import { MemoryActionsMenu } from "@/components/memory/memory-actions-menu";
import { useToggleFavoriteMutation } from "@/context/MemoryContext";
import type { Memory } from "@/types/memory";

interface MemoryGridCardProps {
  item: Memory;
  onClick?: () => void;
  /** Passed through to MemoryActionsMenu — where to navigate after archive/vault/trash succeeds. */
  redirectTo?: string;
}

/** The memory grid card used on the memories list — also reused inside the
 * vault so vaulted memories look and behave exactly like regular ones. */
export function MemoryGridCard({ item, onClick, redirectTo }: MemoryGridCardProps) {
  const toggleFavoriteMutation = useToggleFavoriteMutation();
  const TypeIcon = MEMORY_TYPE_ICONS[item.type];

  return (
    <div
      onClick={onClick}
      className="group relative rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs transition-all duration-300 hover:border-primary/20 cursor-pointer"
    >
      <div className="flex h-full min-h-32 flex-col justify-between space-y-2 rounded-lg border border-border/75 bg-card p-2.5 transition-colors">
        <div className="relative flex items-center justify-between text-[7px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1 rounded border border-primary/15 bg-primary/5 px-1.5 py-0.5 font-bold uppercase text-primary">
            <HugeiconsIcon icon={TypeIcon} strokeWidth={2.25} className="h-2 w-2" /> {item.type}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteMutation.mutate(
                  { id: item.id, isFavorite: !item.isFavorite },
                  {
                    onError: (err) =>
                      toast.add({ title: "Couldn't update favorite", description: err instanceof Error ? err.message : undefined, type: "error" }),
                  },
                );
              }}
              className="text-muted-foreground transition-colors hover:text-amber-500"
            >
              <HugeiconsIcon icon={Star} strokeWidth={2.25} className={cn("h-3 w-3", item.isFavorite ? "fill-amber-500 text-amber-500" : "")} />
            </button>

            <MemoryActionsMenu
              memory={item}
              redirectTo={redirectTo}
              trigger={
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon icon={MoreHorizontal} strokeWidth={2.25} className="h-3 w-3" />
                </button>
              }
            />
          </div>
        </div>

        {item.type !== "note" && <MemoryThumbnail item={item} />}

        {item.type === "note" && (
          <div className="rounded-md border border-border/60 bg-muted/20 p-2 font-mono text-[9px] leading-relaxed text-muted-foreground line-clamp-3">
            {item.description}
          </div>
        )}

        <div className="space-y-0.5">
          <h4 className="line-clamp-1 text-[11px] font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h4>
          <span className="block truncate font-mono text-[8px] text-muted-foreground">{item.source}</span>
        </div>

        <div className="flex items-center justify-between border-t border-border/20 pt-1.5">
          <div className="flex min-w-0 flex-wrap gap-1">
            {item.tags.slice(0, 2).map((t) => (
              <span key={t} className="max-w-13 truncate rounded bg-muted px-1 py-0.5 text-[6.5px] font-bold uppercase tracking-wider text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
          <span className="ml-1 flex shrink-0 items-center gap-1 font-mono text-[7.5px] text-muted-foreground">
            {item.eventAt && (
              <span
                className="flex items-center gap-0.5 rounded bg-primary/10 px-1 py-0.5 text-primary"
                title={new Date(item.eventAt).toLocaleString()}
              >
                <HugeiconsIcon icon={CalendarIcon} strokeWidth={2.25} className="h-2 w-2" />
                {new Date(item.eventAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            )}
            {timeAgo(item.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
