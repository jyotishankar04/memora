"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobeIcon as Globe, SmartPhone01Icon as Smartphone, LaptopIcon as Laptop, PuzzleIcon as Puzzle, MonitorIcon as Monitor, AppleIcon as Apple } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ParallaxGlow } from "@/components/ui/parallax-glow";

type Availability = "available" | "soon";

type Platform = {
  name: string;
  desc: string;
  icon: IconSvgElement;
  status: Availability;
  span: "wide" | "narrow";
};

// Bento rows, laid out to match the real rollout: web + extension are live,
// iOS / Android / desktop are on the roadmap.
const platformRows: Platform[][] = [
  [
    {
      name: "Web dashboard, live today.",
      desc: "The full experience in your browser — capture, search, and organize from any device.",
      icon: Monitor,
      status: "available",
      span: "wide",
    },
    {
      name: "Chrome extension, ready now.",
      desc: "Save anything with one click, right from the page you're on.",
      icon: Puzzle,
      status: "available",
      span: "narrow",
    },
  ],
  [
    {
      name: "iOS app, coming soon.",
      desc: "A native iPhone app is in the works for capture on the go.",
      icon: Apple,
      status: "soon",
      span: "narrow",
    },
    {
      name: "Android app, coming soon.",
      desc: "A native Android app is in the works for capture on the go.",
      icon: Smartphone,
      status: "soon",
      span: "narrow",
    },
  ],
  [
    {
      name: "Desktop app, on the roadmap.",
      desc: "A native desktop app is planned next — not yet available.",
      icon: Laptop,
      status: "soon",
      span: "wide",
    },
  ],
];

export default function PlatformAvailabilitySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">

      {/* Background glow */}
      <ParallaxGlow className="w-[700px] h-[500px] opacity-20 blur-[130px] dark:opacity-5" />

      <div className="mx-auto max-w-6xl px-6 relative">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            PLATFORMS
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            One memory, every platform.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            Live on web and Chrome today. Mobile and desktop are next.
          </p>
        </div>

        {/* Platform availability bento */}
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          {platformRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-col gap-4 sm:flex-row">
              {row.map((platform) => {
                const Icon = platform.icon;
                return (
                  <motion.div
                    key={platform.name}
                    whileHover={reduceMotion ? undefined : { y: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className={cn(
                      "group relative rounded-2xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:shadow-md",
                      platform.span === "wide" ? "sm:flex-[3]" : "sm:flex-[2]"
                    )}
                  >
                    <div className="flex h-full flex-col items-center rounded-xl border border-border/75 bg-card px-6 py-8 text-center">
                      {/* Status pill */}
                      <span
                        className={cn(
                          "absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                          platform.status === "available"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-border/60 bg-muted text-muted-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            platform.status === "available" ? "bg-emerald-500" : "bg-muted-foreground/50"
                          )}
                        />
                        {platform.status === "available" ? "Available" : "Coming soon"}
                      </span>

                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-background/60 text-muted-foreground/80 mb-5 mt-2 transition-colors duration-200 group-hover:border-primary/30 group-hover:text-primary">
                        <HugeiconsIcon icon={Icon} strokeWidth={2.25} className="h-7 w-7 stroke-[1.5]" />
                      </div>

                      <h4 className="text-sm font-semibold text-foreground">{platform.name}</h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs">
                        {platform.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
