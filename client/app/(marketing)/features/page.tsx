"use client";

import React from "react";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon as Sparkles, GlobeIcon as Globe, Brain01Icon as Brain, Search01Icon as Search, Video01Icon as Video, Image01Icon as Image, CodeIcon as Code, StickyNote01Icon as StickyNote, Bookmark01Icon as Bookmark, Shield01Icon as Shield, NetworkIcon as Network, ArrowRight01Icon as ArrowRight } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featuresList = [
  {
    title: "Instant Web Capture",
    description: "Save any article, video, code repository, or design inspiration with a single click using our extension.",
    icon: Globe,
    color: "text-blue-500 bg-blue-500/10"
  },
  {
    title: "AI Auto-Categorization",
    description: "SaveForLatter reads and understands what you save, automatically adding tags and conceptual categories.",
    icon: Sparkles,
    color: "text-primary bg-primary/10"
  },
  {
    title: "Semantic Search",
    description: "Search your memories using normal sentences. Find a website by describing its layouts or colors.",
    icon: Search,
    color: "text-emerald-500 bg-emerald-500/10"
  },
  {
    title: "Ask Your Memory AI",
    description: "An intelligent chatbot assistant that answers your queries using your saved bookmarks as core context.",
    icon: Brain,
    color: "text-purple-500 bg-purple-500/10"
  },
  {
    title: "Screenshot OCR Scanning",
    description: "Drop in screenshots, designs, or photos. SaveForLatter extracts all readable text to make them searchable.",
    icon: Image,
    color: "text-pink-500 bg-pink-500/10"
  },
  {
    title: "Video Transcriptions",
    description: "Save YouTube links or media posts. SaveForLatter indexes video transcripts so you can query key moments.",
    icon: Video,
    color: "text-red-500 bg-red-500/10"
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        
        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4 mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Product Features
          </span>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.15]">
            Everything you save, <br className="hidden sm:block" /> fully searchable.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            SaveForLatter is built for researchers, creators, and developers. A personal library that grows smarter over time.
          </p>
        </div>

        {/* Grid of features (Double Bordered Cards!) */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full group">
                  <div>
                    <div className={cn("p-2 rounded-xl border border-border/40 w-fit mb-6", item.color)}>
                      <HugeiconsIcon icon={Icon} strokeWidth={2.25} className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      <MainFooter />
    </div>
  );
}
