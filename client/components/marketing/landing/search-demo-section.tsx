"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon as Search, GlobeIcon as Globe, FileTextIcon as FileText, Image01Icon as ImageIcon, ChevronRightIcon as ChevronRight, SparklesIcon as Sparkles } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TypewriterEffect, type TypewriterWord } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { ParallaxGlow } from "@/components/ui/parallax-glow";

type ResultKind = "WEBSITE" | "ARTICLE" | "SCREENSHOT";

type SearchResult = {
  kind: ResultKind;
  domain: string;
  title: string;
  description: string;
  path: string;
  active: boolean;
};

type SearchDemo = {
  pill: string;
  words: TypewriterWord[];
  count: number;
  results: SearchResult[];
  tags: string[];
};

const highlight = "text-primary font-semibold underline decoration-primary/45 decoration-2 underline-offset-4";

const searchDemos: SearchDemo[] = [
  {
    pill: "that pasta recipe I saved last week",
    words: [
      { text: "that" },
      { text: "pasta", className: highlight },
      { text: "recipe", className: highlight },
      { text: "I" },
      { text: "saved" },
      { text: "last" },
      { text: "week" },
    ],
    count: 9,
    results: [
      {
        kind: "WEBSITE",
        domain: "bonappetit.com",
        title: "Creamy garlic pasta",
        description: "A 20-minute weeknight dinner with a simple parmesan cream sauce.",
        path: "bonappetit.com/recipes",
        active: true,
      },
      {
        kind: "WEBSITE",
        domain: "seriouseats.com",
        title: "The best carbonara",
        description: "Classic Roman technique — no cream needed, just eggs and cheese.",
        path: "seriouseats.com/carbonara",
        active: false,
      },
      {
        kind: "SCREENSHOT",
        domain: "Screenshot",
        title: "Grandma's lasagna notes",
        description: "Captured from a text message — layers, bake time, and oven temp.",
        path: "pasted 2 weeks ago",
        active: false,
      },
    ],
    tags: ["Recipes", "Pasta", "Dinner", "Italian"],
  },
  {
    pill: "that apartment decor I liked",
    words: [
      { text: "that" },
      { text: "apartment", className: highlight },
      { text: "decor", className: highlight },
      { text: "I" },
      { text: "liked" },
    ],
    count: 14,
    results: [
      {
        kind: "WEBSITE",
        domain: "pinterest.com",
        title: "Small living room ideas",
        description: "Cozy layouts for compact spaces with warm, layered lighting.",
        path: "pinterest.com/decor",
        active: false,
      },
      {
        kind: "WEBSITE",
        domain: "houzz.com",
        title: "Neutral apartment palette",
        description: "Beige, cream, and walnut tones that feel calm and lived-in.",
        path: "houzz.com/palette",
        active: true,
      },
      {
        kind: "ARTICLE",
        domain: "apartmenttherapy.com",
        title: "Small-space storage tricks",
        description: "Clever shelving and furniture ideas for tight apartments.",
        path: "apartmenttherapy.com/storage",
        active: false,
      },
    ],
    tags: ["Home decor", "Apartment", "Cozy", "Living room"],
  },
  {
    pill: "everything I saved about my Japan trip",
    words: [
      { text: "everything" },
      { text: "I" },
      { text: "saved" },
      { text: "about" },
      { text: "my" },
      { text: "Japan", className: highlight },
      { text: "trip", className: highlight },
    ],
    count: 19,
    results: [
      {
        kind: "ARTICLE",
        domain: "japan-guide.com",
        title: "7-day Tokyo to Kyoto itinerary",
        description: "A relaxed route covering temples, food streets, and day trips.",
        path: "japan-guide.com/itinerary",
        active: true,
      },
      {
        kind: "WEBSITE",
        domain: "booking.com",
        title: "Ryokan near Kyoto station",
        description: "Traditional stay with a hot spring bath and breakfast included.",
        path: "booking.com/kyoto",
        active: false,
      },
      {
        kind: "SCREENSHOT",
        domain: "Screenshot",
        title: "Packing checklist",
        description: "Captured from Notes — weather, adapters, and the JR pass reminder.",
        path: "pasted 5 days ago",
        active: false,
      },
    ],
    tags: ["Japan", "Travel", "Itinerary", "Kyoto"],
  },
  {
    pill: "that screenshot with the shoes",
    words: [
      { text: "that" },
      { text: "screenshot" },
      { text: "with" },
      { text: "the" },
      { text: "shoes", className: highlight },
    ],
    count: 7,
    results: [
      {
        kind: "SCREENSHOT",
        domain: "Screenshot",
        title: "New Balance 990 in grey",
        description: "Captured from Instagram — size 9, sold out in most stores.",
        path: "pasted yesterday",
        active: true,
      },
      {
        kind: "WEBSITE",
        domain: "nordstrom.com",
        title: "Everyday sneakers",
        description: "Comfortable picks for walking, from casual to dressy.",
        path: "nordstrom.com/sneakers",
        active: false,
      },
      {
        kind: "WEBSITE",
        domain: "zappos.com",
        title: "Best running shoes 2026",
        description: "Editor picks for cushioning, support, and everyday wear.",
        path: "zappos.com/running",
        active: false,
      },
    ],
    tags: ["Shoes", "Shopping", "Wishlist", "Sneakers"],
  },
  {
    pill: "articles about intermittent fasting",
    words: [
      { text: "articles" },
      { text: "about" },
      { text: "intermittent", className: highlight },
      { text: "fasting", className: highlight },
    ],
    count: 5,
    results: [
      {
        kind: "ARTICLE",
        domain: "healthline.com",
        title: "Beginner's guide to fasting",
        description: "What to expect in your first two weeks, and common mistakes.",
        path: "healthline.com/fasting",
        active: true,
      },
      {
        kind: "ARTICLE",
        domain: "nytimes.com",
        title: "Does intermittent fasting work?",
        description: "A look at the research behind the trend, explained simply.",
        path: "nytimes.com/wellness",
        active: false,
      },
      {
        kind: "WEBSITE",
        domain: "reddit.com",
        title: "Real experiences and schedules",
        description: "What actually worked for other people, in their own words.",
        path: "reddit.com/fasting",
        active: false,
      },
    ],
    tags: ["Fasting", "Health", "Wellness", "Nutrition"],
  },
];

