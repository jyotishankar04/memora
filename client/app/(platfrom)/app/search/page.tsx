"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Sparkles, Globe, Video, Image as ImageIcon, Code, FileText, StickyNote, Plus, Search, 
  ArrowRight, X, ChevronRight, SlidersHorizontal, Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Memory local schema
interface Memory {
  id: string;
  type: "web" | "video" | "image" | "note";
  title: string;
  description: string;
  source: string;
  timeAgo: string;
  tags: string[];
}

const mockSearchDatabase: Memory[] = [
  {
    id: "mem-1",
    type: "web",
    title: "Linear Dashboard",
    description: "SaaS Dashboard inspiration. Clean sidebar navigation, custom dark colors, shortcuts helper.",
    source: "linear.app/features",
    timeAgo: "2 min ago",
    tags: ["Design", "SaaS", "Dashboard"]
  },
  {
    id: "mem-2",
    type: "video",
    title: "Building a SaaS in 2026",
    description: "Under the hood of monorepos, vector indexers, and local-first billing configurations.",
    source: "youtube.com/watch?v=saas2026",
    timeAgo: "Yesterday",
    tags: ["Development", "SaaS"],
  },
  {
    id: "mem-4",
    type: "image",
    title: "SaaS Pricing UI Reference",
    description: "Screenshot showing clean card grids, pricing models in local currency, and subtle border dividers.",
    source: "screenshot_pricing.png",
    timeAgo: "2 days ago",
    tags: ["Design", "SaaS", "Pricing"]
  }
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(urlQuery);
  const [results, setResults] = useState<Memory[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      handleSearch(urlQuery);
    } else {
      setResults([]);
    }
  }, [urlQuery]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    setIsSearching(true);
    
    setTimeout(() => {
      // Simple mockup filter simulating semantic/meaning matching
      const matches = mockSearchDatabase.filter(item => {
        const queryLower = q.toLowerCase();
        return (
          item.title.toLowerCase().includes(queryLower) ||
          item.description.toLowerCase().includes(queryLower) ||
          item.tags.some(t => t.toLowerCase().includes(queryLower)) ||
          // Simulating semantic match for conceptual lookups
          (queryLower.includes("dashboard") && item.tags.includes("Design")) ||
          (queryLower.includes("billing") && item.tags.includes("SaaS")) ||
          (queryLower.includes("pricing") && item.tags.includes("SaaS")) ||
          (queryLower.includes("saas") && item.tags.includes("SaaS"))
        );
      });
      setResults(matches);
      setIsSearching(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleTrySearch = (sample: string) => {
    setQuery(sample);
    handleSearch(sample);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 animate-fade-in">
      
      {/* Search Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search your memory</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Query your personal library using semantic natural language.
        </p>
      </div>

      {/* Semantic Search Input */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="relative flex items-center">
          <Search className="absolute left-4.5 h-5 w-5 text-primary stroke-[2.5]" />
          <input
            type="text"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-muted/30 border border-border text-foreground rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/80 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 shadow-xs"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setResults([]); }} className="absolute right-4.5 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* INITIAL STATE */}
      {!urlQuery && results.length === 0 && !isSearching && (
        <div className="space-y-4 max-w-xl font-medium">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">Try searching for concepts:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: "“that SaaS website I saved”", query: "SaaS" },
              { label: "“AI agent resources”", query: "AI" },
              { label: "“React authentication tutorials”", query: "React" },
              { label: "“dashboard mockup pricing section”", query: "Pricing" }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleTrySearch(item.query)}
                className="p-3 text-left border border-border rounded-xl bg-card hover:border-primary/30 transition-all text-primary hover:bg-primary/5 font-mono"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEARCHING LOADING STATE */}
      {isSearching && (
        <div className="space-y-4">
          <div className="h-4 w-28 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map(n => (
              <div key={n} className="rounded-xl border border-border/45 bg-muted/75 p-1">
                <div className="h-40 bg-card rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS STATE */}
      {results.length > 0 && !isSearching && (
        <div className="space-y-8 animate-fade-in">
          
          {/* AI Explanation of match */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-1 max-w-xl">
            <div className="p-4 rounded-lg border border-primary/10 bg-card space-y-3">
              <div className="flex items-center gap-1.5 text-primary">
                <Sparkles className="h-4 w-4 fill-current" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Why these matched</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Found {results.length} memories matching the core concepts of <span className="text-foreground font-semibold">SaaS</span>, <span className="text-foreground font-semibold">Design layout UI</span>, and <span className="text-foreground font-semibold">Billing components</span>.
              </p>
            </div>
          </div>

          <div className="border-t border-border/20 pt-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
              Best matches ({results.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={`/app/memories/${item.id}`}
                  className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 block group"
                >
                  <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[170px] space-y-4">
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded uppercase">
                        {item.type}
                      </span>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-border/20 text-[9px] text-muted-foreground">
                      <span className="font-mono truncate max-w-[120px]">{item.source}</span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Related / Suggested section */}
          <div className="border-t border-border/20 pt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
              Related memories
            </h3>
            <p className="text-[10px] text-muted-foreground leading-none">Similar references that might contain relevant pricing structures.</p>
            
            <div className="p-4 rounded-xl border border-border bg-muted/20 text-xs max-w-md font-semibold text-foreground flex items-center justify-between">
              <span>Vector DB Performance Comparison</span>
              <Link href="/app/memories/mem-5" className="text-primary hover:underline flex items-center gap-0.5">
                Explore &rarr;
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* EMPTY RESULT STATE */}
      {urlQuery && results.length === 0 && !isSearching && (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">No matches found</h3>
          <p className="text-xs text-muted-foreground">
            We couldn't find items matching your query. Try searching for other concepts like "SaaS", "Linear", or "Pricing".
          </p>
        </div>
      )}

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
