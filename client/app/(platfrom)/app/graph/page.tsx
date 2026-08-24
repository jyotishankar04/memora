"use client";

import React, { useState } from "react";
import { Sparkles, Maximize2, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GraphPage() {
  const [zoom, setZoom] = useState(1);

  // Nodes of memory graph
  const nodes = [
    { label: "AI", x: "top-[20%] left-[25%]", color: "bg-primary text-white border-primary" },
    { label: "RAG", x: "top-[40%] left-[15%]", color: "bg-card text-foreground border-border/80" },
    { label: "Agents", x: "top-[45%] left-[40%]", color: "bg-card text-foreground border-border/80" },
    { label: "Embeddings", x: "top-[65%] left-[20%]", color: "bg-card text-foreground border-border/80" },
    { label: "Tools", x: "top-[70%] left-[45%]", color: "bg-card text-foreground border-border/80" },
    { label: "Projects", x: "top-[85%] left-[30%]", color: "bg-card text-foreground border-border/80" },
    { label: "SaaS", x: "top-[30%] left-[70%]", color: "bg-primary text-white border-primary" },
    { label: "Pricing UI", x: "top-[50%] left-[75%]", color: "bg-card text-foreground border-border/80" },
    { label: "Design", x: "top-[20%] left-[80%]", color: "bg-card text-foreground border-border/80" }
  ];

  return (
    <div className="h-full w-full flex flex-col overflow-hidden relative">
      
      {/* Search Header Overlay */}
      <div className="absolute top-6 left-6 z-10 space-y-2">
        <h1 className="text-xl font-bold tracking-tight">Memory Graph</h1>
        <p className="text-[10px] text-muted-foreground leading-none">A conceptual network mapping your saves.</p>
      </div>

      <div className="absolute top-6 right-6 z-10 flex items-center gap-2 text-xs font-semibold">
        <div className="flex border border-border/60 bg-card rounded-lg overflow-hidden shrink-0">
          <button onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))} className="p-2 hover:bg-muted font-bold">-</button>
          <span className="p-2 select-none border-x border-border/40 font-mono text-[10px]">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))} className="p-2 hover:bg-muted font-bold">+</button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-muted/10 relative overflow-hidden flex items-center justify-center p-10 select-none">
        
        {/* Connections SVG background */}
        <svg className="absolute inset-0 h-full w-full stroke-primary/10 stroke-[2] pointer-events-none">
          {/* Mock lines */}
          <line x1="25%" y1="20%" x2="15%" y2="40%" />
          <line x1="25%" y1="20%" x2="40%" y2="45%" />
          <line x1="15%" y1="40%" x2="20%" y2="65%" />
          <line x1="40%" y1="45%" x2="45%" y2="70%" />
          <line x1="20%" y1="65%" x2="30%" y2="85%" />
          <line x1="45%" y1="70%" x2="30%" y2="85%" />
          <line x1="70%" y1="30%" x2="75%" y2="50%" />
          <line x1="70%" y1="30%" x2="80%" y2="20%" />
          <line x1="25%" y1="20%" x2="70%" y2="30%" className="stroke-primary/5" />
        </svg>

        {/* Nodes Wrapper */}
        <div 
          className="absolute inset-0 transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {nodes.map((node, idx) => (
            <div 
              key={idx}
              className={`absolute ${node.x} px-3 py-1.5 border rounded-full text-xs font-bold shadow-xs hover:border-primary hover:text-primary transition-all cursor-pointer select-none`}
            >
              {node.label}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
