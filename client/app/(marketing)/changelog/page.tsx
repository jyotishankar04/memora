"use client";

import React from "react";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { Sparkles, Calendar, ArrowRight, Zap, Code } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const updates = [
  {
    version: "v1.2.0",
    title: "Semantic Search Unleashed",
    date: "August 2026",
    badge: "Major Update",
    changes: [
      "Natural language semantic queries are now live for all Pro users.",
      "Optimized vector search indexing speed, reducing process queue latency by 45%.",
      "Added support for advanced search filters (type, domain, save date range).",
    ],
    icon: Sparkles
  },
  {
    version: "v1.1.0",
    title: "Screenshot OCR Scanning Support",
    date: "July 2026",
    badge: "Feature",
    changes: [
      "Introduced fully automatic text extraction (OCR) for screenshots and visual mockups.",
      "Added mobile web capture sharing support.",
      "Fixed extensions sync lag on Chrome browser profiles.",
    ],
    icon: Zap
  },
  {
    version: "v1.0.0",
    title: "Official Public Launch",
    date: "June 2026",
    badge: "Release",
    changes: [
      "Launched initial web app dashboard.",
      "Released Chrome & Firefox browser capture extensions.",
      "Implemented automatic categorization and folderless tags.",
    ],
    icon: Code
  }
];

export default function ChangelogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        
        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4 mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Updates
          </span>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.15]">
            Product Changelog.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Follow along with new features, improvements, and bug fixes added to Memora every single week.
          </p>
        </div>

        {/* Changelog Timeline (Double Bordered Cards!) */}
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          {updates.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65"
              >
                <div className="p-8 rounded-xl border border-border/75 bg-card space-y-6">
                  
                  {/* Title & Version info */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/30 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary">{item.version}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border/30">
                            {item.badge}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mt-1">{item.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Bullet points list */}
                  <ul className="space-y-3">
                    {item.changes.map((change, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2.5 text-xs text-foreground/80 leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>

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
