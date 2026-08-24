"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [accent, setAccent] = useState("blue");

  return (
    <div className="space-y-6 max-w-md text-xs font-semibold">
      
      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">Appearance</h3>
        <p className="text-[10px] text-muted-foreground">Adjust visual themes and accents.</p>
      </div>

      <div className="space-y-4">
        
        {/* Theme select */}
        <div className="space-y-2">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Interface Theme</span>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", label: "Light Theme" },
              { id: "dark", label: "Dark Theme" },
              { id: "system", label: "System Default" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "p-3 rounded-xl border text-center font-bold transition-all text-[10px]",
                  theme === t.id 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-border/60 hover:bg-muted text-muted-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accent select */}
        <div className="space-y-2 pt-2">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Accent Color</span>
          
          <div className="flex gap-3">
            {[
              { id: "blue", color: "bg-[#1447E6]", label: "Blue" },
              { id: "purple", color: "bg-purple-600", label: "Purple" },
              { id: "green", color: "bg-emerald-600", label: "Green" },
              { id: "orange", color: "bg-orange-600", label: "Orange" }
            ].map((acc) => (
              <button
                key={acc.id}
                onClick={() => { setAccent(acc.id); alert(`Accent switched to ${acc.label} conceptually.`); }}
                className={cn(
                  "h-8 px-3 rounded-full border flex items-center gap-1.5 transition-all text-[10px]",
                  accent === acc.id 
                    ? "border-primary text-primary bg-primary/5 font-bold" 
                    : "border-border/60 hover:bg-muted text-muted-foreground"
                )}
              >
                <span className={cn("h-3 w-3 rounded-full shrink-0", acc.color)} />
                <span>{acc.label}</span>
              </button>
            ))}
          </div>
          
          {accent === "blue" && (
            <p className="text-[9px] text-muted-foreground mt-1">
              Active primary: <span className="font-mono text-foreground font-semibold">#1447E6</span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
