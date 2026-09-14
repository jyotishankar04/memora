"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BellIcon as Bell,
  UserLockIcon as UserLock,
  CheckmarkCircle02Icon as Approved,
  CancelCircleIcon as Declined,
  Share02Icon as Shared,
  Delete02Icon as Trash,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/query-error-state";
import { Reveal } from "@/components/ui/reveal";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/time";
import { accessRequestRefs, type AppNotification, type NotificationType } from "@/lib/notifications";
import {
  useDeleteNotificationMutation,
  useMarkAllReadMutation,
  useMarkReadMutation,
  useNotificationsQuery,
} from "@/hooks/use-notifications";
import { useApproveRequestMutation, useDenyRequestMutation, usePendingRequestsQuery } from "@/hooks/use-shares";

const ICONS: Record<NotificationType, typeof Bell> = {
  share_invite_received: Shared,
  share_access_requested: UserLock,
  share_access_approved: Approved,
  share_access_denied: Declined,
  share_revoked: Declined,
};

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError, refetch } = useNotificationsQuery("all");
  const markAllRead = useMarkAllReadMutation();

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <QueryErrorState title="Couldn't load your notifications" onRetry={() => refetch()} />
      </div>
    );
  }

  const unread = notifications?.filter((n) => !n.readAt).length ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-foreground">Notifications</h1>
          <p className="text-xs text-muted-foreground">
            {unread > 0 ? `${unread} unread` : "You're all caught up."}
          </p>
        </div>
        {unread > 0 && (
          <Button
            variant="outline"
            size="sm"
            disabled={markAllRead.isPending}
            onClick={() => markAllRead.mutate(undefined as never)}
            className="h-8 rounded-full px-3 text-[11px] font-semibold"
          >
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification, index) => (
            <Reveal key={notification.id} index={Math.min(index, 8)}>
              <NotificationRow notification={notification} />
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}

function NotificationRow({ notification }: { notification: AppNotification }) {
  const markRead = useMarkReadMutation();
  const remove = useDeleteNotificationMutation();
  const Icon = ICONS[notification.type] ?? Bell;
  const unread = !notification.readAt;

  const body = (
    <div className="min-w-0 flex-1 space-y-0.5">
      <p className={cn("text-xs leading-snug", unread ? "font-semibold text-foreground" : "text-muted-foreground")}>
        {notification.title}
      </p>
      {notification.body && <p className="text-[11px] text-muted-foreground">{notification.body}</p>}
      <p className="font-mono text-[10px] text-muted-foreground/70">{timeAgo(notification.createdAt)}</p>
    </div>
  );

  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3 transition-colors",
        unread ? "border-primary/30 bg-primary/[0.04]" : "border-border"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          unread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        <HugeiconsIcon icon={Icon} strokeWidth={2.25} className="h-3.5 w-3.5" />
      </span>

      {/* Only link when there's somewhere useful to go — a declined request
          has no destination. */}
      {notification.actionUrl ? (
        <Link
          href={notification.actionUrl}
          onClick={() => unread && markRead.mutate(notification.id)}
          className="min-w-0 flex-1"
        >
          {body}
        </Link>
      ) : (
        body
      )}

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {notification.type === "share_access_requested" && <InlineDecision notification={notification} />}
        <div className="flex items-center gap-1">
          {unread && (
            <button
              type="button"
              onClick={() => markRead.mutate(notification.id)}
              className="text-[10px] font-semibold text-muted-foreground hover:text-foreground"
            >
              Mark read
            </button>
          )}
          <button
            type="button"
            aria-label="Delete notification"
            onClick={() => remove.mutate(notification.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <HugeiconsIcon icon={Trash} strokeWidth={2.25} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </li>
  );
}

/**
 * Approve or decline straight from the notification.
 *
 * The alternative — sending the owner off to find the right collection's
 * share dialog — is how this feature stays unused. The ids come from the
 * notification's metadata, and the buttons disappear once the request is
 * no longer pending (approved elsewhere, withdrawn by the requester).
 */
function InlineDecision({ notification }: { notification: AppNotification }) {
  const refs = accessRequestRefs(notification);
  const { data: pending = [] } = usePendingRequestsQuery();
  const approve = useApproveRequestMutation();
  const deny = useDenyRequestMutation();
  const markRead = useMarkReadMutation();

  if (!refs) return null;

  const stillPending = pending.some((request) => request.id === refs.requestId);
  if (!stillPending) return <span className="text-[10px] text-muted-foreground">Handled</span>;

  const busy = approve.isPending || deny.isPending;

  async function decide(action: "approve" | "deny") {
    const mutation = action === "approve" ? approve : deny;
    try {
      await mutation.mutateAsync({ id: refs!.shareId, requestId: refs!.requestId });
      if (!notification.readAt) markRead.mutate(notification.id);
      toast.add({ title: action === "approve" ? "Access granted" : "Request declined", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Couldn't update that request.", type: "error" });
    }
  }

  return (
    <div className="flex gap-1.5">
      <Button size="sm" disabled={busy} onClick={() => decide("approve")} className="h-6 rounded-full px-2.5 text-[10px]">
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() => decide("deny")}
        className="h-6 rounded-full px-2.5 text-[10px]"
      >
        Decline
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-sm space-y-3 py-20 text-center">
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-card shadow-md">
          <HugeiconsIcon icon={Bell} strokeWidth={2.25} className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-foreground">Nothing here yet</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Access requests and shares sent your way will show up here.
      </p>
    </div>
  );
}
