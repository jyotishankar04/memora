"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsSettingsPage() {
  const [notifs, setNotifs] = useState({
    weekly: true,
    forgotten: true,
    product: false
  });

  const toggle = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-md text-xs font-semibold">
      
      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">Notifications</h3>
        <p className="text-[10px] text-muted-foreground">Manage your rediscovery alerts frequencies.</p>
      </div>

      <div className="space-y-4">
        
        {[
          { key: "weekly" as const, title: "Weekly memories summary email", desc: "Receive highlights of items saved during the week." },
          { key: "forgotten" as const, title: "Forgotten memories alerts", desc: "Periodic notification of high-value saves from months ago." },
          { key: "product" as const, title: "Product news & announcements", desc: "Notifications detailing browser plugin releases." }
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
              notifs[item.key] ? "bg-primary border-primary text-white" : "border-border bg-background"
            )}>
              {notifs[item.key] && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
            </div>
          </button>
        ))}

      </div>
    </div>
  );
}
