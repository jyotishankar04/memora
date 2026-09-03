"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { getSignupsOverTime } from "@/lib/admin-analytics";
import { getUsageSummary } from "@/lib/ai-usage";
import { listUsers } from "@/lib/admin-users";

function StatTile({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link href={href} className="rounded-xl border border-border p-4 hover:border-primary/40 hover:bg-muted/20 transition-colors">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-foreground mt-1 tabular-nums">{value}</p>
    </Link>
  );
}

export default function AdminOverviewPage() {
  const { user } = useUser();

  const { data: users } = useQuery({
    queryKey: ["admin", "users", { page: 1, limit: 1 }],
    queryFn: () => listUsers({ page: 1, limit: 1 }),
  });

  const { data: signups } = useQuery({
    queryKey: ["admin", "analytics", "signups", 7],
    queryFn: () => getSignupsOverTime(7),
  });

  const { data: usage } = useQuery({
    queryKey: ["admin", "ai-usage", "summary", 7],
    queryFn: () => getUsageSummary(7),
  });

  const signupsThisWeek = signups?.reduce((sum, row) => sum + row.count, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">Welcome, {user.name ?? user.email}.</h2>
        <p className="text-xs text-muted-foreground">A quick look at the platform right now.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Total users" value={users ? users.total.toLocaleString() : "—"} href="/admin/users" />
        <StatTile label="Signups (7d)" value={signupsThisWeek.toLocaleString()} href="/admin/analytics" />
        <StatTile label="AI calls (7d)" value={usage ? usage.totals.calls.toLocaleString() : "—"} href="/admin/ai-usage" />
        <StatTile label="Tokens (7d)" value={usage ? usage.totals.totalTokens.toLocaleString() : "—"} href="/admin/ai-usage" />
      </div>
    </div>
  );
}
