"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { PaginationFooter } from "@/components/admin/pagination-footer";
import { createReferralCode, getReferralCodeConversions, listReferralCodes, updateReferralCode } from "@/lib/admin-referrals";

export default function AdminReferralsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ code: "", ownerUserId: "", rewardCreditsAmount: "100" });
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "referrals", "codes", page],
    queryFn: () => listReferralCodes({ page, limit }),
  });

  const { data: funnel } = useQuery({
    queryKey: ["admin", "referrals", "codes", expandedId, "conversions"],
    queryFn: () => getReferralCodeConversions(expandedId as string),
    enabled: Boolean(expandedId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "referrals", "codes"] });

  const toggleActive = async (id: string, isActive: boolean) => {
    setPendingId(id);
    try {
      await updateReferralCode(id, { isActive: !isActive });
      invalidate();
      toast.add({ title: isActive ? "Deactivated." : "Activated.", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Failed to update code.", type: "error" });
    } finally {
      setPendingId(null);
    }
  };

  const handleCreate = async () => {
    if (!form.code.trim() || !form.rewardCreditsAmount) return;
    setCreating(true);
    try {
      await createReferralCode({
        code: form.code.trim().toUpperCase(),
        ownerUserId: form.ownerUserId.trim() || undefined,
        rewardCreditsAmount: Number(form.rewardCreditsAmount),
      });
      invalidate();
      setForm({ code: "", ownerUserId: "", rewardCreditsAmount: "100" });
      toast.add({ title: "Referral code created.", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Failed to create code.", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Referral Program</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Admin-issued creator/affiliate codes. Every signed-in user also gets their own self-serve code automatically
          (<code className="font-mono">GET /referrals/me</code>) — those aren&apos;t created here.
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Code</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Type</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Reward</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Clicks</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Loading...</td></tr>}
            {isError && <tr><td colSpan={6} className="px-4 py-6 text-center text-destructive">Failed to load referral codes.</td></tr>}
            {data && data.items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No referral codes yet.</td></tr>
            )}
            {data?.items.map((code) => (
              <React.Fragment key={code.id}>
                <tr
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === code.id ? null : code.id)}
                >
                  <td className="px-4 py-2.5 font-mono font-semibold text-foreground">{code.code}</td>
                  <td className="px-4 py-2.5"><Badge variant="secondary">{code.type === "admin_issued" ? "Creator" : "User"}</Badge></td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono">{code.rewardCreditsAmount} credits</td>
                  <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{code.clickCount}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={code.isActive ? "secondary" : "outline"}>{code.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      disabled={pendingId === code.id}
                      onClick={(e) => { e.stopPropagation(); toggleActive(code.id, code.isActive); }}
                      className="h-6 rounded-full border border-border text-[10px] font-bold px-2.5 hover:bg-muted transition-colors disabled:opacity-40"
                    >
                      {code.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
                {expandedId === code.id && (
                  <tr className="bg-muted/20">
                    <td colSpan={6} className="px-4 py-3">
                      {funnel ? (
                        <div className="flex items-center gap-6 text-[11px]">
                          <span className="text-muted-foreground">
                            Signed up: <span className="font-bold text-foreground">{funnel.appliedCount}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Converted (purchased): <span className="font-bold text-foreground">{funnel.convertedCount}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Conversion rate:{" "}
                            <span className="font-bold text-foreground">
                              {funnel.appliedCount > 0 ? Math.round((funnel.convertedCount / funnel.appliedCount) * 100) : 0}%
                            </span>
                          </span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-muted-foreground">Loading funnel...</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {data && <PaginationFooter page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} itemLabel="code" />}

      <div className="p-4 border border-dashed border-border rounded-xl space-y-2.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">New creator/affiliate code</span>
        <div className="flex flex-wrap gap-2 items-center">
          <Input placeholder="CODE" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="w-32 uppercase" />
          <Input placeholder="Owner user ID (optional)" value={form.ownerUserId} onChange={(e) => setForm((f) => ({ ...f, ownerUserId: e.target.value }))} className="w-56" />
          <Input placeholder="Reward credits" value={form.rewardCreditsAmount} onChange={(e) => setForm((f) => ({ ...f, rewardCreditsAmount: e.target.value }))} className="w-32" />
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || !form.code.trim() || !form.rewardCreditsAmount}
            className="h-9 rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-4 hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
