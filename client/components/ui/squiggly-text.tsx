"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface SquigglyTextProps {
  children: React.ReactNode;
  className?: string;
  /** Displacement intensity. A single number holds steady; a [min, max] range breathes between them. */
  scale?: number | [number, number];
  /** Milliseconds between re-seeding the turbulence noise — lower is a faster, jumpier wobble. */
  stepDuration?: number;
}

export function SquigglyText({ children, className, scale = 5, stepDuration = 100 }: SquigglyTextProps) {
  const reactId = React.useId();
  const filterId = `squiggly-${reactId.replace(/[:]/g, "")}`;
  const reduceMotion = useReducedMotion();
  const [seed, setSeed] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => setSeed((s) => (s + 1) % 1000), stepDuration);
    return () => clearInterval(interval);
  }, [stepDuration, reduceMotion]);

  const [minScale, maxScale] = Array.isArray(scale) ? scale : [scale, scale];
  const displacement = reduceMotion
    ? (minScale + maxScale) / 2
    : minScale + ((Math.sin(seed / 6) + 1) / 2) * (maxScale - minScale);

  return (
    <span className={cn("relative inline-block", className)} style={{ filter: `url(#${filterId})` }}>
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={displacement} />
        </filter>
      </svg>
      {children}
    </span>
  );
}
