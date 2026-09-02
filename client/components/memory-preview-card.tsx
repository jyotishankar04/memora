import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Memory } from "@/types/memory";
import { MEMORY_TYPE_ICONS } from "@/lib/memory-icons";
import { MemoryThumbnail } from "@/components/memory-thumbnail";
import { timeAgo } from "@/lib/time";

/** Read-only variant of the memory grid card (app/memories/page.tsx's inline
 * card markup) — same visual design (type badge, thumbnail, title, tags,
 * timestamp), minus the favorite/"..." menu buttons that only make sense on
 * the management page itself. Used wherever a memory needs to be shown as a
 * citation rather than something to act on (e.g. Ask's "Referenced" cards). */
export function MemoryPreviewCard({ memory }: { memory: Memory }) {
  const TypeIcon = MEMORY_TYPE_ICONS[memory.type];

  return (
    <Link
      href={`/app/memories/${memory.id}`}
      className="block w-40 sm:w-44 shrink-0 rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300"
    >
      <div className="rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full p-2.5 min-h-32 space-y-2 transition-colors">
        <span className="w-fit flex items-center gap-1 rounded border border-primary/15 bg-primary/5 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase text-primary">
          <HugeiconsIcon icon={TypeIcon} strokeWidth={2.25} className="h-2 w-2" /> {memory.type}
        </span>

        {memory.type !== "note" && <MemoryThumbnail item={memory} />}

        {memory.type === "note" && (
          <div className="rounded-md border border-border/60 bg-muted/20 p-2 font-mono text-[9px] leading-relaxed text-muted-foreground line-clamp-3">
            {memory.description}
          </div>
        )}

        <div className="space-y-0.5">
          <h4 className="line-clamp-1 text-[11px] font-bold leading-snug text-foreground">{memory.title}</h4>
          <span className="block truncate font-mono text-[8px] text-muted-foreground">{memory.source}</span>
        </div>

        <div className="flex items-center justify-between border-t border-border/20 pt-1.5">
          <div className="flex min-w-0 flex-wrap gap-1">
            {memory.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="max-w-13 truncate rounded bg-muted px-1 py-0.5 font-bold text-[6.5px] uppercase tracking-wider text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="ml-1 shrink-0 font-mono text-[7.5px] text-muted-foreground">{timeAgo(memory.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
