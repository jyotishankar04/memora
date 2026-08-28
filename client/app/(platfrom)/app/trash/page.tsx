"use client";

import React, { useState } from "react";
import { Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function TrashPage() {
  const [trashedItems, setTrashedItems] = useState([
    { id: "mem-del-1", title: "Outdated RAG tutorial draft", source: "Notion page link", daysLeft: "14 days left" }
  ]);

  const handleRestore = (id: string, title: string) => {
    setTrashedItems((prev) => prev.filter((item) => item.id !== id));
    toast.add({ title: "Restored to active index", description: title, type: "success" });
  };

  const handleDeletePermanently = (id: string, title: string) => {
    setTrashedItems((prev) => prev.filter((item) => item.id !== id));
    toast.add({ title: "Deleted permanently", description: title, type: "success" });
  };

  const handleEmptyTrash = () => {
    setTrashedItems([]);
    toast.add({ title: "Trash emptied", type: "success" });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trash</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Items in trash are permanently deleted after 30 days.
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
                  This will permanently delete all {trashedItems.length} item{trashedItems.length === 1 ? "" : "s"} in your trash. This action can't be undone.
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

      {trashedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl text-xs font-semibold">
          {trashedItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[130px] space-y-4">
                <div>
                  <div className="flex justify-between items-center text-[8.5px] font-mono text-red-500 font-bold mb-1">
                    <span>TRASHED</span>
                    <span>{item.daysLeft}</span>
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
                    <RotateCcw className="h-3 w-3" /> Restore
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="outline"
                          className="flex-1 h-8 rounded-full bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/15 text-[10px] font-semibold"
                        >
                          <Trash2 className="h-3 w-3" /> Delete permanently
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{item.title}" permanently?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action can't be undone.
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xs text-muted-foreground">Your trash is empty.</p>
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
