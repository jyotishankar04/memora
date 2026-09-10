import { cn } from "@/lib/utils";

/**
 * Text-only wordmark — no icon mark. "for" is de-emphasized (smaller,
 * lighter weight, accent color) so it reads as a connector between the two
 * verbs that actually name the product, "save" and "latter".
 */
export function Logo({ className, forClassName = "text-primary" }: { className?: string; forClassName?: string }) {
  return (
    <span className={cn("font-semibold tracking-[-0.03em] select-none whitespace-nowrap", className)}>
      save
      <span className={cn("font-normal text-[0.78em] align-baseline mx-[0.02em]", forClassName)}>for</span>
      latter
    </span>
  );
}
