"use client";

import React, { useState } from "react";
import { Upload, Link as LinkIcon, StickyNote, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CapturePage() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      alert(`Dropped file: ${e.dataTransfer.files[0].name}. Memora is parsing contents.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quick Capture</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Drag and drop screenshots, mockups, or paste URL references directly into your memory engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Drag and Drop Zone */}
        <div className="md:col-span-2">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl aspect-video w-full flex flex-col items-center justify-center p-6 text-center transition-all ${
              dragActive ? "border-primary bg-primary/5 text-primary" : "border-border/60 text-muted-foreground hover:border-primary/30"
            }`}
          >
            <Upload className="h-10 w-10 mb-4 stroke-[1.5]" />
            <h3 className="text-sm font-bold text-foreground">Drag and drop screenshots or files here</h3>
            <p className="text-[10px] text-muted-foreground mt-1 max-w-xs leading-relaxed">
              We extract text automatically from screenshots (OCR) and categorize pdf files under AI research topics.
            </p>
          </div>
        </div>

        {/* Links / Notes capture panel */}
        <div className="space-y-6 text-xs font-semibold text-foreground/80">
          <div className="p-5 border border-border/60 bg-card rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-foreground">Save URL Link</h3>
            <div className="relative flex items-center">
              <LinkIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="https://example.com" 
                className="w-full bg-background border border-input rounded-xl pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none"
              />
            </div>
            <Button className="w-full h-9 rounded-full bg-primary text-white text-[10px] font-bold">Save Link</Button>
          </div>

          <div className="p-5 border border-border/60 bg-card rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-foreground">Quick Text Note</h3>
            <textarea 
              placeholder="Write a thought down..." 
              rows={3}
              className="w-full bg-background border border-input rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none resize-none"
            />
            <Button className="w-full h-9 rounded-full bg-primary text-white text-[10px] font-bold">Save Note</Button>
          </div>
        </div>

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
