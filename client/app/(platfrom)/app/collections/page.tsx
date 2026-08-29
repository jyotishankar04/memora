"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCollectionsQuery, useCreateCollectionMutation } from "@/context/MemoryContext";

const COLOR_PALETTE = [
  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "bg-pink-500/10 text-pink-500 border-pink-500/20",
  "bg-teal-500/10 text-teal-500 border-teal-500/20",
  "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
];

function colorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

function updatedAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 1) return "Updated just now";
  if (hours < 24) return `Updated ${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `Updated ${days} day${days === 1 ? "" : "s"} ago`;
}

export default function CollectionsPage() {
  const { data: collections = [], isLoading } = useCollectionsQuery();
  const createMutation = useCreateCollectionMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newEmoji, setNewEmoji] = useState("📁");

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await createMutation.mutateAsync({
      name: newName.trim(),
      icon: newEmoji.trim() || "📁",
      description: newDesc.trim() || undefined,
    });
    setNewName("");
    setNewDesc("");
    setShowAddModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">

      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-border/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Organize your memories around the topics that matter to you.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="rounded-full px-4 text-xs font-bold bg-primary text-white flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Collection
        </Button>
      </div>

      {/* Collections Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/45 bg-muted/75 p-1">
              <div className="p-5 rounded-lg border border-border/75 bg-card min-h-[150px] space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-2.5 w-4/5" />
                <div className="flex items-center justify-between pt-3 border-t border-border/20">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">No collections yet</h3>
          <p className="text-xs text-muted-foreground">Create one to start organizing your memories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/app/collections/${col.id}`}
              className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs hover:border-primary/20 transition-all duration-300 block group"
            >
              <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[150px] space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 border rounded-xl flex items-center justify-center text-lg select-none", colorFor(col.id))}>
                      {col.icon}
                    </div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {col.name}
                    </h3>
                  </div>

                  <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/20 text-[9px] font-mono text-muted-foreground">
                  <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded">{col.memoryCount} memories</span>
                  <span>{updatedAgo(col.updatedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CREATE COLLECTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl space-y-6 animate-scale-up">

            <div className="flex items-center justify-between border-b border-border/20 pb-2">
              <span className="text-xs font-bold text-foreground">Create collection</span>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-muted-foreground">Icon / Emoji</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., 🚀"
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-full bg-background border border-input rounded-xl px-3 py-2.5 text-foreground text-center"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-muted-foreground">Collection name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Projects"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-background border border-input rounded-xl px-3 py-2.5 text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  placeholder="What is this collection for?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-input rounded-xl px-3 py-2.5 text-foreground resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-10 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 h-10 rounded-full bg-primary text-white"
                >
                  {createMutation.isPending ? "Creating..." : "Create Collection"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Local animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
