"use client";

import React from "react";
import Link from "next/link";
import { Tag as TagIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTagsQuery } from "@/context/MemoryContext";

const COLOR_PALETTE = [
  "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/15",
  "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/15",
  "bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/15",
  "bg-teal-500/10 text-teal-500 border-teal-500/20 hover:bg-teal-500/15",
  "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/15",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15",
];

function colorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

export default function TagsPage() {
  const { data: tags = [], isLoading } = useTagsQuery();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div className="border-b border-border/20 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Every tag you&apos;ve used, in one place — click one to see everything saved under it.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">No tags yet</h3>
          <p className="text-xs text-muted-foreground">
            Add tags to a memory from its detail page or the capture form, and they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/app/tags/${encodeURIComponent(tag.name)}`}
              className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${colorFor(tag.id)}`}
            >
              <TagIcon className="h-3.5 w-3.5" />
              {tag.name}
              <span className="text-[10px] font-mono opacity-70">{tag.memoryCount}</span>
            </Link>
          ))}
        </div>
      )}

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
