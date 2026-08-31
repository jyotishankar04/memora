"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function PrivacySettingsPage() {
  return (
    <div className="space-y-6 max-w-md text-xs font-semibold">
      
      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">Privacy & Data</h3>
        <p className="text-[10px] text-muted-foreground">Manage your personal databases exports.</p>
      </div>

      <div className="space-y-4 text-xs font-semibold text-foreground/80">
        
        {/* Export Data */}
        <div className="p-4 border border-border bg-card rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-foreground">Export all memories</h4>
            <p className="text-[9.5px] text-muted-foreground mt-0.5 font-medium">Download JSON dump representing all parsed cards metadata.</p>
          </div>
          <Button disabled title="Coming soon" className="h-8 rounded-full text-[10px] font-bold border border-border bg-transparent text-muted-foreground opacity-60 cursor-not-allowed">
            Coming soon
          </Button>
        </div>

        {/* Download media */}
        <div className="p-4 border border-border bg-card rounded-xl flex items-center justify-between">
          <div>
            <h4 className="text-foreground">Download your files</h4>
            <p className="text-[9.5px] text-muted-foreground mt-0.5 font-medium">Download zip archive containing all screenshots and document uploads.</p>
          </div>
          <Button disabled title="Coming soon" className="h-8 rounded-full text-[10px] font-bold border border-border bg-transparent text-muted-foreground opacity-60 cursor-not-allowed">
            Coming soon
          </Button>
        </div>

        {/* Delete settings */}
        <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl space-y-4">
          <div>
            <h4 className="text-red-500 font-bold">Danger Zone</h4>
            <p className="text-[9.5px] text-muted-foreground mt-0.5 font-medium">Irreversible actions regarding account records.</p>
          </div>
          
          <div className="flex gap-2">
            <button
              disabled
              title="Coming soon"
              className="h-8 px-3 rounded-full border border-red-500/20 text-red-500 text-[9.5px] font-bold opacity-60 cursor-not-allowed"
            >
              Clear memories — Coming soon
            </button>
            <button
              disabled
              title="Coming soon"
              className="h-8 px-3 rounded-full bg-red-500 text-white text-[9.5px] font-bold opacity-60 cursor-not-allowed"
            >
              Delete account — Coming soon
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
