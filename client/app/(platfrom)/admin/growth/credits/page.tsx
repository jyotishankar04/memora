"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { StatTile } from "@/components/admin/stat-tile";
import { adjustUserCredits, getUserCreditDetail } from "@/lib/admin-credits";

export default function AdminCreditsPage() {
  const queryClient = useQueryClient();
  const [userIdInput, setUserIdInput] = useState("");
  const [lookedUpUserId, setLookedUpUserId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "credits", lookedUpUserId],
    queryFn: () => getUserCreditDetail(lookedUpUserId as string),
    enabled: Boolean(lookedUpUserId),
  });

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (userIdInput.trim()) setLookedUpUserId(userIdInput.trim());
  };

  const handleAdjust = async () => {
    if (!lookedUpUserId || !adjustAmount) return;
    setAdjusting(true);
    try {
      await adjustUserCredits(lookedUpUserId, Number(adjustAmount), adjustNote.trim() || undefined);
      queryClient.invalidateQueries({ queryKey: ["admin", "credits", lookedUpUserId] });
      setAdjustAmount("");
      setAdjustNote("");
      toast.add({ title: "Balance adjusted.", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Failed to adjust balance.", type: "error" });
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Credits</h1>
        <p className="text-xs text-muted-foreground mt-1">
          The shared reward currency — referral payouts land here automatically. Look up a user by ID (from their{" "}
          <code className="font-mono">/admin/users/:id</code> page) to view or manually adjust their balance.
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex gap-2">
        <Input placeholder="User ID" value={userIdInput} onChange={(e) => setUserIdInput(e.target.value)} className="w-80 font-mono" />
        <button type="submit" className="h-9 rounded-full border border-border text-xs font-bold px-4 hover:bg-muted transition-colors">
          Look up
        </button>
      </form>

      {lookedUpUserId && isLoading && <p className="text-xs text-muted-foreground">Loading...</p>}
      {lookedUpUserId && isError && <p className="text-xs text-destructive">Couldn&apos;t find that user.</p>}

      {data && (
        <>
          <StatTile label="Current balance" value={`${data.balance.toLocaleString()} credits`} />

          <div className="flex items-end gap-2 p-4 border border-dashed border-border rounded-xl">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-muted-foreground block">Adjust by</label>
              <Input placeholder="e.g. 50 or -20" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} className="w-32 font-mono" />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-muted-foreground block">Note</label>
              <Input placeholder="Reason for this adjustment" value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} />
            </div>
            <button
              type="button"
              onClick={handleAdjust}
              disabled={adjusting || !adjustAmount}
              className="h-9 rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-4 hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              Apply
            </button>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">Ledger</h3>
            </div>
            <table className="w-full text-xs">
              <tbody>
                {data.ledger.items.length === 0 && (
                  <tr><td className="px-4 py-4 text-center text-muted-foreground">No credit history yet.</td></tr>
                )}
                {data.ledger.items.map((entry) => (
                  <tr key={entry.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2.5">
                      <Badge variant={entry.amount >= 0 ? "secondary" : "destructive"}>
                        {entry.amount >= 0 ? "+" : ""}{entry.amount}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono">{entry.reason}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{entry.note ?? "—"}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground font-mono">{new Date(entry.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
