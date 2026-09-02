"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon as ArrowLeft } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUser, updateUserRoles, updateUserStatus, type AdminUser } from "@/lib/admin-users";
import { getUsageForUser } from "@/lib/ai-usage";
import { toast } from "@/components/ui/toast";

const ASSIGNABLE_ROLES = ["free_user", "pro_user", "admin"];
const STATUS_OPTIONS: AdminUser["status"][] = ["active", "inactive", "suspended", "banned"];

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<string | null>(null);

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => getUser(id),
  });

  const { data: usage } = useQuery({
    queryKey: ["admin", "ai-usage", "users", id],
    queryFn: () => getUsageForUser(id, 30),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "users", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const toggleRole = async (role: string) => {
    if (!user) return;
    const hasRole = user.roles.includes(role);
    setPending(role);
    try {
      await updateUserRoles(id, role, hasRole ? "revoke" : "grant");
      invalidate();
      toast.add({ title: `${role} ${hasRole ? "revoked" : "granted"}.`, type: "success" });
    } catch {
      toast.add({ title: "Failed to update role.", type: "error" });
    } finally {
      setPending(null);
    }
  };

  const changeStatus = async (status: string) => {
    setPending("status");
    try {
      await updateUserStatus(id, status as AdminUser["status"]);
      invalidate();
      toast.add({ title: `Status updated to ${status}.`, type: "success" });
    } catch {
      toast.add({ title: "Failed to update status.", type: "error" });
    } finally {
      setPending(null);
    }
  };

  if (isLoading) {
    return <p className="text-xs text-muted-foreground">Loading...</p>;
  }
  if (isError || !user) {
    return <p className="text-xs text-destructive">User not found.</p>;
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <HugeiconsIcon icon={ArrowLeft} strokeWidth={2.25} className="h-3.5 w-3.5" />
        Back to users
      </Link>

      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground">{user.name ?? user.email}</h2>
        <p className="text-xs text-muted-foreground">{user.email}</p>
        <p className="text-[10px] text-muted-foreground font-mono">
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-4 text-xs">
        <div className="rounded-lg border border-border px-3 py-2">
          <span className="block text-[10px] text-muted-foreground uppercase tracking-wide">Memories</span>
          <span className="font-bold text-foreground">{user.stats.memoryCount}</span>
        </div>
        <div className="rounded-lg border border-border px-3 py-2">
          <span className="block text-[10px] text-muted-foreground uppercase tracking-wide">Collections</span>
          <span className="font-bold text-foreground">{user.stats.collectionCount}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Roles</h3>
        <div className="flex flex-wrap gap-2">
          {ASSIGNABLE_ROLES.map((role) => {
            const active = user.roles.includes(role);
            return (
              <button
                key={role}
                type="button"
                disabled={pending === role}
                onClick={() => toggleRole(role)}
                className="disabled:opacity-50"
              >
                <Badge variant={active ? "default" : "outline"} className="cursor-pointer h-6 px-3">
                  {role} {active ? "· revoke" : "· grant"}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Status</h3>
        <Select value={user.status} onValueChange={(v) => v && changeStatus(v)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">AI usage (last 30 days)</h3>
        {usage ? (
          <div className="flex gap-4 text-xs">
            <div className="rounded-lg border border-border px-3 py-2">
              <span className="block text-[10px] text-muted-foreground uppercase tracking-wide">Calls</span>
              <span className="font-bold text-foreground tabular-nums">{usage.totals.calls.toLocaleString()}</span>
            </div>
            <div className="rounded-lg border border-border px-3 py-2">
              <span className="block text-[10px] text-muted-foreground uppercase tracking-wide">Tokens</span>
              <span className="font-bold text-foreground tabular-nums">{usage.totals.totalTokens.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No AI usage recorded.</p>
        )}
      </div>
    </div>
  );
}
