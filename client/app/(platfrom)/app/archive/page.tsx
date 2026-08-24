"use client";

import React from "react";
import { Archive, RotateCcw, Trash2 } from "lucide-react";

export default function ArchivePage() {
  const archives = [
    { id: "mem-6", title: "Raycast Store Extension", type: "web", source: "raycast.com" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Archive</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Archived memories won't appear in your active home or search views unless restored.
        </p>
      </div>

      {archives.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl text-xs font-semibold">
          {archives.map((item) => (
            <div key={item.id} className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
              <div className="p-4 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[120px] space-y-4">
                <div>
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
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xs text-muted-foreground">Your archive vault is empty.</p>
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
