"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles, Globe, Video, Image as ImageIcon, Code, FileText, StickyNote, Plus, Search,
  Settings, HelpCircle, Bell, ArrowRight, X, Trash2, FolderOpen, ChevronRight, ChevronDown,
  MoreHorizontal, Star, Grid, List, Copy, Archive, Edit, ExternalLink, ArrowLeft, FolderPlus,
  Heart, Check
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

export default function MemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Note states
  const [userNote, setUserNote] = useState("I liked the clean side navigation, minimal metrics grids, and keyboard shortcut helpers of the Linear settings page.");
  const [isEditing, setIsEditing] = useState(false);
  const [starred, setStarred] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock retrieve data based on id
  const memoryInfo = {
    title: id === "mem-2" ? "Building a SaaS in 2026" : "Linear Dashboard",
    type: id === "mem-2" ? "video" : "web",
    source: id === "mem-2" ? "youtube.com/watch?v=saas2026" : "linear.app/features",
    timeAgo: "Saved Aug 24, 2026",
    tags: ["Design", "SaaS", "Inspiration"],
    duration: id === "mem-2" ? "12:42" : undefined
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-border/20 pb-4">
        <button 
          onClick={() => router.back()} 
          className="text-xs font-semibold hover:text-primary flex items-center gap-1 text-muted-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to library
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setStarred(!starred)}
            className="h-9 w-9 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-amber-500 transition-colors"
          >
            <Star className={cn("h-4 w-4", starred ? "fill-amber-500 text-amber-500" : "")} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="h-9 w-9 rounded-full border border-border/60 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/app/collections")}>
                <FolderOpen className="h-3.5 w-3.5" /> Move to collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                toast.add({ title: "Moved to archive", description: memoryInfo.title, type: "success" });
                router.push("/app/archive");
              }}>
                <Archive className="h-3.5 w-3.5" /> Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-3.5 w-3.5" /> Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move "{memoryInfo.title}" to trash?</AlertDialogTitle>
            <AlertDialogDescription>
              You can restore it from Trash within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                toast.add({ title: "Moved to trash", description: memoryInfo.title, type: "success" });
                router.push("/app/memories");
              }}
            >
              Move to trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Split grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 columns: Preview & User Notes */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Visual Source Preview */}
          <div className="space-y-3">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
              {memoryInfo.type.toUpperCase()} PREVIEW
            </span>
            
            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="aspect-video w-full rounded-lg bg-muted border border-border/75 flex flex-col items-center justify-center gap-3 relative overflow-hidden text-xs text-muted-foreground font-bold">
                {memoryInfo.type === "video" ? (
                  <>
                    <Video className="h-10 w-10 text-red-500" />
                    <span>YouTube Video Player Mock ({memoryInfo.duration})</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-10 w-10 text-primary" />
                    <span>Website Screenshot Frame Preview</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-mono text-muted-foreground truncate max-w-sm">{memoryInfo.source}</span>
              <a 
                href={memoryInfo.source.startsWith("http") ? memoryInfo.source : `https://${memoryInfo.source}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold hover:underline flex items-center gap-0.5"
              >
                Open original <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* User Notes editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                Your Note
              </span>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-primary hover:underline"
              >
                {isEditing ? "Done" : "Edit note"}
              </button>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card min-h-[100px] text-xs leading-relaxed text-foreground">
                {isEditing ? (
                  <textarea
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    className="w-full bg-transparent resize-none focus:outline-none"
                    rows={4}
                  />
                ) : (
                  <p>{userNote || "No custom note added. Click edit to save context reasons."}</p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Memora AI Understanding metadata */}
        <div className="space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-primary">
              <Sparkles className="h-4 w-4 fill-current" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Memora understood</h3>
            </div>

            <div className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card space-y-4 text-xs">
                
                {/* AI Summary */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-muted-foreground block">AI SUMMARY</span>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    A clean SaaS workspace focusing on dynamic tags layout grids, minimalist navigation sidebars, and keyboard shortcut helpers.
                  </p>
                </div>

                {/* Topics */}
                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono text-muted-foreground block">TOPICS</span>
                  <div className="flex flex-wrap gap-1">
                    {memoryInfo.tags.map(t => (
                      <span key={t} className="text-[8px] font-bold uppercase bg-primary/5 border border-primary/10 text-primary px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content metadata */}
                <div className="space-y-1 pt-2 border-t border-border/20">
                  <span className="text-[8px] font-mono text-muted-foreground block">ENTITIES FOUND</span>
                  <p className="text-[10px] text-foreground font-semibold">Linear team, SaaS, Payment models</p>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-muted-foreground block">CAPTURED ON</span>
                  <p className="text-[10px] text-foreground font-semibold">{memoryInfo.timeAgo}</p>
                </div>

              </div>
            </div>
          </div>

          {/* Related memories grid */}
          <div className="space-y-3">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
              Related to this
            </span>

            <div className="space-y-2">
              {[
                { title: "Dashboard reference", desc: "Design inspiration layout", similarity: "94%" },
                { title: "SaaS UI inspiration", desc: "Clean layout styles", similarity: "88%" }
              ].map((rel, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-[10px] select-none hover:border-primary/20 transition-all"
                >
                  <div>
                    <h5 className="font-bold text-foreground">{rel.title}</h5>
                    <span className="text-[8.5px] text-muted-foreground">{rel.desc}</span>
                  </div>
                  <span className="text-[8px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    {rel.similarity} match
                  </span>
                </div>
              ))}
            </div>
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
