"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon as Search, ArrowRight01Icon as ArrowRight, ArrowLeft01Icon as ArrowLeft } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listUsers, type AdminUser } from "@/lib/admin-users";

const STATUS_VARIANT: Record<AdminUser["status"], "secondary" | "destructive" | "outline"> = {
  active: "secondary",
  inactive: "outline",
  suspended: "destructive",
  banned: "destructive",
  deleted: "outline",
};

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [role, setRole] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const params = {
    q: q || undefined,
    status: status === "all" ? undefined : (status as AdminUser["status"]),
    role: role === "all" ? undefined : role,
    page,
    limit,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => listUsers(params),
  });

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        header: "User",
        accessorKey: "email",
        cell: ({ row }) => (
          <Link href={`/admin/users/${row.original.id}`} className="flex flex-col hover:text-primary transition-colors">
            <span className="text-xs font-semibold text-foreground">{row.original.name ?? row.original.email}</span>
            <span className="text-[10px] text-muted-foreground">{row.original.email}</span>
          </Link>
        ),
      },
      {
        header: "Roles",
        accessorKey: "roles",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.roles.map((r) => (
              <Badge key={r} variant={r === "admin" ? "default" : "secondary"}>
                {r}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>,
      },
      {
        header: "Joined",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <span className="text-[10px] text-muted-foreground font-mono">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-foreground">Users</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <HugeiconsIcon icon={Search} strokeWidth={2.25} className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search by email or name..."
            className="pl-7"
          />
        </div>

        <Select value={status} onValueChange={(v) => { if (v) { setStatus(v); setPage(1); } }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>

        <Select value={role} onValueChange={(v) => { if (v) { setRole(v); setPage(1); } }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="free_user">free_user</SelectItem>
            <SelectItem value="pro_user">pro_user</SelectItem>
            <SelectItem value="admin">admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted/40 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left font-semibold text-muted-foreground px-4 py-2.5">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-destructive">
                  Failed to load users.
                </td>
              </tr>
            )}
            {!isLoading && !isError && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>
            {data.total} user{data.total === 1 ? "" : "s"} · page {data.page} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="h-6 w-6 rounded-full border border-border flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft} strokeWidth={2.25} className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="h-6 w-6 rounded-full border border-border flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-colors"
            >
              <HugeiconsIcon icon={ArrowRight} strokeWidth={2.25} className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
