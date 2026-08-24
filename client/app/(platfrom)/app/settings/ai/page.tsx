"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AISettingsPage() {
  const [features, setFeatures] = useState({
    autoOrg: true,
    summaries: true,
    related: true,
    search: true,
    askMemora: true
  });

  const toggle = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-md text-xs font-semibold">
      
      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">AI Features</h3>
        <p className="text-[10px] text-muted-foreground">Manage personal memory models settings.</p>
      </div>

      <div className="space-y-4">
        
        {[
          { key: "autoOrg" as const, title: "Automatic organization", desc: "Sort incoming cards into appropriate folder collections." },
          { key: "summaries" as const, title: "AI summaries", desc: "Write quick summaries detailing content scope." },
          { key: "related" as const, title: "Related memories mapping", desc: "Display connected similarity nodes." },
          { key: "search" as const, title: "Semantic search capabilities", desc: "Query libraries using descriptive tags." },
          { key: "askMemora" as const, title: "Ask Memora assistant chatbot", desc: "Enable conceptual conversation queries." }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => toggle(item.key)}
            className="w-full text-left p-3.5 border border-border bg-card rounded-xl hover:border-primary/20 transition-all flex items-start justify-between gap-4"
          >
            <div>
              <h4 className="text-foreground">{item.title}</h4>
              <p className="text-[9.5px] text-muted-foreground mt-0.5 leading-relaxed font-medium">{item.desc}</p>
            </div>
            
            <div className={cn(
              "h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-all",
              features[item.key] ? "bg-primary border-primary text-white" : "border-border bg-background"
            )}>
              {features[item.key] && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
            </div>
          </button>
        ))}

      </div>
    </div>
  );
}
