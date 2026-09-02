"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const alsoIncluded = [
  "Search by meaning",
  "Cross-device sync",
  "Organizes itself",
  "Private by default",
  "Search inside screenshots",
  "Instant capture",
];

type FeatureCard = {
  title: string;
  description: string;
  image: string;
  span: "wide" | "narrow";
};

const featureRows: FeatureCard[][] = [
  [
    {
      title: "Save anything, in one tap.",
      description: "Websites, screenshots, videos, or a quick note — capture it before you forget it, from anywhere.",
      image: "/marketing/features/quick-capture.png",
      span: "wide",
    },
    {
      title: "Search that understands you.",
      description: "Describe what you remember. SaveForLatter finds it, even if you don't recall the exact words.",
      image: "/marketing/features/smart-search.png",
      span: "narrow",
    },
  ],
  [
    {
      title: "Organizes itself, automatically.",
      description: "No folders, no tags to maintain. Every memory is understood and structured for you.",
      image: "/marketing/features/auto-organize.png",
      span: "narrow",
    },
    {
      title: "Every format, one place.",
      description: "Websites, videos, notes, screenshots, and more — all living together, all searchable.",
      image: "/marketing/features/all-formats.png",
      span: "narrow",
    },
    {
      title: "Everywhere you are.",
      description: "Web and browser extension today, mobile next — your memory follows you across devices.",
      image: "/marketing/features/everywhere.png",
      span: "narrow",
    },
  ],
];

export default function FeaturesGridSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto flex max-w-6xl flex-col px-6 py-20 bg-background border-t border-border/20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
          Features
        </span>
        <h2 className="mt-6 text-balance font-medium text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
          Everything you need, one tap away.
        </h2>
        <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
          Quick capture, smart search, and automatic organization — built in.
        </p>
      </div>

      {/* Feature bento */}
      <div className="flex flex-col gap-6">
        {featureRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex flex-col gap-6 sm:flex-row">
            {row.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={
                  "group rounded-2xl border border-border/45 bg-muted/75 p-1.5 shadow-xs dark:border-border/65 hover:border-primary/20 hover:shadow-md " +
                  (feature.span === "wide" ? "sm:flex-[3]" : "sm:flex-[2]")
                }
              >
                <div className="flex h-full flex-col rounded-xl border border-border/75 bg-card overflow-hidden">
                  <div className="relative w-full aspect-[16/10] bg-muted/50 overflow-hidden">
                    <motion.div
                      className="absolute inset-0"
                      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </motion.div>
                  </div>

                  <div className="px-6 py-6 text-center">
                    <h3 className="font-semibold text-base tracking-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* Minimal label grid, fabric-style — airy contrast to the cards above */}
      <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
        {alsoIncluded.map((label) => (
          <span
            key={label}
            className="text-center text-sm font-medium text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
