"use client";

import React from "react";
import { Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrashPage() {
  const trashedItems = [
    { id: "mem-del-1", title: "Outdated RAG tutorial draft", source: "Notion page link", daysLeft: "14 days left" }
  ];

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
          <Button 
            onClick={() => alert("Trash emptied.")}
            className="rounded-full px-4 text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-sm h-9"
          >
            Empty Trash
          </Button>
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
                  <button 
                    onClick={() => alert("Restored to active index.")}
                    className="flex-1 h-8 rounded-full border border-border hover:bg-muted text-[10px] flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" /> Restore
                  </button>
                  <button 
                    onClick={() => alert("Deleted permanently.")}
                    className="flex-1 h-8 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/15 text-[10px] flex items-center justify-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Delete permanently
                  </button>
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
