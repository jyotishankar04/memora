"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles, Globe, Video, Image as ImageIcon, Code, FileText, StickyNote, Plus, Search,
  FolderOpen, ChevronRight, X, ArrowLeft, MoreHorizontal, Edit, Share2, Grid, List, Trash2, Copy
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const mockCollectionMemories: Record<string, Memory[]> = {
  saas: [
    {
      id: "mem-1",
      type: "web",
      title: "Linear Dashboard",
      description: "SaaS Dashboard inspiration. Clean sidebar navigation, custom dark colors, shortcuts helper.",
      source: "linear.app/features",
      timeAgo: "Saved 2 hours ago",
      tags: ["Design", "SaaS"]
    },
    {
      id: "mem-4",
      type: "image",
      title: "SaaS Pricing UI Reference",
      description: "Screenshot showing clean card grids, pricing models in local currency, and subtle border dividers.",
      source: "screenshot_pricing.png",
      timeAgo: "Saved 2 days ago",
      tags: ["Design", "SaaS"]
    }
  ],
  ai: [
    {
      id: "mem-5",
      type: "web",
      title: "Vector DB Performance Comparison",
      description: "Research summary logging latency checks of pgvector vs Pinecone vs Qdrant.",
      source: "vector_db_sheet.pdf",
      timeAgo: "Saved 4 days ago",
      tags: ["AI", "Research"]
    }
  ]
};

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Get memories or default empty
  const collectionMemories = mockCollectionMemories[id] || [
    {
      id: "mem-1",
      type: "web",
      title: "Sample Resource",
      description: "Example saved item in the collection folder.",
      source: "example.com",
      timeAgo: "Saved 1 week ago",
      tags: ["Demo"]
    }
  ];

  const filteredMemories = collectionMemories.filter((mem) => {
    if (!searchQuery) return true;
    return (
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      
      {/* Back button */}
      <button 
        onClick={() => router.push("/app/collections")} 
        className="text-xs font-semibold hover:text-primary flex items-center gap-1 text-muted-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to collections
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border/20 pb-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 border rounded-2xl bg-primary/5 border-primary/20 text-3xl flex items-center justify-center select-none shrink-0">
            {id === "saas" ? "🚀" : id === "ai" ? "🤖" : id === "design" ? "🎨" : "📁"}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight capitalize">
              {id.replace(/-/g, " ")}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-md">
              {id === "saas" 
                ? "Websites, user dashboards, pricing lists, and landing pages references."
                : "Research notes, guides, and document summaries for development."
              }
            </p>
            <span className="text-[10px] font-mono text-muted-foreground mt-2 block font-semibold">
              {collectionMemories.length} saved memories
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toast.add({ title: "Rename collection", description: "Editing collection details isn't available yet.", type: "info" })}
            className="h-9 px-3 rounded-full text-xs font-semibold"
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              toast.add({ title: "Link copied", description: "Collection link copied to clipboard.", type: "success" });
            }}
            className="h-9 px-3 rounded-full text-xs font-semibold"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.add({ title: "Collection duplicated", type: "success" })}>
                <Copy className="h-3.5 w-3.5" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-3.5 w-3.5" /> Delete collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this collection?</AlertDialogTitle>
                <AlertDialogDescription>
                  Memories inside won't be deleted, only unlinked from this collection.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    toast.add({ title: "Collection deleted", type: "success" });
                    router.push("/app/collections");
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="relative flex items-center max-w-xs w-full">
          <Search className="absolute left-3.5 h-4 w-4 text-primary stroke-[2.5] z-10" />
          <Input
            type="text"
            placeholder="Search this collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Button
            onClick={() => router.push("/app/capture")}
            className="h-9 px-4 rounded-full bg-primary text-white text-xs font-bold shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add memory
          </Button>

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

      {/* Memories Grid list */}
      <div className={cn(
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-3"
      )}>
        {filteredMemories.map((item) => (
          <Link
            key={item.id}
            href={`/app/memories/${item.id}`}
            className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 block group"
          >
            <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between h-full min-h-[165px] space-y-4">
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

              <div className="flex items-center justify-between pt-2.5 border-t border-border/20 text-[9px] text-muted-foreground font-mono">
                <span className="truncate max-w-[120px]">{item.source}</span>
                <span>{item.timeAgo}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 9. Memora suggests (AI integrations) */}
      <div className="space-y-4 pt-6 border-t border-border/20">
        <div className="flex items-center gap-1.5 text-primary">
          <Sparkles className="h-4 w-4 fill-current" />
          <h3 className="text-xs font-bold uppercase tracking-widest">Memora suggests</h3>
        </div>
        <p className="text-[10px] text-muted-foreground leading-none">
          Memories found with related vector indices that you might want to add to this collection:
        </p>

        <div className="rounded-xl border border-border/45 bg-muted/75 p-1 max-w-xl">
          <div className="p-4 rounded-lg border border-border/75 bg-card flex items-center justify-between text-xs font-semibold text-foreground">
            <div>
              <h4>Raycast Store Extension Layout</h4>
              <p className="text-[9px] text-muted-foreground font-mono mt-0.5">Design &middot; Productivity</p>
            </div>
            <button
              onClick={() => toast.add({ title: "Added to collection", description: "Raycast Store Extension Layout", type: "success" })}
              className="text-[10px] text-primary hover:underline"
            >
              Add to collection &rarr;
            </button>
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
