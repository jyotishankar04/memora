"use client";

import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { GlobeIcon as Globe, Video01Icon as Video, ChefHatIcon as ChefHat, Image01Icon as ImageIcon, FileTextIcon as FileText, StickyNote01Icon as StickyNote } from "@hugeicons/core-free-icons";
import { Carousel, Card, type CarouselCard } from "@/components/ui/apple-cards-carousel";
import { ParallaxGlow } from "@/components/ui/parallax-glow";

const items: {
  category: string;
  title: string;
  desc: string;
  icon: typeof Globe;
  pill: string;
  /** Base filename under /marketing/content-types/ — {name}-light.png and {name}-dark.png both exist. */
  image: string;
}[] = [
  {
    category: "Websites",
    title: "Save inspiration for later.",
    desc: "Any page you land on — a design you liked, a tool you meant to try, a thread you didn't finish reading. One tap, and it's yours to find again.",
    icon: Globe,
    pill: "bg-blue-500/10 text-blue-600 border-blue-500/10",
    image: "websites",
  },
  {
    category: "Videos",
    title: "Keep the parts worth coming back to.",
    desc: "A recipe demo, a tutorial, a talk you want to rewatch. SaveForLatter keeps the link and the timestamp, so you land right back where it mattered.",
    icon: Video,
    pill: "bg-red-500/10 text-red-600 border-red-500/10",
    image: "videos",
  },
  {
    category: "Recipes",
    title: "Save the recipe, skip the life story.",
    desc: "SaveForLatter pulls out the ingredients and steps automatically, so a recipe you saved months ago is still just as quick to cook from.",
    icon: ChefHat,
    pill: "bg-orange-500/10 text-orange-600 border-orange-500/10",
    image: "recipes",
  },
  {
    category: "Screenshots",
    title: "Turn visual references into searchable memories.",
    desc: "Text inside a screenshot — a code snippet, an error message, a receipt — gets read automatically, so it shows up in search like anything else.",
    icon: ImageIcon,
    pill: "bg-purple-500/10 text-purple-600 border-purple-500/10",
    image: "screenshots",
  },
  {
    category: "Articles",
    title: "Keep the ideas, not just the URL.",
    desc: "SaveForLatter reads the piece and writes a short summary, so weeks later you remember why you saved it without rereading the whole thing.",
    icon: FileText,
    pill: "bg-amber-500/10 text-amber-600 border-amber-500/10",
    image: "articles",
  },
  {
    category: "Notes",
    title: "Capture the thought before it disappears.",
    desc: "A quick idea, a reminder, a line worth keeping. Type it once — SaveForLatter tags and files it alongside everything else automatically.",
    icon: StickyNote,
    pill: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10",
    image: "notes",
  },
];

/**
 * CSS-only light/dark swap (no theme-detection flicker) — mirrors the
 * pattern used for favicons/logos elsewhere. The source illustrations are
 * a small tilted card centered on a lot of flat background (matching the
 * existing marketing-image style), so a plain object-cover leaves that
 * background visible as padding around the subject — scaled up here to
 * crop it out and let the illustration fill the card edge-to-edge.
 */
function CardBackground({ image, title }: { image: string; title: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white dark:bg-[#1c1c1c]">
      <Image
        src={`/marketing/content-types/${image}-light.png`}
        alt={title}
        fill
        sizes="(min-width: 768px) 320px, 224px"
        className="scale-[1.6] object-cover blur-[3px] dark:hidden"
      />
      <Image
        src={`/marketing/content-types/${image}-dark.png`}
        alt={title}
        fill
        sizes="(min-width: 768px) 320px, 224px"
        className="hidden scale-[1.6] object-cover blur-[3px] dark:block"
      />
    </div>
  );
}

function CardContent({ item }: { item: (typeof items)[number] }) {
  const Icon = item.icon;
  return (
    <div className="space-y-6">
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${item.pill}`}>
        <HugeiconsIcon icon={Icon} strokeWidth={2.25} className="h-6 w-6" />
      </div>
      <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
    </div>
  );
}

export default function ContentTypesSection() {
  const cards: CarouselCard[] = items.map((item) => ({
    category: item.category,
    title: item.title,
    background: <CardBackground image={item.image} title={item.title} />,
    content: <CardContent item={item} />,
  }));

  return (
    <section className="relative w-full py-20 md:py-28 bg-background overflow-hidden border-t border-border/20">

      {/* Background glow */}
      <ParallaxGlow className="w-[700px] h-[500px] opacity-20 blur-[130px] dark:opacity-5" />

      <div className="relative">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            BUILT FOR EVERYTHING
          </span>
          <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
            However you discover it, SaveForLatter remembers.
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-base md:text-lg">
            Every format is formatted, indexed, and semantic-search optimized automatically.
          </p>

          {/* Inline colored-pill sentence, mymind-style */}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-sm text-muted-foreground">
            <span>All your</span>
            {items.map((item) => (
              <span
                key={item.category}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${item.pill}`}
              >
                {item.category.toLowerCase()}
              </span>
            ))}
            <span>in one searchable place.</span>
          </p>
        </div>

        {/* Tap a card to see how SaveForLatter treats that format */}
        <Carousel
          items={cards.map((card, index) => (
            <Card key={card.title} card={card} index={index} />
          ))}
        />

      </div>
    </section>
  );
}
