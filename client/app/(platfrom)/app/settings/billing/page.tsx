"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6 max-w-md text-xs font-semibold">
      
      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">Billing</h3>
        <p className="text-[10px] text-muted-foreground">Manage your workspace pricing models.</p>
      </div>

      <div className="space-y-4">
        
        {/* Active plan details */}
        <div className="p-5 border border-border bg-card rounded-xl space-y-4 text-xs font-semibold">
          <div className="flex justify-between items-center">
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Active Plan</span>
            <span className="text-[9px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
              FREE TIER
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">500 / 500 memories used</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              You&apos;ve hit the memory limit for the free tier. Upgrade to Pro for unlimited saves, full RAG semantic search, and transcript auto-syncs.
            </p>
          </div>

          <Button disabled title="Coming soon" className="w-full h-9 rounded-full bg-primary text-white font-bold text-[10px] opacity-60 cursor-not-allowed">
            Upgrade to Pro — Coming soon
          </Button>
        </div>

        {/* Pricing details table card */}
        <div className="p-4 border border-border/60 bg-muted/15 rounded-xl space-y-2 text-[10px] text-muted-foreground font-semibold">
          <h5 className="text-foreground">Pro features include:</h5>
          <ul className="list-disc pl-4 space-y-1">
            <li>Unlimited memory index slots</li>
            <li>Custom collections organization</li>
            <li>Full Ask Memora semantic chat queries</li>
            <li>Web browser and smartphone plugins auto-sync</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
