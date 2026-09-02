"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckIcon as Check, LoaderCircleIcon as Loader2 } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useSettingsGroup } from "@/hooks/use-settings-group";

export default function AISettingsPage() {
  const { value: ai, loading, error, set } = useSettingsGroup("ai");

  return (
    <div className="space-y-6 max-w-md text-xs font-semibold">

      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">AI Features</h3>
        <p className="text-[10px] text-muted-foreground">Manage personal memory models settings.</p>
      </div>

      {loading && <HugeiconsIcon icon={Loader2} strokeWidth={2.25} className="h-4 w-4 animate-spin text-muted-foreground" />}
      {error && <p className="text-[10px] text-destructive">{error}</p>}

      {ai && (
        <div className="space-y-4">
          {(
            [
              { key: "autoOrganization", title: "Automatic organization", desc: "Sort incoming cards into appropriate folder collections." },
              { key: "summaries", title: "AI summaries", desc: "Write quick summaries detailing content scope." },
              { key: "relatedMemories", title: "Related memories mapping", desc: "Display connected similarity nodes." },
              { key: "semanticSearch", title: "Semantic search capabilities", desc: "Query libraries using descriptive tags." },
              { key: "askMemora", title: "Ask SaveForLatter assistant chatbot", desc: "Enable conceptual conversation queries." },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => set(item.key, !ai[item.key])}
              className="w-full text-left p-3.5 border border-border bg-card rounded-xl hover:border-primary/20 transition-all flex items-start justify-between gap-4"
            >
              <div>
                <h4 className="text-foreground">{item.title}</h4>
                <p className="text-[9.5px] text-muted-foreground mt-0.5 leading-relaxed font-medium">{item.desc}</p>
              </div>

              <div
                className={cn(
                  "h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-all",
                  ai[item.key] ? "bg-primary border-primary text-white" : "border-border bg-background"
                )}
              >
                {ai[item.key] && <HugeiconsIcon icon={Check} strokeWidth={2.25} className="h-3.5 w-3.5 stroke-[2.5]" />}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
