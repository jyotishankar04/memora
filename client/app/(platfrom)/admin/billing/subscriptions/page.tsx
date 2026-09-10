"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { PaginationFooter } from "@/components/admin/pagination-footer";
import { cancelAssignment, listAssignments, type AssignmentListItem } from "@/lib/admin-billing";

const STATUS_VARIANT: Record<AssignmentListItem["status"], "secondary" | "destructive" | "outline"> = {
  active: "secondary",
  expired: "outline",
  cancelled: "destructive",
  superseded: "outline",
};

export default function AdminSubscriptionsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const limit = 20;

  const params = { status: status === "all" ? undefined : (status as AssignmentListItem["status"]), page, limit };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "billing", "assignments", params],
    queryFn: () => listAssignments(params),
  });

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelAssignment(id);
      queryClient.invalidateQueries({ queryKey: ["admin", "billing", "assignments"] });
      toast.add({ title: "Subscription cancelled.", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Failed to cancel.", type: "error" });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-foreground">Subscriptions</h1>
      <p className="text-xs text-muted-foreground">
        Every plan assignment across every user — manual grants today, the same place a future Stripe subscription would land.
      </p>

      <Select value={status} onValueChange={(v) => { if (v) { setStatus(v); setPage(1); } }}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="superseded">Superseded</SelectItem>
        </SelectContent>
      </Select>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">User</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Plan</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Status</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Source</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Ends</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Loading...</td></tr>
            )}
            {isError && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-destructive">Failed to load subscriptions.</td></tr>
            )}
            {data && data.items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No subscriptions found.</td></tr>
            )}
            {data?.items.map((item) => (
              <tr key={item.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5">
                  {item.userId ? (
                    <Link href={`/admin/users/${item.userId}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {item.userName ?? item.userEmail ?? item.userId}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Deleted user</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-foreground">{item.planName ?? item.planKey ?? "—"}</td>
                <td className="px-4 py-2.5"><Badge variant={STATUS_VARIANT[item.status]}>{item.status}</Badge></td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono">{item.source}</td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono">
                  {item.endsAt ? new Date(item.endsAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {item.status === "active" && (
                    <button
                      type="button"
                      disabled={cancellingId === item.id}
                      onClick={() => handleCancel(item.id)}
                      className="h-6 rounded-full border border-destructive/30 text-destructive text-[10px] font-bold px-2.5 hover:bg-destructive/10 transition-colors disabled:opacity-40"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && <PaginationFooter page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} itemLabel="subscription" />}
    </div>
  );
}
