"use client";

import React, { useState } from "react";
import { FolderOpen, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImportPage() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const startImport = () => {
    setImporting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(false);
          alert("Import completed: 842 bookmarks parsed, 12 duplicates resolved.");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const sources = [
    { name: "Browser Bookmarks", desc: "Upload HTML bookmark files directly from Chrome, Safari or Firefox.", action: "Import" },
    { name: "Pocket", desc: "Sync all your saved articles, read later items, and highlights conceptually.", action: "Connect" },
    { name: "Notion", desc: "Scan pages from your workspaces databases and extract key RAG summaries.", action: "Connect" },
    { name: "Raindrop.io", desc: "Import collections, tags, and link backlogs in one click.", action: "Import" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Bring your bookmarks, articles, notes, and workspaces documents into Memora.
        </p>
      </div>

      {/* Progress Bar */}
      {importing && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 max-w-xl space-y-3 text-xs">
          <div className="flex justify-between items-center font-bold text-primary">
            <span className="flex items-center gap-1.5"><Loader2 className="h-4 w-4 animate-spin" /> Importing bookmarks...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground">Parsing files: {Math.floor(progress * 8.4)} / 842 records indexed.</p>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
        {sources.map((src, idx) => (
          <div key={idx} className="rounded-xl border border-border/45 bg-muted/75 p-1 shadow-xs">
            <div className="p-5 rounded-lg border border-border/75 bg-card flex flex-col justify-between min-h-[140px] space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-sm text-foreground">{src.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">{src.desc}</p>
              </div>
              
              <Button 
                onClick={src.action === "Import" ? startImport : () => alert("Connecting integration oauth...")}
                disabled={importing}
                className="me-auto h-8 px-4 rounded-full text-[10px] font-bold bg-primary text-white"
              >
                {src.action === "Import" ? "Import Bookmarks" : "Connect Account"}
              </Button>
            </div>
          </div>
        ))}
      </div>

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
