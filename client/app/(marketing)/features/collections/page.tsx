"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { Sparkles, ArrowRight, ArrowLeft, Search, Plus, FolderPlus, Globe, Video, Image, StickyNote, HelpCircle, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeaturesNavigator } from "../quick-capture/page";

const collectionsList = [
  { title: "🚀 Build my SaaS", desc: "Product ideas, UI inspiration, tools and research." },
  { title: "🎨 Design Inspiration", desc: "Websites, interactions, typography and interfaces." },
  { title: "🤖 AI Research", desc: "Papers, articles, tools and experiments." },
  { title: "📚 Learn React", desc: "Tutorials, documentation and useful examples." },
  { title: "💡 Things to Build", desc: "Ideas worth coming back to." }
];

export default function CollectionsPage() {
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
            COLLECTIONS
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            Bring related memories <br /> together.
          </h1>
          
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Create spaces for projects, interests, research, inspiration, or anything else you want to keep together.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button
              render={<Link href="/auth/signup" />}
              nativeButton={false}
              className="h-10 px-6 rounded-full font-semibold text-xs bg-primary text-white hover:bg-primary/95"
            >
              Create a Collection <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Large Product Visual: Large Collection Card (Double Bordered!) */}
          <div className="w-full max-w-lg pt-12">
            <div className="rounded-2xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
              <div className="p-6 md:p-8 rounded-xl border border-border/75 bg-card text-left space-y-6">
                
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-foreground">SaaS Inspiration</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Everything I've saved while designing my next SaaS product.
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border/20">
                  <span className="text-xs font-bold text-primary">128 memories</span>
                  
                  <div className="flex gap-2 text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Websites</span>
                    <span>Videos</span>
                    <span>Articles</span>
                    <span>Screenshots</span>
                  </div>
                </div>

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
              Organize around what you're doing.
            </h2>
          </div>

          {/* Grid of collections (Double Bordered Cards!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionsList.map((item, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs"
              >
                <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[130px]">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. ADD ANYTHING */}
      <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              A collection can hold more than bookmarks.
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              Add websites, notes, videos, screenshots, articles, and anything else you've saved.
            </p>
          </div>

          {/* Node branch map */}
          <div className="max-w-md mx-auto relative min-h-[220px] border border-border/40 bg-muted/30 rounded-2xl p-6 flex items-center justify-center select-none shadow-xs">
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 300 200" fill="none">
                <path d="M150,40 L60,100" stroke="var(--color-border)" strokeWidth="1.5" />
                <path d="M150,40 L150,100" stroke="var(--color-border)" strokeWidth="1.5" />
                <path d="M150,40 L240,100" stroke="var(--color-border)" strokeWidth="1.5" />
                
                <path d="M60,115 L60,165" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3,3" />
                <path d="M150,115 L150,165" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3,3" />
                <path d="M240,115 L240,165" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3,3" />
              </svg>
            </div>

            <div className="absolute inset-0 flex flex-col justify-between items-center py-4 text-[9px] font-bold uppercase tracking-wider">
              <span className="px-3 py-1 bg-primary text-primary-foreground border border-primary/20 rounded-md text-[10px]">SaaS Inspiration</span>
              
              <div className="w-full flex justify-around px-4">
                <span className="px-2 py-0.5 bg-card border border-border/80 rounded-md">Website</span>
                <span className="px-2 py-0.5 bg-card border border-border/80 rounded-md">Video</span>
                <span className="px-2 py-0.5 bg-card border border-border/80 rounded-md">Screenshot</span>
              </div>

              <div className="w-full flex justify-around px-4">
                <span className="px-2 py-0.5 bg-card border border-border/40 text-[8px] text-muted-foreground rounded-md">Note</span>
                <span className="px-2 py-0.5 bg-card border border-border/40 text-[8px] text-muted-foreground rounded-md">Article</span>
                <span className="px-2 py-0.5 bg-card border border-border/40 text-[8px] text-muted-foreground rounded-md">GitHub</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. AI SUGGESTIONS / DIFFERENTIATOR */}
      <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              SaveForLatter can find what belongs together.
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              Saving something new? SaveForLatter can suggest collections where it might belong.
            </p>
          </div>

          {/* Interactive mockup (Double Bordered!) */}
          <div className="max-w-md mx-auto rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
            <div className="p-6 rounded-lg border border-border/75 bg-card space-y-4">
              
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-muted-foreground uppercase">YOU SAVED:</span>
                <h4 className="text-xs font-bold text-foreground">"Modern SaaS Pricing Pages"</h4>
              </div>

              <div className="text-center text-muted-foreground font-mono text-[9px]">&darr;</div>

              <div className="p-4 bg-muted/40 border border-primary/20 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                  <Sparkles className="h-4 w-4 fill-current animate-pulse" />
                  <span>Looks related to</span>
                </div>
                
                <div className="space-y-1.5 font-semibold text-[10px] text-foreground">
                  <div className="flex items-center gap-2">✓ SaaS Inspiration</div>
                  <div className="flex items-center gap-2">✓ Design References</div>
                  <div className="flex items-center gap-2">✓ Product Design</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="h-7 px-3 rounded-full text-[9px] font-bold bg-primary text-white">Add to SaaS Inspiration</Button>
                  <Button variant="ghost" className="h-7 px-3 rounded-full text-[9px] font-bold text-muted-foreground">Ignore</Button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. EVOLUTION / GROWING */}
      <section className="relative w-full py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Collections evolve with you
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              What starts as a handful of links can become your personal knowledge base.
            </p>
          </div>

          {/* Timeline growth chart */}
          <div className="max-w-xs mx-auto space-y-3 text-center font-bold text-[10px] uppercase tracking-wider text-muted-foreground select-none">
            <div className="p-3 bg-muted border border-border/80 rounded-md">
              <span className="text-foreground">January</span> &middot; <span className="text-primary">12 memories</span>
            </div>
            <div>&darr;</div>
            <div className="p-3 bg-muted border border-border/80 rounded-md">
              <span className="text-foreground">March</span> &middot; <span className="text-primary">37 memories</span>
            </div>
            <div>&darr;</div>
            <div className="p-3 bg-primary text-primary-foreground border border-primary/20 rounded-md">
              <span>June</span> &middot; <span className="font-bold">84 memories</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. EXPLORE MORE FEATURES (NAVIGATOR) */}
      <FeaturesNavigator current="collections" />

      {/* 7. FINAL CTA */}
      <section className="relative w-full py-28 md:py-36 bg-background border-t border-border/20 overflow-hidden text-center">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-20 blur-[130px]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.05) 0%, rgba(20,71,230,0) 70%)" }}
        />
        <div className="mx-auto max-w-4xl px-6 relative space-y-8 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Give your memories a place to grow.
          </h2>
          <Button
            render={<Link href="/auth/signup" />}
            nativeButton={false}
            className="h-11 px-8 rounded-full bg-primary text-white hover:bg-primary/95 text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            Create a Collection <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
