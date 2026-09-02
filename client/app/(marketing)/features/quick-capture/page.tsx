"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon as Sparkles, ArrowRight01Icon as ArrowRight, ArrowLeft01Icon as ArrowLeft, PlusIcon as Plus, GlobeIcon as Globe, SmartPhone01Icon as Smartphone, LaptopIcon as Laptop, StickyNote01Icon as StickyNote, Video01Icon as Video, Image01Icon as Image, CodeIcon as Code, ArrowUpRight01Icon as ArrowUpRight, ZapIcon as Zap } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Shared Related Features Navigator Component
export function FeaturesNavigator({ current }: { current: string }) {
  const items = [
    { id: "quick-capture", label: "Quick Capture", path: "/features/quick-capture", desc: "Save it before you forget it." },
    { id: "bookmarks", label: "Bookmarks", path: "/features/bookmarks", desc: "Your bookmarks shouldn't be a graveyard." },
    { id: "notes", label: "Notes", path: "/features/notes", desc: "Catch the thought before it disappears." },
    { id: "collections", label: "Collections", path: "/features/collections", desc: "Bring related memories together." },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16 border-t border-border/20">
      <h4 className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-8">
        Explore more features
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const isCurrent = item.id === current;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "rounded-xl border p-0.5 transition-all select-none text-left group",
                isCurrent 
                  ? "border-primary/45 bg-primary/5 cursor-default pointer-events-none" 
                  : "border-border/45 bg-muted/75 dark:border-border/65 hover:border-primary/20"
              )}
            >
              <div
                className={cn(
                  "p-4 rounded-lg border bg-card flex flex-col justify-between h-full min-h-[110px]",
                  isCurrent ? "border-primary/50" : "border-border/75"
                )}
              >
                <div>
                  <h5 className={cn("text-xs font-bold", isCurrent ? "text-primary" : "text-foreground group-hover:text-primary transition-colors")}>
                    {item.label}
                  </h5>
                  <p className="text-[9px] text-muted-foreground mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                {!isCurrent && (
                  <span className="text-[9px] font-bold text-primary flex items-center gap-0.5 mt-4 group-hover:translate-x-0.5 transition-transform">
                    Learn more <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-3 w-3" />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function QuickCapturePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-32 pb-20 bg-background flex flex-col items-center justify-center border-b border-border/20">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-20 blur-[130px]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.05) 0%, rgba(20,71,230,0) 70%)" }}
        />

        <div className="mx-auto max-w-4xl px-6 relative text-center space-y-6 flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            QUICK CAPTURE
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            Save it before you forget it.
          </h1>
          
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            A great idea shouldn't require five steps to save. Capture links, notes, screenshots, videos, and anything else in seconds.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button
              render={<Link href="/auth/signup" />}
              nativeButton={false}
              className="h-10 px-6 rounded-full font-semibold text-xs bg-primary text-white hover:bg-primary/95"
            >
              Start Capturing <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-3.5 w-3.5" />
            </Button>
            
            <Button
              render={<a href="#value-grid" />}
              nativeButton={false}
              className="h-10 px-6 rounded-full font-semibold text-xs border border-border/60"
              variant="outline"
            >
              See how it works
            </Button>
          </div>

          {/* Large Centered Quick Capture Composer Mockup (Double Bordered!) */}
          <div className="w-full max-w-lg pt-12">
            <div className="rounded-2xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
              <div className="p-6 md:p-8 rounded-xl border border-border/75 bg-card text-left space-y-6">
                
                <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                  <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-4 w-4 fill-current animate-pulse" />
                  <span>Quick Capture</span>
                </div>

                <div className="w-full bg-background border border-border/75 rounded-xl p-4 text-xs text-muted-foreground/60 min-h-[100px] leading-relaxed">
                  Paste a link, write a thought, or drop something here...
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[9px] font-mono text-muted-foreground flex gap-1 select-none">
                    <span>Chrome</span> &rarr; <span>Instagram</span> &rarr; <span>YouTube</span> &rarr; <span>GitHub</span> &rarr; <span>SaveForLatter</span>
                  </div>
                  <kbd className="px-2 py-1 border border-border bg-muted rounded text-[10px] font-mono select-none font-bold">Save ↵</kbd>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. VALUE SECTION */}
      <section id="value-grid" className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-6xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              One place to save everything.
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              SaveForLatter fits into the places where you already discover things.
            </p>
          </div>

          {/* Grid visual cards (Double Bordered!) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Card 1: Web */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
              <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[180px]">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Web</h4>
                  <span className="text-[10px] text-primary font-semibold block mt-1">Save a page</span>
                  <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                    Capture a website directly without ever leaving the page.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Mobile */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
              <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[180px]">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Mobile</h4>
                  <span className="text-[10px] text-primary font-semibold block mt-1">Share to SaveForLatter</span>
                  <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                    Send videos, reels, papers, or layouts directly from your phone share menu.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Extension */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
              <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[180px]">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Extension</h4>
                  <span className="text-[10px] text-primary font-semibold block mt-1">One click</span>
                  <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                    Save what you are looking at instantly with background capture.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Quick Save */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
              <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[180px]">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Quick Save</h4>
                  <span className="text-[10px] text-primary font-semibold block mt-1">Paste and go</span>
                  <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                    Simply drop in a link, text fragment, or screenshot inside your dashboard.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. DIFFERENTIATOR SECTION */}
      <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Capture first. Organize later.
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              When inspiration strikes, the last thing you want to do is decide where it belongs.
            </p>
          </div>

          {/* Interactive Flow visual */}
          <div className="max-w-md mx-auto rounded-2xl border border-border/40 bg-muted/30 p-8 text-center space-y-4 shadow-xs select-none">
            <div className="space-y-3 font-semibold text-xs text-foreground/80">
              <div className="p-2.5 bg-card border border-border/80 rounded-lg max-w-[150px] mx-auto font-bold text-primary">SAVE</div>
              <div className="text-muted-foreground">&darr;</div>
              <div className="p-2.5 bg-card border border-border/80 rounded-lg">SaveForLatter captures it</div>
              <div className="text-muted-foreground">&darr;</div>
              <div className="p-2.5 bg-card border border-border/80 rounded-lg">AI understands it</div>
              <div className="text-muted-foreground">&darr;</div>
              <div className="p-2.5 bg-primary text-primary-foreground border border-primary/20 rounded-lg max-w-[180px] mx-auto">Organized automatically</div>
            </div>
          </div>

          <p className="text-center text-sm font-semibold text-muted-foreground mt-10">
            Save now. Let SaveForLatter figure out the rest.
          </p>

        </div>
      </section>

      {/* 4. HORIZONTAL GALLERY */}
      <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              If it's worth remembering, save it.
            </h2>
          </div>

          {/* Horizontal Gallery Mockup (Double Bordered Cards!) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground select-none">
            
            <div className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-foreground">Website</span>
                <span className="block text-primary animate-pulse">&darr;</span>
                <span className="text-foreground font-mono">SaveForLatter</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-foreground">Video</span>
                <span className="block text-primary animate-pulse">&darr;</span>
                <span className="text-foreground font-mono">SaveForLatter</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-foreground">Screenshot</span>
                <span className="block text-primary animate-pulse">&darr;</span>
                <span className="text-foreground font-mono">SaveForLatter</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-foreground">Article</span>
                <span className="block text-primary animate-pulse">&darr;</span>
                <span className="text-foreground font-mono">SaveForLatter</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-foreground">Idea</span>
                <span className="block text-primary animate-pulse">&darr;</span>
                <span className="text-foreground font-mono">SaveForLatter</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-foreground">GitHub</span>
                <span className="block text-primary animate-pulse">&darr;</span>
                <span className="text-foreground font-mono">SaveForLatter</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. QUICK CAPTURE IN ACTION */}
      <section className="relative w-full py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Quick capture in action
            </h2>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            
            {/* Scenario 1 */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-5 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest font-mono">SCENARIO &middot; 01</span>
                <h4 className="text-xs font-bold text-foreground">"I found a website I love."</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Save the URL. Come back later when you are designing or developing your next project without worrying about finding the bookmark tab.
                </p>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-5 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest font-mono">SCENARIO &middot; 02</span>
                <h4 className="text-xs font-bold text-foreground">"I found a useful video."</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Save it directly before it disappears forever into the bottom of your watch-later bookmarks heap.
                </p>
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-5 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest font-mono">SCENARIO &middot; 03</span>
                <h4 className="text-xs font-bold text-foreground">"I just had an idea."</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Write down raw texts and concepts immediately before your brain switches tasks.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. EXPLORE MORE FEATURES (NAVIGATOR) */}
      <FeaturesNavigator current="quick-capture" />

      {/* 7. FINAL CTA */}
      <section className="relative w-full py-28 md:py-36 bg-background border-t border-border/20 overflow-hidden text-center">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-20 blur-[130px]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.05) 0%, rgba(20,71,230,0) 70%)" }}
        />
        <div className="mx-auto max-w-4xl px-6 relative space-y-8 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Stop losing things worth remembering.
          </h2>
          <Button
            render={<Link href="/auth/signup" />}
            nativeButton={false}
            className="h-11 px-8 rounded-full bg-primary text-white hover:bg-primary/95 text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            Start Capturing <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
