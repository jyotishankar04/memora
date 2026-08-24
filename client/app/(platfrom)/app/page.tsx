"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Globe, Video, Image as ImageIcon, Code, FileText, StickyNote, Plus, Search, 
  ArrowRight, X, Clock, Compass, Heart, ArrowUpRight, ChevronRight, Check, Link as LinkIcon, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Memory local schema
interface Memory {
  id: string;
  type: "web" | "video" | "image" | "note" | "document";
  title: string;
  description: string;
  source: string;
  timeAgo: string;
  tags: string[];
  duration?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [greeting, setGreeting] = useState("Good morning, Subham");

  // Dynamic greeting based on hours
  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning, Subham");
    else if (hr < 18) setGreeting("Good afternoon, Subham");
    else setGreeting("Good evening, Subham");
  }, []);

  // Mock memories for home preview
  const recentMemories: Memory[] = [
    {
      id: "mem-1",
      type: "web",
      title: "Linear",
      description: "SaaS Dashboard inspiration. Clean side navigation, custom dark colors, keyboard shortcuts.",
      source: "linear.app",
      timeAgo: "2 min ago",
      tags: ["Design", "SaaS"]
    },
    {
      id: "mem-2",
      type: "video",
      title: "Building a SaaS in 2026",
      description: "Under the hood of monorepos, vector indexers, and local-first configurations.",
      source: "youtube.com/watch?v=saas2026",
      timeAgo: "Yesterday",
      tags: ["Development", "SaaS"],
      duration: "12:42"
    },
    {
      id: "mem-3",
      type: "note",
      title: "Memora duplicate saves idea",
      description: "Ask the user what they save most during signup and match related pages.",
      source: "Personal Note",
      timeAgo: "2 days ago",
      tags: ["Product idea", "AI"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-12 animate-fade-in">
      
      {/* Dynamic Greeting */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {greeting}.
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          What's on your mind?
        </p>
      </div>

      {/* Main Search Component */}
      <div className="space-y-4 max-w-2xl">
        <div className="relative flex items-center">
          <Search className="absolute left-4.5 h-5 w-5 text-primary stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search your memory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                router.push(`/app/search?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
            className="w-full bg-muted/30 border border-border text-foreground rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/80 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 shadow-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4.5 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Placeholders / Try Concept Links */}
        <div className="text-[11px] text-muted-foreground space-y-1.5 px-1 font-medium">
          <span className="font-semibold">Try searching conceptually:</span>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
            {[
              { label: "“websites I saved for dashboard inspiration”", query: "Dashboard" },
              { label: "“React authentication resources”", query: "React" },
              { label: "“videos about building SaaS”", query: "SaaS" },
              { label: "“that article about vector databases”", query: "Vector" }
            ].map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => {
                  setSearchQuery(item.query);
                  router.push(`/app/search?q=${encodeURIComponent(item.query)}`);
                }}
                className="text-primary hover:underline bg-primary/5 px-2 py-0.5 rounded border border-primary/10 text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Capture Buttons */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Save something</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
          {[
            { label: "Save Link", sub: "Paste a URL", icon: LinkIcon },
            { label: "Quick Note", sub: "Capture a thought", icon: StickyNote },
            { label: "Upload", sub: "Image or file", icon: Upload },
            { label: "Save Anything", sub: "From extension", icon: ArrowUpRight }
          ].map((cap, idx) => (
            <div 
              key={idx}
              className="rounded-xl border border-border/45 bg-muted/75 p-0.5 shadow-xs hover:border-primary/20 transition-all duration-300 group cursor-pointer"
            >
              <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[110px] select-none">
                <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                  <cap.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{cap.label}</h4>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{cap.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Memories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recently saved</h3>
          <Link href="/app/memories" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentMemories.map((item) => (
            <Link 
              key={item.id} 
              href={`/app/memories/${item.id}`}
              className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 group block"
            >
              <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[170px] space-y-4">
                
                {/* Visual placeholder */}
                <div className="relative aspect-video w-full rounded-lg bg-muted border border-border/30 overflow-hidden flex items-center justify-center text-[10px] text-muted-foreground font-bold select-none">
                  {item.type === "video" ? (
                    <div className="flex flex-col items-center gap-1">
                      <Video className="h-5 w-5 text-red-500" />
                      <span>YouTube Video ({item.duration})</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Globe className="h-5 w-5 text-primary" />
                      <span>Web Preview</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-border/20">
                  <div className="flex gap-1">
                    {item.tags.map(t => (
                      <span key={t} className="text-[7.5px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono">{item.timeAgo}</span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested memories (AI Revisit) */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">You might want to revisit</h3>
          <p className="text-[10px] text-muted-foreground">AI-selected updates from your memory graph.</p>
        </div>

        <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs max-w-xl">
          <div className="p-5 rounded-lg border border-border/75 bg-card space-y-4">
            <span className="text-[8px] font-mono text-primary font-bold bg-primary/10 border border-primary/10 px-2 py-0.5 rounded">
              COLLECTED TRENDS
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-foreground">You saved 5 resources about AI agents this week</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Explore similar materials on tool calling, RAG patterns, and memory configurations from Tiago Forte's archives.
              </p>
            </div>
            <Link 
              href="/app/search?q=AI"
              className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline w-fit"
            >
              Explore connections <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Collections Preview */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your collections</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl text-xs">
          {[
            { label: "SaaS Inspiration", count: 128 },
            { label: "AI Research", count: 42 },
            { label: "Things to Build", count: 31 }
          ].map((col, idx) => (
            <Link 
              key={idx}
              href={`/app/collections/${col.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 block"
            >
              <div className="p-4 rounded-lg border border-border/75 bg-card flex justify-between items-center font-bold">
                <span className="truncate pr-2">{col.label}</span>
                <span className="text-[9px] font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded">{col.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Rediscovery Section */}
      <div className="space-y-4 pt-4 border-t border-border/20">
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">From 6 months ago</h3>
          <p className="text-[10px] text-muted-foreground">SURFACED RELEVANT DISCOVERIES</p>
        </div>

        <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs max-w-xl">
          <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-foreground">PostgreSQL index tuning references</h4>
              <p className="text-[10px] text-muted-foreground mt-1">Saved Feb 24, 2026 &middot; 3 similar saves identified</p>
            </div>
            <Link
              href="/app/search?q=PostgreSQL"
              className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline shrink-0"
            >
              Open memory &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Local animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
