"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { listMemories } from "@/lib/memories";
import { memoriesQueryKey } from "@/context/MemoryContext";
import { timeAgo } from "@/lib/time";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);

  useEffect(() => {
    function syncFromUrl() {
      setQuery(urlQuery);
      setDebouncedQuery(urlQuery);
    }
    syncFromUrl();
  }, [urlQuery]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const trimmedQuery = debouncedQuery.trim();
  const { data, isFetching } = useQuery({
    queryKey: memoriesQueryKey({ q: trimmedQuery, limit: 50 }),
    queryFn: () => listMemories({ q: trimmedQuery, limit: 50 }),
    enabled: trimmedQuery.length > 0,
  });
  const results = data?.items ?? [];
  const hasSearched = trimmedQuery.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/app/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleTrySearch = (sample: string) => {
    setQuery(sample);
    router.push(`/app/search?q=${encodeURIComponent(sample)}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 animate-fade-in">

      {/* Search Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search your memory</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Query your personal library by title, description, or tags.
        </p>
      </div>

      {/* Search Input */}
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
            <button type="button" onClick={() => { setQuery(""); router.push("/app/search"); }} className="absolute right-4.5 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* INITIAL STATE */}
      {!hasSearched && (
        <div className="space-y-4 max-w-xl font-medium">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">Try searching for:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: "SaaS", query: "SaaS" },
              { label: "AI research", query: "AI" },
              { label: "Design references", query: "Design" },
              { label: "Pricing UI", query: "Pricing" }
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
      {hasSearched && isFetching && (
        <div className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/45 bg-muted/75 p-1">
                <div className="p-4 rounded-lg border border-border/75 bg-card min-h-[170px] space-y-3">
                  <Skeleton className="h-3.5 w-14 rounded" />
                  <Skeleton className="h-3.5 w-4/5" />
                  <Skeleton className="h-2.5 w-full" />
                  <div className="flex items-center justify-between pt-2.5 border-t border-border/20">
                    <Skeleton className="h-2.5 w-16" />
                    <Skeleton className="h-2.5 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS STATE */}
      {hasSearched && !isFetching && results.length > 0 && (
        <div className="space-y-8 animate-fade-in">

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
                      <span>{timeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* EMPTY RESULT STATE */}
      {hasSearched && !isFetching && results.length === 0 && (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">No matches found</h3>
          <p className="text-xs text-muted-foreground">
            We couldn&apos;t find items matching your query. Try searching for other concepts like &quot;SaaS&quot;, &quot;Linear&quot;, or &quot;Pricing&quot;.
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