const kindIcon: Record<ResultKind, IconSvgElement> = {
  WEBSITE: Globe,
  ARTICLE: FileText,
  SCREENSHOT: ImageIcon,
};

// Timing mirrors TypewriterEffect's own duration formula so the "holding"
// phase kicks in exactly when the typed text finishes on screen.
const TYPE_MS_PER_CHAR = 35;
const TYPE_MIN_MS = 300;
const DELETE_MS_PER_CHAR = 18;
const DELETE_MIN_MS = 200;
const HOLD_START_DELAY_MS = 300;
const SPOTLIGHT_STEP_MS = 750;
const HOLD_BUFFER_MS = 500;
const PAUSE_POLL_MS = 300;

type DemoPhase = "typing" | "holding" | "deleting";

/** Drives an autoplaying type -> spotlight-sweep -> backspace -> next-query loop, pausable via a ref. */
function useAutoplaySearchDemo(demos: SearchDemo[], isPausedRef: React.RefObject<boolean>) {
  const [selectedIndex, setSelectedIndex] = React.useState(1); // default active query
  const [phase, setPhase] = React.useState<DemoPhase>("typing");
  const [spotlightIndex, setSpotlightIndex] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const after = (ms: number, fn: () => void) => {
      timers.push(setTimeout(() => { if (!cancelled) fn(); }, ms));
    };

    const demo = demos[selectedIndex];
    const totalChars = demo.words.reduce((sum, w) => sum + w.text.length, 0);
    const typeMs = Math.max(totalChars * TYPE_MS_PER_CHAR, TYPE_MIN_MS);
    const deleteMs = Math.max(totalChars * DELETE_MS_PER_CHAR, DELETE_MIN_MS);

    // Timer-driven animation phase can't be derived at render time — it has to be
    // reset here, at the start of the timeline this same effect schedules below.
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setPhase("typing");
    setSpotlightIndex(0);

    after(typeMs + HOLD_START_DELAY_MS, () => setPhase("holding"));
    demo.results.forEach((_, i) => {
      after(typeMs + HOLD_START_DELAY_MS + i * SPOTLIGHT_STEP_MS, () => setSpotlightIndex(i));
    });

    const holdEnd =
      typeMs + HOLD_START_DELAY_MS + demo.results.length * SPOTLIGHT_STEP_MS + HOLD_BUFFER_MS;

    const beginDelete = (elapsed: number) => {
      after(elapsed, () => {
        if (isPausedRef.current) {
          beginDelete(PAUSE_POLL_MS);
          return;
        }
        setPhase("deleting");
        after(deleteMs, () => setSelectedIndex((prev) => (prev + 1) % demos.length));
      });
    };
    beginDelete(holdEnd);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [selectedIndex, demos, isPausedRef]);

  return { selectedIndex, setSelectedIndex, phase, spotlightIndex };
}

