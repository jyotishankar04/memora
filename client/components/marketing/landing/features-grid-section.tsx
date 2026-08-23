"use client";

import React from "react";
import { Zap, Bookmark, StickyNote, FolderOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Quick Capture",
    promise: "Save it before you forget it.",
    description: "Save any link, screenshot, note, or reference instantly from your browser or mobile phone share sheet.",
    icon: Zap,
    href: "/features/quick-capture",
  },
  {
    title: "Bookmarks",
    promise: "Your bookmarks shouldn't be a graveyard.",
    description: "Keep every important website categorized and easily retrievable using natural language semantic queries.",
    icon: Bookmark,
    href: "/features/bookmarks",
  },
  {
    title: "Notes",
    promise: "Catch the thought before it disappears.",
    description: "Jot down ideas, snippets, and observations alongside the rest of your curated web memories.",
    icon: StickyNote,
    href: "/features/notes",
  },
  {
    title: "Collections",
    promise: "Bring related memories together.",
    description: "Assemble spaces for specific projects, topics, and research, and let AI discover linked trends.",
    icon: FolderOpen,
    href: "/features/collections",
  },
];

export default function FeaturesGridSection() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col px-6 py-20 bg-background border-t border-border/20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
          Core Features
        </span>
        <h2 className="mt-6 text-balance font-medium text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
          Everything you save. Connected.
        </h2>
        <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
          Four features working together to capture, organize, and surface your digital memory.
        </p>
      </div>

      {/* Grid of 4 Feature Cards (Double Bordered Cards!) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:border-primary/20 transition-all duration-300 group"
            key={index}
          >
            <div className="flex h-full flex-col rounded-lg border border-border/75 bg-card px-5 py-6 justify-between min-h-[220px]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="font-semibold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                </div>
                
                <span className="text-[10px] font-bold text-primary block mt-4 leading-none">
                  {feature.promise}
                </span>
                
                <p className="my-3 text-muted-foreground text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <Button
                render={<Link href={feature.href} />}
                nativeButton={false}
                className="me-auto mt-4 h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1"
                size="sm"
                variant="secondary"
              >
                Learn more <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
