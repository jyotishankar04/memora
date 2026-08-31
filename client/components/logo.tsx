import { cn } from "@/lib/utils";

/**
 * Text-only wordmark — no icon mark. "for" is de-emphasized (smaller,
 * lighter weight, accent color) so it reads as a connector between the two
 * verbs that actually name the product, "save" and "latter".
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-semibold tracking-[-0.03em] select-none whitespace-nowrap", className)}>
      save
      <span className="text-primary font-normal text-[0.78em] align-baseline mx-[0.02em]">for</span>
      latter
    </span>
  );
}