export default function SearchDemoSection() {
  const isPausedRef = React.useRef(false);
  const { selectedIndex, setSelectedIndex, phase, spotlightIndex } = useAutoplaySearchDemo(searchDemos, isPausedRef);
  const demo = searchDemos[selectedIndex];

  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">

      {/* Subtle blue accent background glow */}
      <ParallaxGlow className="w-[700px] h-[500px] opacity-20 blur-[130px] dark:opacity-5" alpha={0.08} />

      <div className="mx-auto max-w-6xl px-6 relative">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            SEARCH YOUR MEMORY
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            You don't need to remember where you saved it.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            Just describe what you're looking for. SaveForLatter understands the meaning behind your memories, not just the words.
          </p>
        </div>

        {/* Search App Interface Wrapper — hover pauses the autoplay loop */}
        <div
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card shadow-[0_16px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.2)] overflow-hidden"
        >

          {/* Mock App Header / Tab Bar */}
          <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              SAVEFORLATTER WEB APP v1.0
            </div>
            <div className="w-10" />
          </div>

          {/* Actual Search Box Component */}
          <div className="p-6 md:p-8 space-y-6">

            {/* Search Input Container */}
            <div className="relative flex items-center">
              <HugeiconsIcon icon={Search} strokeWidth={2.25} className="absolute left-4 h-5 w-5 text-primary stroke-[2.5] z-10" />
              <div className="w-full text-sm md:text-base bg-background text-foreground border border-border rounded-xl pl-12 pr-4 py-3.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary min-h-[3.25rem] flex items-center">
                <TypewriterEffect
                  key={selectedIndex}
                  words={demo.words}
                  direction={phase === "deleting" ? "out" : "in"}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: phase === "deleting" ? 0 : 1,
                  y: phase === "deleting" ? -8 : 0,
                }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground tracking-wide">
                    {demo.count} memories found
                  </span>
                  <div className="h-px flex-1 bg-border/40 mx-4" />
                </div>

                {/* Grid of Results — each card reads differently by memory kind, mymind-style */}
                <HoverEffect
                  className="items-start"
                  items={demo.results.map((result, idx) => {
                    const Icon = kindIcon[result.kind];
                    const spotlighted = phase === "holding" && spotlightIndex === idx;
                    return {
                      id: idx,
                      content: (
                        <motion.div
                          animate={{ scale: spotlighted ? 1.035 : 1 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className={cn(
                            "rounded-xl border p-1 transition-all duration-300",
                            spotlighted
                              ? "shadow-lg shadow-primary/10"
                              : "",
                            result.active
                              ? "border-primary/30 bg-primary/5 shadow-xs"
                              : "border-border/45 bg-muted/75"
                          )}
                        >
                          <div
                            className={cn(
                              "p-4 rounded-lg border bg-card flex flex-col transition-all duration-300 relative group",
                              result.active
                                ? "border-primary/40 shadow-xs"
                                : "border-border/75 hover:border-primary/30"
                            )}
                          >
                            {result.active && (
                              <div className="absolute top-3.5 right-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
                            )}

                            <div>
                              {/* Card Category Header */}
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground tracking-wider uppercase mb-3">
                                <HugeiconsIcon icon={Icon} strokeWidth={2.25} className="h-3 w-3 text-muted-foreground/80" />
                                <span>{result.kind}</span>
                                <span className="text-border/60">&middot;</span>
                                <span className="normal-case font-medium">{result.domain}</span>
                              </div>

                              {result.kind === "SCREENSHOT" && (
                                <div className="mb-3 h-16 rounded-md border border-border/50 bg-gradient-to-br from-primary/25 via-fuchsia-400/15 to-amber-300/20 flex items-center justify-center">
                                  <HugeiconsIcon icon={ImageIcon} strokeWidth={2.25} className="h-5 w-5 text-foreground/40" />
                                </div>
                              )}

                              <h4 className={cn(
                                "text-sm font-semibold transition-colors",
                                result.active ? "text-primary" : "text-foreground group-hover:text-primary"
                              )}>
                                {result.title}
                              </h4>

                              {result.kind === "ARTICLE" ? (
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed italic before:content-['\201C'] after:content-['\201D']">
                                  {result.description}
                                </p>
                              ) : (
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                  {result.description}
                                </p>
                              )}
                            </div>

                            <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/20">
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {result.path}
                              </span>
                              <HugeiconsIcon icon={ChevronRight} strokeWidth={2.25} className="h-3.5 w-3.5 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </motion.div>
                      ),
                    };
                  })}
                />

                {/* AI Reasoning explanation box (Double Bordered as well!) */}
                <div className="rounded-xl border border-primary/25 bg-muted/50 p-1">
                  <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-3">
                    <div className="h-5 w-5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-3 w-3 fill-current" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">
                      <TextGenerateEffect
                        words="SaveForLatter found these because they match:"
                        className="font-semibold text-foreground mr-1"
                        startDelay={0.6}
                      />
                      <span className="inline-flex gap-1.5 flex-wrap mt-1 md:mt-0">
                        {demo.tags.map((tag, idx) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.1 + idx * 0.08, duration: 0.25 }}
                            className="bg-primary/10 text-primary border border-primary/10 px-2 py-0.5 rounded-md text-[10px] font-medium"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Example Search pills below interface */}
        <div className="mt-12 text-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Try searching for
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {searchDemos.map((item, idx) => (
              <button
                key={item.pill}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all duration-200",
                  idx === selectedIndex
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/80 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                "{item.pill}"
              </button>
            ))}
          </div>
        </div>

        {/* Section Ending Centered */}
        <div className="mt-20 text-center">
          <p className="text-xl md:text-2xl font-medium tracking-tight text-foreground/90">
            Search less. <span className="text-primary font-semibold">Remember more.</span>
          </p>
        </div>

      </div>
    </section>
  );
}
