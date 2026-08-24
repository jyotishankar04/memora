"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CaptureSettingsPage() {
  const [settings, setSettings] = useState({
    extractContent: true,
    genTitle: true,
    genSummary: true,
    suggestTags: true
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-md text-xs font-semibold">
      
      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">Capture Settings</h3>
        <p className="text-[10px] text-muted-foreground">Adjust bookmark extraction behaviors.</p>
      </div>

      <div className="space-y-4">
        
        {/* Toggle List */}
        {[
          { key: "extractContent" as const, title: "Automatically extract page content", desc: "Fetch body text from URL to indexing databases." },
          { key: "genTitle" as const, title: "Generate title", desc: "Use AI to clean web metadata headings." },
          { key: "genSummary" as const, title: "Generate summary", desc: "Create concise intent summaries." },
          { key: "suggestTags" as const, title: "Suggest tags", desc: "Auto-extract tags for folder structures." }
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
              settings[item.key] ? "bg-primary border-primary text-white" : "border-border bg-background"
            )}>
              {settings[item.key] && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
            </div>
          </button>
        ))}

        {/* Default collection */}
        <div className="space-y-2 pt-2">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Default Collection</span>
          <select className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none">
            <option>None (Inbox)</option>
            <option>SaaS Inspiration</option>
            <option>AI Research</option>
            <option>Design</option>
          </select>
        </div>

      </div>
    </div>
  );
}
