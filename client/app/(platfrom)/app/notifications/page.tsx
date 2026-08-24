"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Sparkles, Check, Trash2, ArrowLeft, Globe, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  type: "rediscovery" | "system" | "billing";
  title: string;
  desc: string;
  timeAgo: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "rediscovery",
    title: "Surfaced Rediscovery Match",
    desc: "We identified 3 older saves about PostgreSQL indexing that align with your current development interests.",
    timeAgo: "2 hours ago",
    read: false
  },
  {
    id: "notif-2",
    type: "system",
    title: "Extension Sync Completed",
    desc: "Memora Chrome Extension successfully synchronized 12 bookmarked tabs into your library.",
    timeAgo: "Yesterday",
    read: true
  },
  {
    id: "notif-3",
    type: "billing",
    title: "Memory Limit Reached",
    desc: "You have used 500 / 500 free memory slot items. Upgrade to Pro to save more.",
    timeAgo: "3 days ago",
    read: false
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Stay updated with conceptual insights and system synchronization logs.
          </p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllRead}
              className="h-9 px-3 rounded-full border border-border/60 hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Check className="h-3.5 w-3.5" /> Mark all read
            </button>
            <button 
              onClick={clearAll}
              className="h-9 px-3 rounded-full border border-border/60 hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 border-b border-border/20 pb-2">
        <button 
          onClick={() => setFilter("all")}
          className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", filter === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
        >
          All Notifications ({notifications.length})
        </button>
        <button 
          onClick={() => setFilter("unread")}
          className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", filter === "unread" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length > 0 ? (
        <div className="space-y-4 max-w-2xl">
          {filtered.map((item) => {
            let Icon = Bell;
            let iconColor = "bg-primary/10 text-primary";
            if (item.type === "rediscovery") { Icon = Sparkles; iconColor = "bg-amber-500/10 text-amber-500"; }
            if (item.type === "system") { Icon = Globe; iconColor = "bg-emerald-500/10 text-emerald-500"; }
            if (item.type === "billing") { Icon = BarChart2; iconColor = "bg-red-500/10 text-red-500"; }

            return (
              <div 
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={cn(
                  "rounded-xl border p-1 shadow-xs transition-all cursor-pointer relative",
                  item.read ? "border-border/45 bg-muted/30 opacity-70" : "border-primary/20 bg-primary/5 hover:border-primary/30"
                )}
              >
                {/* Unread Indicator dot */}
                {!item.read && (
                  <span className="absolute top-3 right-3 h-2 w-2 bg-primary rounded-full" />
                )}

                <div className="p-4 rounded-lg border border-border/75 bg-card flex gap-4 text-xs font-semibold">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", iconColor)}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1 pr-4 min-w-0">
                    <h4 className="text-foreground truncate">{item.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                    <span className="text-[9px] text-muted-foreground font-mono block pt-1">{item.timeAgo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xs text-muted-foreground">No notifications to display.</p>
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
