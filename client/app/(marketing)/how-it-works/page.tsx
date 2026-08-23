"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { 
  Sparkles, ArrowRight, Check, X, Search, Globe, Smartphone, 
  Laptop, StickyNote, Network, Shield, Download, Lock, Plus, ArrowUpRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Timeline events for Step 8
const timelineEvents = [
  { time: "9:32 AM", action: "You see a beautiful SaaS website.", method: "Save → Memora" },
  { time: "11:45 AM", action: "You find a useful YouTube video.", method: "Share → Memora" },
  { time: "2:20 PM", action: "You have a product idea.", method: "Quick note → Memora", note: "“What if users could…”" },
  { time: "8:10 PM", action: "You're designing your landing page.", query: "“Show me the SaaS websites I saved for landing page inspiration.”", method: "Memora brings everything back." }
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans selection:bg-primary/20">
      
      {/* Styles for custom keyframe flows and dot pulse indicators */}
      <style>{`
        @keyframes float-y-s {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse-s {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .anim-float-s { animation: float-y-s 5s ease-in-out infinite; }
        .anim-pulse-s { animation: pulse-s 2s ease-in-out infinite; }
      `}</style>

      <Navbar />
      
      {/* Main Sections Wrapper */}
      <main className="flex-1 pt-24 pb-0 overflow-hidden">

        {/* 1. HERO SECTION */}
        <section className="relative w-full py-20 md:py-32 bg-background flex flex-col items-center justify-center border-b border-border/20">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.06) 0%, rgba(20,71,230,0) 70%)"
            }}
          />

          <div className="mx-auto max-w-4xl px-6 relative text-center space-y-8 flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              MEMORA &middot; HOW IT WORKS
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] max-w-3xl">
              Save anything. <br /> Find everything.
            </h1>
            
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Memora turns your scattered links, notes, screenshots, videos, ideas, and inspiration into one intelligent personal library.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                render={<Link href="/auth/signup" />}
                nativeButton={false}
                className="h-11 px-6 rounded-full font-semibold text-xs flex items-center gap-1 bg-primary text-white hover:bg-primary/95"
              >
                Start saving <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              
              <Button
                render={<a href="#core-loop" />}
                nativeButton={false}
                className="h-11 px-6 rounded-full font-semibold text-xs border border-border/60"
                variant="outline"
              >
                See how it works
              </Button>
            </div>

            {/* Product UI Interface Screenshot Mockup */}
            <div className="w-full max-w-lg pt-12">
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 anim-float-s">
                <div className="p-6 rounded-lg border border-border/75 bg-card text-center space-y-6">
                  <div className="flex items-center justify-between border-b border-border/30 pb-3">
                    <span className="text-[10px] font-mono tracking-widest font-semibold text-primary">MEMORA</span>
                    <span className="text-[9px] text-muted-foreground">PERSONAL LIBRARY</span>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-none">
                      Save anything. Find everything.
                    </p>
                    
                    {/* Add Save bar mockup */}
                    <div className="mx-auto max-w-[120px] rounded-lg border border-border/80 bg-background/50 py-2 text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1">
                      <Plus className="h-3.5 w-3.5" /> Save
                    </div>

                    {/* Search bar mockup */}
                    <div className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs text-muted-foreground flex items-center justify-between shadow-xs font-medium">
                      <span>Search your memory...</span>
                      <kbd className="px-1.5 py-0.5 border border-border bg-muted rounded text-[9px] font-mono select-none">⌘K</kbd>
                    </div>
                  </div>

                  {/* Mock tag list */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-mono text-muted-foreground">
                    {["Websites", "Notes", "Videos", "Ideas", "Images", "Resources"].map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded border border-border bg-muted/40">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. THE CORE LOOP */}
        <section id="core-loop" className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
          <div className="mx-auto max-w-6xl px-6">
            
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                HOW IT WORKS
              </span>
              <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
                One place for everything you don't want to lose.
              </h2>
            </div>

            {/* Horizontal 4 Step Flow (Double Bordered Cards!) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Step 1: Capture */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 flex flex-col">
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full space-y-6">
                  <div>
                    <span className="text-2xl font-bold font-mono text-primary">01</span>
                    <h3 className="text-base font-bold text-foreground mt-2">Capture</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Save it in seconds. Website link, Instagram reel, YouTube video, screenshot, notes, or ideas. Just send it to Memora.
                    </p>
                  </div>
                  
                  {/* Visual loop mock */}
                  <div className="p-3 bg-muted/40 border border-border/40 rounded-lg space-y-1.5">
                    <div className="text-[9px] font-bold text-primary flex items-center gap-1"><Plus className="h-3 w-3" /> SAVE</div>
                    <div className="text-[10px] text-foreground/80 flex items-center gap-1.5 font-semibold">🔗 Website</div>
                    <div className="text-[10px] text-foreground/80 flex items-center gap-1.5 font-semibold">🎥 Video</div>
                    <div className="text-[10px] text-foreground/80 flex items-center gap-1.5 font-semibold">🖼 Screenshot</div>
                    <div className="text-[10px] text-foreground/80 flex items-center gap-1.5 font-semibold">📝 Note</div>
                    <div className="text-[10px] text-foreground/80 flex items-center gap-1.5 font-semibold">💡 Idea</div>
                  </div>
                </div>
              </div>

              {/* Step 2: Understand */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 flex flex-col">
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full space-y-6">
                  <div>
                    <span className="text-2xl font-bold font-mono text-primary">02</span>
                    <h3 className="text-base font-bold text-foreground mt-2">Understand</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Your saves become more than bookmarks. Memora automatically extracts title, description, source keywords, topics, and important concepts.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/40 border border-border/40 rounded-lg space-y-2">
                    <span className="text-[8px] font-mono text-muted-foreground">stripe.com/billing</span>
                    <h4 className="text-[10px] font-bold text-foreground leading-none">Website Design Inspiration</h4>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {["Design", "UI", "Inspiration"].map((t) => (
                        <span key={t} className="text-[7px] font-bold uppercase bg-primary/10 text-primary border border-primary/10 px-1 rounded">{t}</span>
                      ))}
                    </div>
                    <p className="text-[9px] text-muted-foreground leading-snug">"Minimal SaaS landing..."</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Organize */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 flex flex-col">
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full space-y-6">
                  <div>
                    <span className="text-2xl font-bold font-mono text-primary">03</span>
                    <h3 className="text-base font-bold text-foreground mt-2">Organize</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Stop creating folders manually. Memora automatically maps and groups tags based on conceptual meaning.
                    </p>
                  </div>

                  <div className="p-3 bg-muted/40 border border-border/40 rounded-lg font-mono text-[9px]/relaxed text-muted-foreground space-y-2">
                    <div>
                      <span className="text-foreground font-bold">Design</span>
                      <div className="pl-3 border-l border-border/60">├── Landing pages</div>
                      <div className="pl-3 border-l border-border/60">├── Dashboards</div>
                      <div className="pl-3 border-l border-border/60">└── Typography</div>
                    </div>
                    <div>
                      <span className="text-foreground font-bold">Development</span>
                      <div className="pl-3 border-l border-border/60">└── Next.js</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Find */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 flex flex-col">
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full space-y-6">
                  <div>
                    <span className="text-2xl font-bold font-mono text-primary">04</span>
                    <h3 className="text-base font-bold text-foreground mt-2">Find</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Simply ask. Describe what you save in normal sentences, and Memora brings back exactly what you need.
                    </p>
                  </div>

                  <div className="p-3.5 bg-muted/40 border border-border/40 rounded-lg space-y-2">
                    <div className="flex items-center gap-1 bg-background border border-border rounded-md px-1.5 py-1 text-[8px] text-muted-foreground font-medium">
                      <Search className="h-2.5 w-2.5 text-primary" />
                      <span>websites saved for dashboard</span>
                    </div>
                    <div className="bg-background border border-border/80 rounded p-1.5 space-y-1">
                      <h4 className="text-[9px] font-bold text-foreground">Linear Dashboard</h4>
                      <p className="text-[7px] text-muted-foreground">Dashboard &middot; SaaS &middot; UI</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <p className="text-center text-xs text-muted-foreground mt-12 font-medium">
              ✦ You don't have to organize anything manually. Memora understands and organizes it all.
            </p>

          </div>
        </section>

        {/* 3. FROM CHAOS TO MEMORY */}
        <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
          <div className="mx-auto max-w-4xl px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Everything you save. Finally connected.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-9 gap-6 items-center">
              
              {/* Left Side: Chaos (Col span 4) */}
              <div className="md:col-span-4 rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
                <div className="p-6 rounded-lg border border-border/75 bg-card space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-red-500">Before (Chaos)</h3>
                  
                  <div className="space-y-2 text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center justify-between p-2.5 border border-border/50 bg-background/50 rounded-lg">
                      <span>🔗 37 bookmarks</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 border border-border/50 bg-background/50 rounded-lg">
                      <span>📱 82 saved reels</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 border border-border/50 bg-background/50 rounded-lg">
                      <span>📝 Random notes</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 border border-border/50 bg-background/50 rounded-lg">
                      <span>📸 Screenshots</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 border border-border/50 bg-background/50 rounded-lg">
                      <span>💬 Messages to yourself</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Arrow (Col span 1) */}
              <div className="md:col-span-1 flex items-center justify-center py-2">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg animate-pulse">
                  →
                </div>
              </div>

              {/* Right Side: Memory (Col span 4) */}
              <div className="md:col-span-4 rounded-xl border border-primary/20 bg-muted/75 p-1 shadow-md">
                <div className="p-6 rounded-lg border border-primary/25 bg-card space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Memora (Memory)</h3>
                  
                  <div className="divide-y divide-border/30 text-xs font-medium text-foreground">
                    {["Design", "Development", "Learning", "Ideas", "Inspiration", "Resources"].map((t) => (
                      <div key={t} className="py-2.5 flex items-center justify-between">
                        <span>{t}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">Auto grouped</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">
              From scattered saves to one searchable memory.
            </p>

          </div>
        </section>

        {/* 4. SAVE FROM ANYWHERE */}
        <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
          <div className="mx-auto max-w-6xl px-6">
            
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                INTEGRATIONS
              </span>
              <h2 className="mt-6 text-balance font-medium text-4xl leading-[1.25] tracking-tight text-foreground sm:text-5xl">
                Capture it wherever you find it.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Browser */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                      <Globe className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Browser</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Save websites instantly with one-click extension saves.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Browser extension →</span>
                </div>
              </div>

              {/* Card 2: Phone */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Phone</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Save while scrolling on Instagram, YouTube, X, Reddit, and Safari via share menu.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Share → Memora</span>
                </div>
              </div>

              {/* Card 3: Desktop */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Desktop</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Quick capture shortcuts from any window without breaking your workflow.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Keyboard shortcut →</span>
                </div>
              </div>

              {/* Card 4: Memora app */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                      <StickyNote className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">Memora</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      Write down quick notes, thoughts, ideas, and reminders directly inside.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Quick notes →</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. ONE-TAP SAVING */}
        <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
          <div className="mx-auto max-w-4xl px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                SPEED
              </span>
              <h2 className="mt-6 text-balance font-medium text-3xl tracking-tight text-foreground sm:text-4xl">
                The fastest way to remember something.
              </h2>
            </div>

            {/* Mock browser card (Double Bordered!) */}
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs max-w-xl mx-auto mb-12">
              <div className="p-6 rounded-lg border border-border/75 bg-card space-y-4">
                
                {/* Browser address bar */}
                <div className="flex items-center gap-1.5 border-b border-border/30 pb-3 text-xs text-muted-foreground font-medium">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-border" />
                    <div className="h-2 w-2 rounded-full bg-border" />
                  </div>
                  <span className="font-mono">stripe.com/billing</span>
                </div>

                <div className="p-8 bg-muted/20 border border-dashed border-border/60 rounded-xl text-center space-y-4 relative overflow-hidden">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-600">✓ Saved</span>
                    <p className="text-[10px] text-muted-foreground">"Added to Design Inspiration"</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center text-sm font-semibold text-muted-foreground max-w-lg mx-auto">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" /> No copy-pasting.
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" /> No switching apps.
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" /> No “I'll save this later.”
              </div>
            </div>

          </div>
        </section>

        {/* 6. AI SEARCH */}
        <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
          <div className="mx-auto max-w-4xl px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                SEMANTIC RETRIEVAL
              </span>
              <h2 className="mt-6 text-balance font-medium text-3xl tracking-tight text-foreground sm:text-4xl">
                Search like you remember.
              </h2>
            </div>

            {/* Comparison panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Bad Search */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
                <div className="p-6 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Traditional Keyword Search</span>
                    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs font-mono text-red-500/80">
                      ❌ "website dashboard blue"
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Keyword indexers look for literal text matches. If the website doesn't contain the word "blue" or "dashboard" in the code elements, it won't be returned.
                    </p>
                  </div>
                </div>
              </div>

              {/* Smart Search */}
              <div className="rounded-xl border border-primary/20 bg-muted/75 p-1 shadow-md">
                <div className="p-6 rounded-lg border border-primary/25 bg-card flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Memora AI Search</span>
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg text-xs font-mono text-primary font-semibold space-y-1">
                      <div>✓ "dashboard websites with sidebar navigation"</div>
                      <div>✓ "React authentication resource"</div>
                      <div>✓ "videos about building SaaS products"</div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Memora uses sentence semantic vectors to locate your saves by their actual meaning, layouts, concepts, and ideas.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <p className="text-center text-xs text-muted-foreground mt-12 font-medium max-w-sm mx-auto leading-relaxed">
              You don't need to remember where you saved it. <br />
              <span className="text-foreground">Just remember what you're looking for.</span>
            </p>

          </div>
        </section>

        {/* 7. YOUR MEMORY GETS SMARTER */}
        <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
          <div className="mx-auto max-w-4xl px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                GROWTH
              </span>
              <h2 className="mt-6 text-balance font-medium text-3xl tracking-tight text-foreground sm:text-4xl">
                The more you save, the more useful Memora becomes.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              
              {/* Left Graph */}
              <div className="md:col-span-3 rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
                <div className="p-6 rounded-lg border border-border/75 bg-card space-y-4 font-mono text-[9px]/relaxed text-muted-foreground">
                  <div className="text-center border-b border-border/20 pb-2 text-foreground font-bold">Your Memory</div>
                  
                  <div className="space-y-1 pt-2">
                    <div className="text-primary font-bold">Design</div>
                    <div className="pl-3 border-l border-primary/20">├── UI/UX</div>
                    <div className="pl-6 border-l border-primary/20">└── SaaS</div>
                    <div className="pl-9 border-l border-primary/20">└── Development</div>
                  </div>
                </div>
              </div>

              {/* Right text panel */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-foreground">Related memories</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Memora discovers relationships between things you've saved.
                </p>
                <div className="p-4 bg-muted/40 border border-border/45 rounded-lg space-y-2 text-xs font-semibold text-foreground/80">
                  <div>✦ 5 dashboard examples</div>
                  <div>✦ 3 typography resources</div>
                  <div>✦ 4 component libraries</div>
                  <div className="text-muted-foreground">✦ 2 articles saved months ago</div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 8. EXAMPLE — A REAL DAY WITH MEMORA */}
        <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
          <div className="mx-auto max-w-4xl px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                TIMELINE
              </span>
              <h2 className="mt-6 text-balance font-medium text-3xl tracking-tight text-foreground sm:text-4xl">
                A day with Memora
              </h2>
            </div>

            {/* Timeline display */}
            <div className="max-w-2xl mx-auto space-y-6">
              {timelineEvents.map((evt, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs"
                >
                  <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {evt.time}
                      </span>
                      <div className="text-xs font-semibold text-foreground">
                        {evt.action}
                        {evt.note && <span className="block text-[11px] text-muted-foreground/85 font-mono font-normal mt-1">{evt.note}</span>}
                        {evt.query && <span className="block text-[11px] text-primary/95 font-semibold font-mono mt-1">{evt.query}</span>}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 uppercase tracking-wider">
                      {evt.method}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm font-semibold text-muted-foreground mt-12 tracking-wide">
              You didn't organize anything. <span className="text-primary">You just saved it.</span>
            </p>

          </div>
        </section>

        {/* 9. EVERYTHING CONNECTED */}
        <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
          <div className="mx-auto max-w-4xl px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                KNOWLEDGE NETWORK
              </span>
              <h2 className="mt-6 text-balance font-medium text-3xl tracking-tight text-foreground sm:text-4xl">
                Your saves aren't isolated anymore.
              </h2>
            </div>

            {/* Node map visual */}
            <div className="max-w-md mx-auto relative min-h-[250px] border border-border/40 bg-muted/30 rounded-2xl p-6 flex items-center justify-center shadow-xs">
              <div className="absolute inset-0 select-none">
                <svg className="w-full h-full" viewBox="0 0 300 200" fill="none">
                  <path d="M150,40 L90,95" stroke="var(--color-border)" strokeWidth="1.5" />
                  <path d="M150,40 L150,95" stroke="var(--color-border)" strokeWidth="1.5" />
                  <path d="M150,40 L210,95" stroke="var(--color-border)" strokeWidth="1.5" />
                  
                  <path d="M90,115 L60,165" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3,3" />
                  <path d="M150,115 L150,165" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3,3" />
                  <path d="M210,115 L240,165" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3,3" />

                  <path d="M60,180 L150,180" stroke="#1447E6" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3,3" />
                </svg>
              </div>

              {/* Node cards */}
              <div className="absolute inset-0 flex flex-col justify-between items-center py-4 text-[10px] font-bold uppercase tracking-wider select-none">
                <span className="px-3 py-1 bg-card border border-border/80 rounded-md">SaaS</span>
                
                <div className="w-full flex justify-around px-4">
                  <span className="px-2.5 py-1 bg-card border border-border/80 rounded-md">Design</span>
                  <span className="px-2.5 py-1 bg-card border border-border/80 rounded-md">AI</span>
                  <span className="px-2.5 py-1 bg-card border border-border/80 rounded-md">Startup</span>
                </div>

                <div className="w-full flex justify-around px-2">
                  <span className="px-2 py-0.5 bg-card border border-border/40 text-[8px] text-muted-foreground rounded-md">Landing Pages</span>
                  <span className="px-2 py-0.5 bg-card border border-border/40 text-[8px] text-muted-foreground rounded-md">Tools</span>
                  <span className="px-2 py-0.5 bg-card border border-border/40 text-[8px] text-muted-foreground rounded-md">Ideas</span>
                </div>

                <span className="px-3 py-1 bg-primary text-primary-foreground border border-primary/20 rounded-md text-[9px]">Your Notes</span>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">
              Memora connects the things you save so you can discover them later.
            </p>

          </div>
        </section>

        {/* 10. PRIVACY */}
        <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
          <div className="mx-auto max-w-4xl px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                SECURITY
              </span>
              <h2 className="mt-6 text-balance font-medium text-3xl tracking-tight text-foreground sm:text-4xl">
                Your memory belongs to you.
              </h2>
              <p className="mt-4 text-xs text-muted-foreground max-w-xs mx-auto">
                Your saved content is personal. Memora is built to keep your private library private.
              </p>
            </div>

            {/* 3 cards (Double Bordered Cards!) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              
              {/* Card 1 */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
                <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full">
                  <div>
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary w-fit mb-3">
                      <Lock className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Private by default</h4>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                      Your personal saves aren't public. We do not sell or monetize your data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
                <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full">
                  <div>
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary w-fit mb-3">
                      <Shield className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Your data, your account</h4>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                      You retain full control. Delete any memory or clear your account instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
                <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full">
                  <div>
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary w-fit mb-3">
                      <Download className="h-4 w-4" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground">Export anytime</h4>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                      Your memories shouldn't be locked in. Export your entire library in one click.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 11. FINAL CTA */}
        <section className="relative w-full py-32 md:py-44 bg-background overflow-hidden">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.06) 0%, rgba(20,71,230,0) 70%)"
            }}
          />

          <div className="mx-auto max-w-4xl px-6 relative text-center space-y-8 flex flex-col items-center">
            
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                GET STARTED
              </span>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.15] pt-2 max-w-xl mx-auto">
                Stop losing things worth remembering.
              </h2>
              <div className="text-muted-foreground text-sm space-y-1 leading-relaxed">
                <p>Save anything.</p>
                <p>Find everything.</p>
                <p className="font-semibold text-foreground">Build your personal memory.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                render={<Link href="/auth/signup" />}
                nativeButton={false}
                className="h-11 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                Create your Memora <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button
                render={<Link href="/pricing" />}
                nativeButton={false}
                className="h-11 px-6 rounded-full text-foreground/80 hover:text-foreground text-xs font-medium border border-border/50 hover:bg-muted/50"
                variant="ghost"
              >
                See what's included
              </Button>
            </div>

          </div>
        </section>

      </main>

      <MainFooter />
    </div>
  );
}
