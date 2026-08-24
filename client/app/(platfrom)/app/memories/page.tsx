"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Globe, Video, Image as ImageIcon, Code, FileText, StickyNote, Plus, Search, 
  Settings, HelpCircle, Bell, ArrowRight, X, Trash2, FolderOpen, ChevronRight, ChevronDown, 
  MoreHorizontal, Star, Grid, List, Copy, Archive, Edit, ExternalLink, ArrowLeft, FolderPlus,
  Heart, Check
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
  platform?: string;
  favicon?: string;
  fileType?: string;
  group: "Today" | "Yesterday" | "Earlier this week" | "August 2026";
  starred?: boolean;
}

const initialMemories: Memory[] = [
  {
    id: "mem-1",
    type: "web",
    title: "Linear Dashboard",
    description: "SaaS Dashboard inspiration. Clean sidebar navigation, custom dark colors, shortcuts helper.",
    source: "linear.app/features",
    timeAgo: "2 hours ago",
    tags: ["Design", "SaaS"],
    favicon: "L",
    group: "Today",
    starred: true
  },
  {
    id: "mem-2",
    type: "video",
    title: "Building a SaaS in 2026",
    description: "Under the hood of monorepos, vector indexers, and local-first billing configurations.",
    source: "youtube.com/watch?v=saas2026",
    timeAgo: "4 hours ago",
    tags: ["Development", "SaaS"],
    duration: "12:42",
    platform: "YouTube",
    group: "Today"
  },
  {
    id: "mem-3",
    type: "note",
    title: "Memora duplicate saves idea",
    description: "What if Memora could automatically detect duplicate saves and merge summaries together?",
    source: "Personal Note",
    timeAgo: "Saved yesterday",
    tags: ["Product idea", "AI"],
    group: "Yesterday"
  },
  {
    id: "mem-4",
    type: "image",
    title: "SaaS Pricing UI Reference",
    description: "Screenshot showing clean card grids, pricing models in local currency, and subtle border dividers.",
    source: "screenshot_pricing.png",
    timeAgo: "Saved 2 days ago",
    tags: ["Design", "SaaS"],
    group: "Earlier this week"
  },
  {
    id: "mem-5",
    type: "document",
    title: "Vector DB Performance Comparison",
    description: "Research summary logging latency checks of pgvector vs Pinecone vs Qdrant.",
    source: "vector_db_sheet.pdf",
    timeAgo: "Saved 4 days ago",
    tags: ["AI", "Research"],
    fileType: "PDF",
    group: "Earlier this week"
  },
  {
    id: "mem-6",
    type: "web",
    title: "Raycast Store",
    description: "Clean layout of extension grid, detailed sidebar specifications, and keyboard navigation.",
    source: "raycast.com/store",
    timeAgo: "Saved 2 weeks ago",
    tags: ["Design", "Productivity"],
    favicon: "R",
    group: "August 2026"
  }
];

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [activeCardMenu, setActiveCardMenu] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    if (selectedMemory?.id === id) setSelectedMemory(null);
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const filteredMemories = memories.filter((mem) => {
    if (currentFilter !== "all") {
      if (currentFilter === "links" && mem.type !== "web") return false;
      if (currentFilter === "notes" && mem.type !== "note") return false;
      if (currentFilter === "videos" && mem.type !== "video") return false;
      if (currentFilter === "images" && mem.type !== "image") return false;
      if (currentFilter === "files" && mem.type !== "document") return false;
    }
    if (searchQuery) {
      const matchText = 
        mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mem.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchText) return false;
    }
    return true;
  });

  const timelineGroups: Array<"Today" | "Yesterday" | "Earlier this week" | "August 2026"> = [
    "Today", "Yesterday", "Earlier this week", "August 2026"
  ];

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      
      {/* Memories content list */}
      <div className="flex-1 overflow-y-auto px-6 py-10 space-y-8">
        
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-border/20 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Memories</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Browse your digital memory timeline &middot; <span className="font-semibold text-foreground">{filteredMemories.length} Saves</span>
            </p>
          </div>
          
          <Link 
            href="/app"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "rounded-full px-4 text-xs font-bold bg-primary text-white flex items-center gap-1.5"
            )}
          >
            <Plus className="h-4 w-4" /> Save
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          
          {/* Filters pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All" },
              { id: "links", label: "Websites" },
              { id: "notes", label: "Notes" },
              { id: "videos", label: "Videos" },
              { id: "images", label: "Images" },
              { id: "files", label: "Files" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all text-nowrap select-none",
                  currentFilter === tab.id
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls view togglers */}
          <div className="flex items-center gap-2 text-xs">
            
            {/* View selectors */}
            <div className="flex items-center border border-border/60 rounded-lg bg-card overflow-hidden">
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 hover:bg-muted transition-colors", viewMode === "grid" ? "text-primary bg-primary/5" : "text-muted-foreground")}
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 hover:bg-muted transition-colors", viewMode === "list" ? "text-primary bg-primary/5" : "text-muted-foreground")}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* Timeline body items */}
        {filteredMemories.length > 0 ? (
          <div className="space-y-10 pt-2">
            {timelineGroups.map((group) => {
              const groupItems = filteredMemories.filter(m => m.group === group);
              if (groupItems.length === 0) return null;

              return (
                <div key={group} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-mono">
                      {group}
                    </h3>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>

                  <div className={cn(
                    viewMode === "grid" 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-3"
                  )}>
                    {groupItems.map((item) => {
                      let TypeIcon = Globe;
                      if (item.type === "video") TypeIcon = Video;
                      if (item.type === "note") TypeIcon = StickyNote;
                      if (item.type === "image") TypeIcon = ImageIcon;
                      if (item.type === "document") TypeIcon = FileText;

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMemory(item)}
                          className={cn(
                            "rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 relative group cursor-pointer"
                          )}
                        >
                          <div className={cn(
                            "rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full transition-colors",
                            viewMode === "grid" ? "p-5 min-h-[190px] space-y-4" : "p-3.5 flex-row items-center gap-4"
                          )}>
                            
                            {viewMode === "grid" && (
                              <>
                                <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground relative">
                                  <span className="bg-primary/5 border border-primary/15 px-2 py-0.5 rounded text-primary uppercase font-bold flex items-center gap-1">
                                    <TypeIcon className="h-2.5 w-2.5" /> {item.type}
                                  </span>
                                  
                                  <div className="flex items-center gap-1.5">
                                    <button 
                                      onClick={(e) => toggleStar(item.id, e)}
                                      className="text-muted-foreground hover:text-amber-500 transition-colors"
                                    >
                                      <Star className={cn("h-3.5 w-3.5", item.starred ? "fill-amber-500 text-amber-500" : "")} />
                                    </button>

                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setActiveCardMenu(activeCardMenu === item.id ? null : item.id); }}
                                      className="text-muted-foreground hover:text-foreground h-6 w-6 rounded-full flex items-center justify-center hover:bg-muted"
                                    >
                                      <MoreHorizontal className="h-3.5 w-3.5" />
                                    </button>
                                  </div>

                                  {activeCardMenu === item.id && (
                                    <div className="absolute right-0 top-7 w-36 bg-card border border-border rounded-lg shadow-lg py-1 z-30 text-[10px] font-bold text-foreground">
                                      {[
                                        { label: "Copy link", icon: Copy, action: () => navigator.clipboard.writeText(item.source) },
                                        { label: "Delete", icon: Trash2, action: () => handleDelete(item.id) }
                                      ].map((m) => (
                                        <button
                                          key={m.label}
                                          onClick={(e) => { e.stopPropagation(); m.action(); setActiveCardMenu(null); }}
                                          className="w-full px-3 py-1.5 hover:bg-muted text-left flex items-center gap-2"
                                        >
                                          <m.icon className="h-3 w-3 opacity-60" />
                                          <span>{m.label}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {item.type !== "note" && (
                                  <div className="aspect-video w-full rounded-lg bg-muted border border-border/30 overflow-hidden flex items-center justify-center text-[10px] text-muted-foreground font-semibold select-none">
                                    {item.type === "video" ? (
                                      <div className="flex flex-col items-center gap-1">
                                        <Video className="h-5 w-5 text-red-500" />
                                        <span>YouTube Video ({item.duration})</span>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center gap-1">
                                        <Globe className="h-5 w-5 text-primary" />
                                        <span>Website Preview</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {item.type === "note" && (
                                  <div className="p-3 border border-border/60 bg-muted/20 rounded-lg text-[10px] text-muted-foreground leading-relaxed font-mono">
                                    {item.description}
                                  </div>
                                )}

                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-primary transition-colors leading-snug line-clamp-1">
                                    {item.title}
                                  </h4>
                                  <span className="text-[9px] text-muted-foreground truncate block font-mono">
                                    {item.source}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border/20">
                                  <div className="flex flex-wrap gap-1">
                                    {item.tags.map(t => (
                                      <span key={t} className="text-[7.5px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                  <span className="text-[9px] text-muted-foreground font-mono">{item.timeAgo}</span>
                                </div>
                              </>
                            )}

                            {viewMode === "list" && (
                              <div className="flex-1 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <TypeIcon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                      {item.title}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground truncate font-mono mt-0.5">{item.source}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0 font-mono text-[9px] text-muted-foreground">
                                  <span className="hidden sm:inline">{item.timeAgo}</span>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                    className="h-8 w-8 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 max-w-sm mx-auto space-y-4">
            <h3 className="text-sm font-semibold text-foreground">No saves match current filters</h3>
            <p className="text-xs text-muted-foreground">Try clearing tags filters or search query to browse files.</p>
          </div>
        )}

      </div>

      {/* DETAIL SLIDE DRAWER */}
      {selectedMemory && (
        <div className="w-80 border-l border-border bg-card flex flex-col shrink-0 z-40 relative animate-slide-left">
          
          <div className="p-5 border-b border-border/20 flex items-center justify-between shrink-0">
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-foreground truncate">{selectedMemory.title}</h3>
              <span className="text-[9px] font-mono text-muted-foreground truncate block">{selectedMemory.source}</span>
            </div>
            <button 
              onClick={() => setSelectedMemory(null)}
              className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs leading-relaxed">
            
            <div className="aspect-video w-full rounded-lg bg-muted border border-border/45 flex items-center justify-center text-[10px] text-muted-foreground font-bold">
              Website Preview
            </div>

            <div className="space-y-1">
              <span className="text-[8px] font-mono text-muted-foreground">DESCRIPTION</span>
              <p className="text-[10px] text-foreground/90 font-medium">{selectedMemory.description}</p>
            </div>

            <div className="space-y-1 border-t border-border/20 pt-3">
              <span className="text-[8px] font-mono text-muted-foreground block">TAGS</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedMemory.tags.map(tag => (
                  <span key={tag} className="text-[8px] font-bold uppercase tracking-wider bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-border/20 pt-4">
              <div className="flex items-center gap-1 text-primary">
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                <span className="text-[9px] font-bold uppercase tracking-wider">AI Summary</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                A dynamic RAG segment summarizing pricing elements and dashboard configurations. Saved similarly to 3 other design references.
              </p>
            </div>

            <div className="pt-4">
              <Link 
                href={`/app/memories/${selectedMemory.id}`}
                className="w-full h-10 rounded-full border border-border text-foreground text-xs font-semibold flex items-center justify-center hover:bg-muted"
              >
                Open detailed view &rarr;
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Drawer animations CSS */}
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
