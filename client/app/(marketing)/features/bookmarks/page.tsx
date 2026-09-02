"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon as Sparkles, ArrowRight01Icon as ArrowRight, CheckIcon as Check, Search01Icon as Search, GlobeIcon as Globe, Bookmark01Icon as Bookmark, Database01Icon as Database, Layout01Icon as Layout } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeaturesNavigator } from "../quick-capture/page";

const bookmarksList = [
  { type: "Website", title: "SaaS landing page", tags: "Design · SaaS" },
  { type: "GitHub", title: "Open source project", tags: "React · OSS" },
  { type: "Article", title: "AI research", tags: "AI · Research" }
];

export default function BookmarksPage() {
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
            BOOKMARKS, REIMAGINED
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            Your bookmarks shouldn't <br /> be a graveyard.
          </h1>
          
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Keep every important link in one place, automatically organized and easy to find.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button
              render={<Link href="/auth/signup" />}
              nativeButton={false}
              className="h-10 px-6 rounded-full font-semibold text-xs bg-primary text-white hover:bg-primary/95"
            >
              Save Your First Bookmark <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Large Product Visual: Beautiful SaveForLatter Bookmark Collection (Double Bordered Cards!) */}
          <div className="w-full max-w-2xl pt-12">
            <div className="space-y-6 text-left">
              
              {/* Search bar mockup */}
              <div className="max-w-md mx-auto rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-muted-foreground flex items-center justify-between shadow-xs">
                <span>Search your memory...</span>
                <HugeiconsIcon icon={Search} strokeWidth={2.25} className="h-4 w-4 text-primary" />
              </div>

              {/* Grid of bookmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {bookmarksList.map((item, idx) => (
                  <div 
                    key={idx}
                    className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65"
                  >
                    <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[140px] space-y-4">
                      <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground">
                        <span className="bg-primary/5 border border-primary/10 px-1.5 py-0.5 rounded text-primary uppercase font-bold">{item.type}</span>
                        <span>Saved</span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-foreground leading-snug">{item.title}</h4>
                      
                      <span className="text-[9px] font-semibold text-muted-foreground pt-2 border-t border-border/20">
                        {item.tags}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. VALUE SECTION */}
      <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              More than a URL.
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              A bookmark is more useful when you remember why you saved it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                SaveForLatter keeps the context around your bookmarks, so months later you don't have to wonder what made the link important.
              </p>
              
              <div className="p-4 bg-muted/40 border border-border/45 rounded-xl space-y-2 text-xs font-semibold text-foreground/80">
                <div className="flex items-center gap-2">✓ URL & Title context</div>
                <div className="flex items-center gap-2">✓ Visual previews</div>
                <div className="flex items-center gap-2">✓ Your custom notations</div>
                <div className="flex items-center gap-2">✓ AI-generated concepts & tags</div>
              </div>
            </div>

            {/* Visual preview list mockup */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
              <div className="p-5 rounded-lg border border-border/75 bg-card space-y-3 font-mono text-[9px]/relaxed text-muted-foreground">
                <div className="flex justify-between border-b border-border/20 pb-2 text-foreground font-bold">
                  <span>URL metadata</span>
                  <span className="text-primary font-bold">Active</span>
                </div>
                <div>URL: stripe.com/billing</div>
                <div>Title: Stripe Billing Integration</div>
                <div>Note: "Useful reference layouts for invoice templates."</div>
                <div>AI Tags: SaaS &middot; Design &middot; Payment</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FOLDERS / ORGANIZATION */}
      <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              No more folders inside folders.
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              SaveForLatter understands what your bookmarks are about and makes them searchable without requiring you to maintain a complicated folder structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            
            {/* Category 1 */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-5 rounded-lg border border-border/75 bg-card space-y-3 font-mono text-[9px]/relaxed text-muted-foreground">
                <span className="text-foreground font-bold uppercase tracking-wider text-xs">SaaS</span>
                <div className="pl-3 border-l border-border/60">
                  <div>├── Landing pages</div>
                  <div>├── Pricing</div>
                  <div>├── Onboarding</div>
                  <div>└── Dashboards</div>
                </div>
              </div>
            </div>

            {/* Category 2 */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-5 rounded-lg border border-border/75 bg-card space-y-3 font-mono text-[9px]/relaxed text-muted-foreground">
                <span className="text-foreground font-bold uppercase tracking-wider text-xs">Development</span>
                <div className="pl-3 border-l border-border/60">
                  <div>├── React</div>
                  <div>├── APIs</div>
                  <div>├── Databases</div>
                  <div>└── DevTools</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. AI SEARCH / DIFFERENTIATOR */}
      <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Search by what you remember.
            </h2>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            {/* Search Input */}
            <div className="relative flex items-center">
              <HugeiconsIcon icon={Search} strokeWidth={2.25} className="absolute left-4 h-5 w-5 text-primary stroke-[2.5]" />
              <input
                type="text"
                disabled
                value="that SaaS website with the blue pricing section"
                className="w-full bg-card border border-border text-foreground rounded-xl pl-12 pr-4 py-3.5 text-xs shadow-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-4 w-4 fill-current" />
              <span>8 matching memories found</span>
            </div>

            {/* Results mockup */}
            <div className="space-y-3">
              {["SaaS Landing Page", "Pricing Inspiration", "Dashboard Design"].map((title, idx) => (
                <div key={idx} className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                  <div className="p-3.5 rounded-lg border border-border/75 bg-card flex items-center justify-between text-xs font-semibold text-foreground">
                    <span>{title}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">2 months ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. BOOKMARK COLLECTIONS */}
      <section className="relative w-full py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Bookmark collections
            </h2>
          </div>

          {/* Collection stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center select-none">
            
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-xs font-bold text-foreground">SaaS Inspiration</span>
                <span className="block text-xl font-bold text-primary">124</span>
                <span className="text-[9px] text-muted-foreground uppercase font-mono">Memories</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-xs font-bold text-foreground">Frontend Resources</span>
                <span className="block text-xl font-bold text-primary">86</span>
                <span className="text-[9px] text-muted-foreground uppercase font-mono">Memories</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-xs font-bold text-foreground">AI Research</span>
                <span className="block text-xl font-bold text-primary">53</span>
                <span className="text-[9px] text-muted-foreground uppercase font-mono">Memories</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-2">
                <span className="text-xs font-bold text-foreground">Things to Build</span>
                <span className="block text-xl font-bold text-primary">31</span>
                <span className="text-[9px] text-muted-foreground uppercase font-mono">Memories</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. EXPLORE MORE FEATURES (NAVIGATOR) */}
      <FeaturesNavigator current="bookmarks" />

      {/* 7. FINAL CTA */}
      <section className="relative w-full py-28 md:py-36 bg-background border-t border-border/20 overflow-hidden text-center">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-20 blur-[130px]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.05) 0%, rgba(20,71,230,0) 70%)" }}
        />
        <div className="mx-auto max-w-4xl px-6 relative space-y-8 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Give your bookmarks somewhere better to live.
          </h2>
          <Button
            render={<Link href="/auth/signup" />}
            nativeButton={false}
            className="h-11 px-8 rounded-full bg-primary text-white hover:bg-primary/95 text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            Start Saving <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
