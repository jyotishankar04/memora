"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as RechartsPrimitive from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { StatTile } from "@/components/stat-tile";
import { getRevenue } from "@/lib/admin-billing";
import { listAdminPlans } from "@/lib/admin-plans";
import { formatPriceMinor } from "@/lib/plans";

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

const chartConfig = {
  totalMinor: { label: "Revenue", color: "var(--primary)" },
} satisfies ChartConfig;

export default function AdminRevenuePage() {
  const [days, setDays] = useState("30");
  const daysNum = Number(days);

  const { data: revenue, isLoading, isError } = useQuery({
    queryKey: ["admin", "billing", "revenue", daysNum],
    queryFn: () => getRevenue(daysNum),
  });

  const { data: plans } = useQuery({ queryKey: ["admin", "plans"], queryFn: listAdminPlans });
  const planName = (id: string | null) => plans?.find((p) => p.id === id)?.name ?? id ?? "Unknown";

  const totalMinor = revenue?.byDay.reduce((sum, r) => sum + r.totalMinor, 0) ?? 0;
  const totalCount = revenue?.byDay.reduce((sum, r) => sum + r.count, 0) ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-foreground">Revenue</h1>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Succeeded transactions only.</p>
        <Select value={days} onValueChange={(v) => v && setDays(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-xs text-muted-foreground">Loading...</p>}
      {isError && <p className="text-xs text-destructive">Failed to load revenue.</p>}

      {revenue && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Total revenue" value={formatPriceMinor(totalMinor, "usd")} />
            <StatTile label="Transactions" value={totalCount.toLocaleString()} />
          </div>

          <div className="rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-foreground mb-3">Revenue per day</h3>
            {revenue.byDay.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">No revenue recorded in this range yet.</p>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
                <RechartsPrimitive.BarChart data={revenue.byDay}>
                  <RechartsPrimitive.CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <RechartsPrimitive.XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(v: string) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  />
                  <RechartsPrimitive.YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <RechartsPrimitive.Bar dataKey="totalMinor" fill="var(--color-totalMinor)" radius={4} />
                </RechartsPrimitive.BarChart>
              </ChartContainer>
            )}
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">By plan</h3>
            </div>
            <table className="w-full text-xs">
              <tbody>
                {revenue.byPlan.length === 0 && (
                  <tr><td className="px-4 py-4 text-center text-muted-foreground">No data yet.</td></tr>
                )}
                {revenue.byPlan.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{planName(row.planId)}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground tabular-nums">{row.count.toLocaleString()} tx</td>
                    <td className="px-4 py-2 text-right font-mono text-muted-foreground tabular-nums">{formatPriceMinor(row.totalMinor, "usd")}</td>
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
