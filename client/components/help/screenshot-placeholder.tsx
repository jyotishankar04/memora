import { HugeiconsIcon } from "@hugeicons/react";
import { Image01Icon as ImageIcon } from "@hugeicons/core-free-icons";

/**
 * Stands in for a real screenshot until one's dropped in — deliberately
 * obvious/dashed so it never gets mistaken for a finished part of the page.
 * Swap for a real <Image> once a screenshot exists; the `label` is just the
 * step's own title, so nothing else needs to change at that point.
 */
export function ScreenshotPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 aspect-video max-w-xl text-center px-6">
      <HugeiconsIcon icon={ImageIcon} strokeWidth={2.25} className="h-5 w-5 text-muted-foreground/50" />
      <p className="text-[10px] text-muted-foreground/70">Screenshot coming soon — {label}</p>
    </div>
  );
}
