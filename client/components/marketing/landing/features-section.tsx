"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusIcon as Plus, Search01Icon as Search, SparklesIcon as Sparkles, GlobeIcon as Globe, FileTextIcon as FileText, CheckmarkCircle02Icon as CheckCircle2, MagicWand02Icon as Wand2 } from "@hugeicons/core-free-icons";

export default function FeaturesSection() {
  return (
    <section className="relative w-full py-20 md:py-28 bg-background border-t border-border/20">
      
      {/* Background gradients */}
      <div 
        className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30 blur-[100px] dark:opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.08) 0%, rgba(20,71,230,0) 70%)"
        }}
      />
      <div 
        className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30 blur-[100px] dark:opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.08) 0%, rgba(20,71,230,0) 70%)"
        }}
      />

      <div className="mx-auto max-w-6xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            HOW IT WORKS
          </span>
          <h2 className="mt-6 font-medium text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            A second brain that works for you.
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Forget about tagging, categorizing, or filing. Save anything with a single click, and let SaveForLatter handle the rest.
          </p>
        </div>

        {/* Step 1: Save anything */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-12 md:py-16">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">STEP 01</span>
            <h3 className="text-3xl font-medium text-foreground tracking-tight">
              Save anything. <span className="text-muted-foreground">One click from anywhere.</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Capture articles, recipes, bookmarks, YouTube videos, camera roll screenshots, or quick thoughts. Our browser extension and mobile app save everything instantly into a unified inbox.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80 bg-muted px-2.5 py-1 rounded-full border border-border/40">
                <HugeiconsIcon icon={Globe} strokeWidth={2.25} className="h-3 w-3 text-primary" /> Chrome Extension
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80 bg-muted px-2.5 py-1 rounded-full border border-border/40">
                📱 iOS & Android Apps
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80 bg-muted px-2.5 py-1 rounded-full border border-border/40">
                ⚡ Global Hotkey
              </span>
            </div>
          </div>
          <div className="lg:col-span-7">
            {/* Visual: Browser Extension Mockup */}
            <div className="p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-lg overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="text-[10px] text-muted-foreground bg-muted/60 px-6 py-0.5 rounded-md border border-border/20 w-1/2 text-center truncate">
                  saveforlatter.com/blog/building-a-second-brain
                </div>
                <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 space-y-2.5">
                  <div className="h-4 w-1/3 bg-muted rounded" />
                  <div className="h-8 w-full bg-muted rounded" />
                  <div className="space-y-1.5 pt-2">
                    <div className="h-3.5 w-full bg-muted/50 rounded" />
                    <div className="h-3.5 w-[90%] bg-muted/50 rounded" />
                    <div className="h-3.5 w-[95%] bg-muted/50 rounded" />
                  </div>
                </div>
                {/* Floating Save Widget */}
                <div className="col-span-4 bg-background border border-primary/30 rounded-xl p-3 shadow-md relative animate-[pulse-glow_4s_ease-in-out_infinite] self-start">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                    <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    SAVEFORLATTER
                  </div>
                  <p className="text-[11px] font-medium text-foreground mt-2 truncate">Building a second brain</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Article saved successfully.</p>
                  <button className="mt-3 w-full bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                    <HugeiconsIcon icon={Plus} strokeWidth={2.25} className="h-3 w-3" /> Add Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: SaveForLatter understands it */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-12 md:py-16">
          <div className="lg:col-span-7 order-last lg:order-first">
            {/* Visual: AI Context Extraction mockup */}
            <div className="p-5 rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <HugeiconsIcon icon={Wand2} strokeWidth={2.25} className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">AI Auto-Extraction</h4>
                    <p className="text-[9px] text-muted-foreground">Analyzing new items in background</p>
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                  Done
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Task item 1 */}
                <div className="flex items-start justify-between p-2.5 rounded-xl bg-background/50 border border-border/30">
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={CheckCircle2} strokeWidth={2.25} className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-foreground">Extracting Article Summary</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Generated key takeaways & readability optimizations.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground shrink-0">0.4s</span>
                </div>

                {/* Task item 2 */}
                <div className="flex items-start justify-between p-2.5 rounded-xl bg-background/50 border border-border/30">
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={CheckCircle2} strokeWidth={2.25} className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-foreground">Generating Auto-Tags</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Applied: #productivity #reading-notes #ai-tools</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground shrink-0">0.2s</span>
                </div>

                {/* Task item 3 */}
                <div className="flex items-start justify-between p-2.5 rounded-xl bg-background/50 border border-border/30">
                  <div className="flex gap-2">
                    <HugeiconsIcon icon={CheckCircle2} strokeWidth={2.25} className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-foreground">Screenshot OCR Text Recognition</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Indexed 154 words of image text.</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground shrink-0">0.6s</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">STEP 02</span>
            <h3 className="text-3xl font-medium text-foreground tracking-tight">
              SaveForLatter understands it. <span className="text-muted-foreground">AI auto-extracts context.</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Once saved, our background AI goes to work. It strips ads, captures a pristine readable text layout, transcribes video audio, reads text inside screenshots using OCR, and creates concise bulleted summaries automatically.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-sm text-foreground/80">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Auto-Generated Summaries & Highlights
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Full-Text PDF & Screenshot Indexing
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Video Transcripts & Chapter Outlines
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Find it when you need it */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center py-12 md:py-16">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">STEP 03</span>
            <h3 className="text-3xl font-medium text-foreground tracking-tight">
              Find it when you need it. <span className="text-muted-foreground">Search by what you remember.</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You don't need to remember file names or tags. Search by typing what you remember: "What was the name of that article on productivity with a blue banner?" or "What tools did that video mention?". SaveForLatter queries your semantic brain instantly.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-sm text-foreground/80">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Natural Language Semantic Search
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Multi-format Results (Text, Video, Image)
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Ask SaveForLatter (AI chatbot querying your data)
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            {/* Visual: Search results mockup */}
            <div className="p-5 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-lg space-y-4">
              {/* Search Bar */}
              <div className="relative flex items-center">
                <HugeiconsIcon icon={Search} strokeWidth={2.25} className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <div className="w-full text-xs bg-background/90 text-foreground border border-border/70 pl-10 pr-4 py-2.5 rounded-full shadow-xs">
                  "productivity book recommendations with blue cover"
                </div>
              </div>
              
              {/* Result items */}
              <div className="space-y-3">
                <div className="p-3 bg-background/80 border border-primary/20 rounded-xl shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-primary uppercase">Best Match (98% Relevance)</span>
                    <span className="text-[9px] text-muted-foreground">Saved 12 days ago</span>
                  </div>
                  <h5 className="text-xs font-semibold text-foreground">Building a Second Brain - Tiago Forte</h5>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    "...a digital system to capture ideas, organize them, and make them easily searchable. Book cover features a distinct blue background with orange lettering..."
                  </p>
                </div>

                <div className="p-3 bg-background/50 border border-border/30 rounded-xl space-y-1 opacity-70">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Reference Match</span>
                    <span className="text-[9px] text-muted-foreground">Saved 1 month ago</span>
                  </div>
                  <h5 className="text-xs font-medium text-foreground">My Reading List 2026 (Note)</h5>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Includes Tiago Forte's book on building a second brain, which covers productivity workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
