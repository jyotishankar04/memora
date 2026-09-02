"use client";

import React from "react";
import { Navbar } from "@/components/marketing/navbar";
import MainFooter from "@/components/marketing/landing/main-footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon as Search, GlobeIcon as Globe, Key01Icon as Key, Shield01Icon as Shield, HelpCircleIcon as HelpCircle, ArrowRight01Icon as ArrowRight } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const categories = [
  { title: "Getting Started", desc: "Setting up your account, extension installation, and saving your first 10 items.", icon: Globe },
  { title: "AI Search & RAG", desc: "How natural language semantic search matches ideas, not just literal text.", icon: HelpCircle },
  { title: "Account & Billing", desc: "Manage subscriptions, subscription plans (Pro & Free), billing cycles, and invoices.", icon: Key },
  { title: "Privacy & Security", desc: "Siloed context processing, account deletions, data encryption, and local-first strategies.", icon: Shield },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/[0.03] via-background to-background text-foreground font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        
        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6 mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Help Center
          </span>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.15]">
            How can we help?
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Search our documentation, quick start guides, and customer support resources.
          </p>
          
          {/* Search bar input mock */}
          <div className="max-w-md mx-auto relative flex items-center pt-2">
            <HugeiconsIcon icon={Search} strokeWidth={2.25} className="absolute left-4 h-5 w-5 text-muted-foreground stroke-[2.5]" />
            <input 
              type="text" 
              placeholder="Search tutorials, keys, features..."
              className="w-full bg-muted/40 border border-border text-foreground rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Categories Grid (Double Bordered Cards!) */}
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-border/45 bg-muted/75 p-1 shadow-xs dark:border-border/65 hover:border-primary/20 transition-all duration-300"
              >
                <div className="p-6 rounded-xl border border-border/75 bg-card flex flex-col justify-between h-full group">
                  <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary mt-1">
                      <HugeiconsIcon icon={Icon} strokeWidth={2.25} className="h-5 w-5" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                      <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform pt-1">
                        View articles <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-3.5 w-3.5" />
                      </span>
                    </div>
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
