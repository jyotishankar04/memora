"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { PaginationFooter } from "@/components/admin/pagination-footer";
import {
  createCoupon,
  getCouponRedemptions,
  listCoupons,
  updateCoupon,
  type Coupon,
  type CreateCouponInput,
} from "@/lib/admin-coupons";

function discountLabel(coupon: Coupon): string {
  return coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${(coupon.discountValue / 100).toFixed(2)}`;
}

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<{ code: string; label: string; discountType: CreateCouponInput["discountType"]; discountValue: string; maxRedemptions: string }>({
    code: "",
    label: "",
    discountType: "percentage",
    discountValue: "",
    maxRedemptions: "",
  });
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "coupons", page],
    queryFn: () => listCoupons({ page, limit }),
  });

  const { data: funnel } = useQuery({
    queryKey: ["admin", "coupons", expandedId, "redemptions"],
    queryFn: () => getCouponRedemptions(expandedId as string),
    enabled: Boolean(expandedId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });

  const toggleActive = async (coupon: Coupon) => {
    setPendingId(coupon.id);
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive });
      invalidate();
      toast.add({ title: coupon.isActive ? "Deactivated." : "Activated.", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Failed to update coupon.", type: "error" });
    } finally {
      setPendingId(null);
    }
  };

  const handleCreate = async () => {
    if (!form.code.trim() || !form.discountValue) return;
    setCreating(true);
    try {
      await createCoupon({
        code: form.code.trim().toUpperCase(),
        label: form.label.trim() || undefined,
        discountType: form.discountType,
        discountValue: form.discountType === "fixed_amount" ? Math.round(Number(form.discountValue) * 100) : Number(form.discountValue),
        maxRedemptions: form.maxRedemptions ? Number(form.maxRedemptions) : undefined,
      });
      invalidate();
      setForm({ code: "", label: "", discountType: "percentage", discountValue: "", maxRedemptions: "" });
      toast.add({ title: "Coupon created.", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Failed to create coupon.", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Coupons</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Discount codes — including custom links for creators and affiliates. Expand a row to see applied vs. purchased.
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Code</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Label</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Discount</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Redemptions</th>
              <th className="text-left font-semibold text-muted-foreground px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Loading...</td></tr>}
            {isError && <tr><td colSpan={6} className="px-4 py-6 text-center text-destructive">Failed to load coupons.</td></tr>}
            {data && data.items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No coupons yet.</td></tr>
            )}
            {data?.items.map((coupon) => (
              <React.Fragment key={coupon.id}>
                <tr
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === coupon.id ? null : coupon.id)}
                >
                  <td className="px-4 py-2.5 font-mono font-semibold text-foreground">{coupon.code}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{coupon.label ?? "—"}</td>
                  <td className="px-4 py-2.5 text-foreground">{discountLabel(coupon)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono">
                    {coupon.redemptionCount}{coupon.maxRedemptions ? ` / ${coupon.maxRedemptions}` : ""}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={coupon.isActive ? "secondary" : "outline"}>{coupon.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      disabled={pendingId === coupon.id}
                      onClick={(e) => { e.stopPropagation(); toggleActive(coupon); }}
                      className="h-6 rounded-full border border-border text-[10px] font-bold px-2.5 hover:bg-muted transition-colors disabled:opacity-40"
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
                {expandedId === coupon.id && (
                  <tr className="bg-muted/20">
                    <td colSpan={6} className="px-4 py-3">
                      {funnel ? (
                        <div className="flex items-center gap-6 text-[11px]">
                          <span className="text-muted-foreground">
                            Applied: <span className="font-bold text-foreground">{funnel.appliedCount}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Converted: <span className="font-bold text-foreground">{funnel.convertedCount}</span>
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

      {data && <PaginationFooter page={data.page} limit={data.limit} total={data.total} onPageChange={setPage} itemLabel="coupon" />}

      <div className="p-4 border border-dashed border-border rounded-xl space-y-2.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">New coupon</span>
        <div className="flex flex-wrap gap-2 items-center">
          <Input placeholder="CODE" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="w-32 uppercase" />
          <Input placeholder="Label (e.g. creator name)" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} className="w-48" />
          <Select value={form.discountType} onValueChange={(v) => v && setForm((f) => ({ ...f, discountType: v as CreateCouponInput["discountType"] }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">% off</SelectItem>
              <SelectItem value="fixed_amount">₹ off</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={form.discountType === "percentage" ? "e.g. 20" : "e.g. 100.00"}
            value={form.discountValue}
            onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
            className="w-28"
          />
          <Input placeholder="Max redemptions" value={form.maxRedemptions} onChange={(e) => setForm((f) => ({ ...f, maxRedemptions: e.target.value }))} className="w-32" />
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || !form.code.trim() || !form.discountValue}
            className="h-9 rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-4 hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
