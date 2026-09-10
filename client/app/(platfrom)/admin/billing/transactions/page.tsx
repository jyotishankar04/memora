"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationFooter } from "@/components/admin/pagination-footer";
import { listTransactions, type Transaction } from "@/lib/admin-billing";
import { formatPriceMinor } from "@/lib/plans";

const STATUS_VARIANT: Record<Transaction["status"], "secondary" | "destructive" | "outline"> = {
  succeeded: "secondary",
  pending: "outline",
  failed: "destructive",
  refunded: "outline",
  cancelled: "destructive",
};

export default function AdminTransactionsPage() {
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const params = { status: status === "all" ? undefined : (status as Transaction["status"]), page, limit };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "billing", "transactions", params],
    queryFn: () => listTransactions(params),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-foreground">Transactions</h1>
      <p className="text-xs text-muted-foreground">
        Every billing event — manual admin grants today; a future Stripe integration writes into this same table.
      </p>

      <Select value={status} onValueChange={(v) => { if (v) { setStatus(v); setPage(1); } }}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="succeeded">Succeeded</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">User</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Type</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Status</th>
              <th className="text-right font-semibold text-muted-foreground px-4 py-2.5">Amount</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Provider</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Loading...</td></tr>
            )}
            {isError && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-destructive">Failed to load transactions.</td></tr>
            )}
            {data && data.items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No transactions yet.</td></tr>
            )}
            {data?.items.map((tx) => (
              <tr key={tx.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5">
                  {tx.userId ? (
                    <Link href={`/admin/users/${tx.userId}`} className="font-medium text-foreground hover:text-primary transition-colors font-mono text-[10px]">
                      {tx.userId.slice(0, 8)}…
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-foreground font-mono">{tx.type}</td>
                <td className="px-4 py-2.5"><Badge variant={STATUS_VARIANT[tx.status]}>{tx.status}</Badge></td>
                <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{formatPriceMinor(tx.amountMinor, tx.currency)}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{tx.provider ?? "manual"}</td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono">{new Date(tx.occurredAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && <PaginationFooter page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} itemLabel="transaction" />}
    </div>
  );
}
