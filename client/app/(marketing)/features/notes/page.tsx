"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon as Sparkles, ArrowRight01Icon as ArrowRight, ArrowLeft01Icon as ArrowLeft, Search01Icon as Search, StickyNote01Icon as StickyNote, Video01Icon as Video, Image01Icon as Image, FileTextIcon as FileText } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FeaturesNavigator } from "../quick-capture/page";

const noteTypesList = [
  { label: "Quick thought", detail: "“Build a better onboarding flow.”" },
  { label: "Meeting note", detail: "“Ideas from today's product discussion...”" },
  { label: "Code snippet", detail: "const memory = await save(item)" },
  { label: "Idea", detail: "“What if SaveForLatter could...”" },
  { label: "Personal note", detail: "“Things I want to explore later.”" }
];

export default function NotesPage() {
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
            NOTES
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
            Catch the thought before <br /> it disappears.
          </h1>
          
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Write something down in seconds. Keep ideas, observations, snippets, reminders, and everything in between with the rest of your memories.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button
              render={<Link href="/auth/signup" />}
              nativeButton={false}
              className="h-10 px-6 rounded-full font-semibold text-xs bg-primary text-white hover:bg-primary/95"
            >
              Write a Note <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Large Product Visual: Minimal Note Composer (Double Bordered!) */}
          <div className="w-full max-w-lg pt-12">
            <div className="rounded-2xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65">
              <div className="p-6 md:p-8 rounded-xl border border-border/75 bg-card text-left space-y-4 min-h-[160px] flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-foreground">Idea for my next project</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    What if bookmarks could understand why we save things?
                  </p>
                </div>
                <div className="text-[9px] font-semibold text-primary font-mono select-none">
                  #product #idea
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
              A note doesn't have to stay a note.
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              Connect your thoughts with the websites, videos, articles, and ideas that inspired them.
            </p>
          </div>

          <div className="max-w-xs mx-auto rounded-xl border border-border/40 bg-muted/30 p-6 text-center space-y-3 font-semibold text-[10px] uppercase tracking-wider text-muted-foreground select-none">
            <div className="p-2 bg-card border border-border/80 rounded-md">Website</div>
            <div>&darr;</div>
            <div className="p-2 bg-card border border-border/80 rounded-md text-primary">"Interesting UX"</div>
            <div>&darr;</div>
            <div className="p-2 bg-card border border-border/80 rounded-md">Note</div>
            <div>&darr;</div>
            <div className="p-2 bg-primary text-primary-foreground border border-primary/20 rounded-md">Product Idea</div>
          </div>

        </div>
      </section>

      {/* 3. CAPTURE THOUGHTS YOUR WAY */}
      <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Capture thoughts your way
            </h2>
          </div>

          {/* Grid of note types (Double Bordered Cards!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {noteTypesList.map((item, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs"
              >
                <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[120px]">
                  <div>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest font-mono">{item.label}</span>
                    <p className="text-[11px] text-foreground font-semibold leading-relaxed mt-2">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. AI SEARCH / DIFFERENTIATOR */}
      <section className="relative w-full py-20 md:py-28 bg-background border-b border-border/20">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Don't remember the exact words. Just ask.
            </h2>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            
            <div className="relative flex items-center">
              <HugeiconsIcon icon={Search} strokeWidth={2.25} className="absolute left-4 h-5 w-5 text-primary stroke-[2.5]" />
              <input
                type="text"
                disabled
                value="what was that idea I had about saving inspiration?"
                className="w-full bg-card border border-border text-foreground rounded-xl pl-12 pr-4 py-3.5 text-xs shadow-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <HugeiconsIcon icon={Sparkles} strokeWidth={2.25} className="h-4 w-4 fill-current animate-pulse" />
              <span>SaveForLatter found 4 related memories</span>
            </div>

            {/* Simulated search outputs */}
            <div className="space-y-3">
              <div className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                <div className="p-3 rounded-lg border border-border/75 bg-card flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>💡 Note: "What if bookmarks could understand..."</span>
                  <span className="text-[8px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded font-bold">Note</span>
                </div>
              </div>
              <div className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs">
                <div className="p-3 rounded-lg border border-border/75 bg-card flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>🔗 Web: Stripe Billing Integration</span>
                  <span className="text-[8px] uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">Web</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. NOTES + EVERYTHING ELSE */}
      <section className="relative w-full py-20 md:py-28 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Your thoughts shouldn't live in a separate app.
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              SaveForLatter brings your thoughts and discoveries into the same memory.
            </p>
          </div>

          {/* Node graph mapping */}
          <div className="max-w-xs mx-auto relative min-h-[160px] border border-border/40 bg-muted/30 rounded-2xl p-6 flex items-center justify-center select-none shadow-xs">
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 300 200" fill="none">
                <path d="M60,40 L150,100" stroke="var(--color-border)" strokeWidth="1.5" />
                <path d="M240,40 L150,100" stroke="var(--color-border)" strokeWidth="1.5" />
                <path d="M60,160 L150,100" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3,3" />
                <path d="M150,100 L240,100" stroke="#1447E6" strokeWidth="1.5" strokeDasharray="3,3" />
              </svg>
            </div>

            <div className="absolute inset-0 flex flex-col justify-between items-center py-4 text-[9px] font-bold uppercase tracking-wider">
              <div className="w-full flex justify-between px-6">
                <span className="px-2 py-0.5 bg-card border border-border/80 rounded-md">Website</span>
                <span className="px-2 py-0.5 bg-card border border-border/80 rounded-md">Video</span>
              </div>
              
              <div className="w-full flex justify-around px-2 items-center">
                <span className="px-3 py-1 bg-primary text-primary-foreground border border-primary/20 rounded-md">Note</span>
                <span className="px-2 py-0.5 bg-card border border-border/80 rounded-md text-[8px] text-muted-foreground">Idea</span>
              </div>

              <span className="px-2 py-0.5 bg-card border border-border/80 rounded-md">Screenshot</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. EXPLORE MORE FEATURES (NAVIGATOR) */}
      <FeaturesNavigator current="notes" />

      {/* 7. FINAL CTA */}
      <section className="relative w-full py-28 md:py-36 bg-background border-t border-border/20 overflow-hidden text-center">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-20 blur-[130px]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(20,71,230,0.05) 0%, rgba(20,71,230,0) 70%)" }}
        />
        <div className="mx-auto max-w-4xl px-6 relative space-y-8 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Write it down. Keep it forever.
          </h2>
          <Button
            render={<Link href="/auth/signup" />}
            nativeButton={false}
            className="h-11 px-8 rounded-full bg-primary text-white hover:bg-primary/95 text-xs font-semibold flex items-center gap-1 shadow-sm"
          >
            Create a Note <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <MainFooter />
    </div>
  );
}
