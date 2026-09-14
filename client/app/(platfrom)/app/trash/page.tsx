"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon as Trash2, RotateCcwIcon as RotateCcw } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
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
import { useDeleteMemoryMutation, useMemoriesQuery, useUpdateMemoryMutation } from "@/context/MemoryContext";
import { QueryErrorState } from "@/components/query-error-state";

// Mirrors TRASH_RETENTION_DAYS in server/src/modules/memory/trash-purge.job.ts —
// display-only, so keep the two in sync if the retention window ever changes.
const TRASH_RETENTION_DAYS = 15;

/** Days left before the purge job hard-deletes this, or null if trashedAt is missing (shouldn't happen once a memory is actually trashed). */
function daysUntilPurge(trashedAt: string | null): number | null {
  if (!trashedAt) return null;
  const purgesAt = new Date(trashedAt).getTime() + TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((purgesAt - Date.now()) / (24 * 60 * 60 * 1000)));
}

export default function TrashPage() {
  const { data, isLoading, isError, refetch } = useMemoriesQuery({ inTrash: true, limit: 100 });
  const trashedItems = data?.items ?? [];

  const updateMutation = useUpdateMemoryMutation();
  const deleteMutation = useDeleteMemoryMutation();

  const handleRestore = (id: string, title: string) => {
    updateMutation.mutate(
      { id, patch: { inTrash: false } },
      {
        onSuccess: () => toast.add({ title: "Restored to active index", description: title, type: "success" }),
        onError: (err) => toast.add({ title: "Couldn't restore that memory", description: err instanceof Error ? err.message : undefined, type: "error" }),
      },
    );
  };

  const handleDeletePermanently = (id: string, title: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.add({ title: "Deleted permanently", description: title, type: "success" }),
      onError: (err) => toast.add({ title: "Couldn't delete that memory", description: err instanceof Error ? err.message : undefined, type: "error" }),
    });
  };

  const handleEmptyTrash = async () => {
    try {
      await Promise.all(trashedItems.map((item) => deleteMutation.mutateAsync(item.id)));
      toast.add({ title: "Trash emptied", type: "success" });
    } catch (err) {
      toast.add({ title: "Couldn't empty trash", description: err instanceof Error ? err.message : undefined, type: "error" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trash</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Deleted memories stay here for {TRASH_RETENTION_DAYS} days before they&apos;re permanently deleted, unless you restore them first.
          </p>
        </div>

        {trashedItems.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button className="rounded-full px-4 text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-sm h-9">
                  Empty Trash
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Empty trash?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {trashedItems.length} item{trashedItems.length === 1 ? "" : "s"} in your trash. This action can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white" onClick={handleEmptyTrash}>
                  Empty Trash
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {isError ? (
        <QueryErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/45 bg-muted/75 p-1">
              <div className="p-4 rounded-lg border border-border/75 bg-card min-h-[130px] space-y-3">
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : trashedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl text-xs font-semibold">
          {trashedItems.map((item) => {
            const daysLeft = daysUntilPurge(item.trashedAt);
            return (
            <div key={item.id} className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[130px] space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[8.5px] font-mono text-red-500 font-bold">TRASHED</span>
                    {daysLeft !== null && (
                      <span className="text-[8.5px] font-mono text-muted-foreground">
                        {daysLeft === 0 ? "Purges today" : `Purges in ${daysLeft}d`}
                      </span>
                    )}
                  </div>
                  <h4 className="text-foreground leading-snug">{item.title}</h4>
                  <span className="text-[9px] text-muted-foreground font-mono mt-0.5 block">{item.source}</span>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border/20">
                  <Button
                    variant="outline"
                    onClick={() => handleRestore(item.id, item.title)}
                    className="flex-1 h-8 rounded-full text-[10px] font-semibold"
                  >
                    <HugeiconsIcon icon={RotateCcw} strokeWidth={2.25} className="h-3 w-3" /> Restore
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="outline"
                          className="flex-1 h-8 rounded-full bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/15 text-[10px] font-semibold"
                        >
                          <HugeiconsIcon icon={Trash2} strokeWidth={2.25} className="h-3 w-3" /> Delete permanently
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete &ldquo;{item.title}&rdquo; permanently?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action can&apos;t be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleDeletePermanently(item.id, item.title)}
                        >
                          Delete permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 max-w-sm mx-auto space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Your trash is empty</h3>
          <p className="text-xs text-muted-foreground">Deleted memories will show up here before they&apos;re gone for good.</p>
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
