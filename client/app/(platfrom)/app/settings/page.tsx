"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser, UserAvatar } from "@/context/UserContext";
import { updateProfile } from "@/lib/user";
import { getSettings, type Settings } from "@/lib/settings";
import { cn } from "@/lib/utils";

export default function AccountSettingsPage() {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<Settings["connectedAccounts"] | null>(null);

  useEffect(() => {
    getSettings()
      .then((settings) => setConnectedAccounts(settings.connectedAccounts))
      .catch(() => {
        // non-critical — the rest of the page still works without this
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updateProfile({ name: name.trim() });
      setUser(updated);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save your changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
          <UserAvatar user={user} className="h-12 w-12 text-sm border border-primary/20" />
          <p className="text-[9px] text-muted-foreground">Synced automatically from your Google/GitHub sign-in.</p>
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
            disabled
            value={user.email}
            className="w-full bg-muted/40 border border-input rounded-xl px-3 py-2 text-muted-foreground cursor-not-allowed"
          />
          <p className="text-[9px] text-muted-foreground">Tied to your sign-in provider — can&apos;t be changed here.</p>
        </div>

        <div className="space-y-1 pt-2">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground block">Connected accounts</span>
          <div className="flex gap-2 pt-1 font-mono text-[9.5px]">
            <span
              className={cn(
                "px-2.5 py-1 rounded border",
                connectedAccounts?.google
                  ? "bg-muted border-border/60"
                  : "bg-muted border-border/60 text-muted-foreground"
              )}
            >
              Google {connectedAccounts?.google ? "" : "(Not linked)"}
            </span>
            <span
              className={cn(
                "px-2.5 py-1 rounded border",
                connectedAccounts?.github
                  ? "bg-muted border-border/60"
                  : "bg-muted border-border/60 text-muted-foreground"
              )}
            >
              GitHub {connectedAccounts?.github ? "" : "(Not linked)"}
            </span>
          </div>
        </div>

        {saveError && <p className="text-[10px] text-destructive">{saveError}</p>}

        <Button type="submit" disabled={isSaving} className="h-9 px-4 rounded-full bg-primary text-white font-bold">
          {isSaving ? "Saving..." : "Save changes"}
        </Button>

      </form>
    </div>
  );
}
