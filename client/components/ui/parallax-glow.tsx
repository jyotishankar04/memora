"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The blurred radial-gradient glow blob repeated across marketing sections
 * (see content-types-section.tsx etc) — drifts vertically with scroll for a
 * subtle parallax feel instead of sitting static. Drop-in replacement for
 * that div: pass the same sizing/opacity/blur classes via `className`.
 */
export function ParallaxGlow({
  className,
  alpha = 0.06,
  speed = 50,
}: {
  /** Sizing/opacity/blur utility classes, e.g. "w-[700px] h-[500px] opacity-20 blur-[130px] dark:opacity-5". */
  className?: string;
  /** Radial-gradient center alpha (0-1) — matches each section's original intensity. */
  alpha?: number;
  /** Total px of vertical drift across the element's scroll-through range. */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const transform = useTransform(rawY, (v) => `translate(-50%, calc(-50% + ${v}px))`);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{
        transform: reduceMotion ? "translate(-50%, -50%)" : transform,
        backgroundImage: `radial-gradient(circle, rgba(20,71,230,${alpha}) 0%, rgba(20,71,230,0) 70%)`,
      }}
      className={cn("absolute top-1/2 left-1/2 rounded-full pointer-events-none", className)}
    />
  );
}
