"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AccountSettingsPage() {
  const [name, setName] = useState("Subham Jyoti");
  const [email, setEmail] = useState("subham@memora.io");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-md text-xs font-semibold">
      
      <div className="space-y-1 pb-4 border-b border-border/25">
        <h3 className="text-sm font-bold text-foreground">Profile Settings</h3>
        <p className="text-[10px] text-muted-foreground">Manage your credentials and details.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Avatar block */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm select-none">
            SJ
          </div>
          <div>
            <button type="button" onClick={() => alert("Upload logo image mockup...")} className="text-[10px] text-primary hover:underline">
              Change Avatar
            </button>
            <p className="text-[9px] text-muted-foreground mt-0.5">JPG or PNG. Max 2MB.</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-wider text-muted-foreground">Full name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-wider text-muted-foreground">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border border-input rounded-xl px-3 py-2 text-foreground focus:outline-none"
          />
        </div>

        <div className="space-y-1 pt-2">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Connected accounts</span>
          <div className="flex gap-2 pt-1 font-mono text-[9.5px]">
            <span className="bg-muted px-2.5 py-1 rounded border border-border/60">Google OAuth</span>
            <span className="bg-muted px-2.5 py-1 rounded border border-border/60 text-muted-foreground">GitHub (Unlinked)</span>
          </div>
        </div>

        <Button type="submit" className="h-9 px-4 rounded-full bg-primary text-white font-bold">
          Save changes
        </Button>

      </form>
    </div>
  );
}
