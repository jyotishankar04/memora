"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon as Copy,
  Layers01Icon as Layers,
  FileTextIcon as FileText,
  UserLockIcon as UserLock,
  EyeIcon as Eye,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/query-error-state";
import { Reveal } from "@/components/ui/reveal";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/time";
import { copyToClipboard } from "@/lib/clipboard";
import {
  useApproveRequestMutation,
  useDenyRequestMutation,
  useMySharesQuery,
  usePendingRequestsQuery,
  useSharedWithMeQuery,
} from "@/hooks/use-shares";
import { LINK_MODE_META } from "@/lib/share-display";
import type { ShareAccessRequest, ShareListItem } from "@/lib/shares";

export default function SharedPage() {
  const mine = useMySharesQuery();
  const withMe = useSharedWithMeQuery();
  const requests = usePendingRequestsQuery();

  if (mine.isError) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <QueryErrorState title="Couldn't load your shares" onRetry={() => mine.refetch()} />
      </div>
    );
  }

  const loading = mine.isLoading || withMe.isLoading;
  const pending = requests.data ?? [];
  const shares = mine.data ?? [];
  const shared = withMe.data ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <div className="space-y-1">
        <h1 className="text-lg font-bold text-foreground">Shared</h1>
        <p className="text-xs text-muted-foreground">Everything you&apos;ve shared, and everything shared with you.</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <Section title="Pending requests" subtitle="People waiting on you">
              <ul className="space-y-2">
                {pending.map((request, index) => (
                  <Reveal key={request.id} index={Math.min(index, 6)}>
                    <RequestRow request={request} />
                  </Reveal>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Shared by you" subtitle={shares.length === 0 ? undefined : `${shares.length} in total`}>
            {shares.length === 0 ? (
              <Empty text="You haven't shared anything yet. Open a collection or memory and hit Share." />
            ) : (
              <ul className="space-y-2">
                {shares.map((share, index) => (
                  <Reveal key={share.id} index={Math.min(index, 8)}>
                    <MyShareRow share={share} />
                  </Reveal>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Shared with you">
            {shared.length === 0 ? (
              <Empty text="Nothing has been shared with you yet." />
            ) : (
              <ul className="space-y-2">
                {shared.map((item, index) => (
                  <Reveal key={item.shareId} index={Math.min(index, 8)}>
                    <li>
                      <Link
                        href={`/s/${item.slug}`}
                        className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-foreground/5"
                      >
                        <ResourceIcon type={item.resourceType} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-foreground">{item.resourceName}</span>
                          <span className="block text-[11px] text-muted-foreground">
                            from {item.ownerName ?? "someone"} · {timeAgo(item.sharedAt)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  </Reveal>
                ))}
              </ul>
            )}
          </Section>
        </>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xs font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function ResourceIcon({ type }: { type: "collection" | "memory" }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <HugeiconsIcon icon={type === "collection" ? Layers : FileText} strokeWidth={2.25} className="h-4 w-4" />
    </span>
  );
}

function MyShareRow({ share }: { share: ShareListItem }) {
  const mode = LINK_MODE_META[share.linkAccess];
  const url = typeof window !== "undefined" ? `${window.location.origin}/s/${share.slug}` : "";

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border p-3">
      <ResourceIcon type={share.resourceType} />

      {/* The resource name is the entry point into the dedicated analytics
          page — everything about who viewed it and when lives there now,
          rather than in an inline widget competing for space in this list. */}
      <Link href={`/app/shared/${share.id}`} className="min-w-0 flex-1 group/row">
        <p className="truncate text-xs font-semibold text-foreground group-hover/row:text-primary">
          {share.resourceName}
        </p>
        <p className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase", mode.tone)}>
            <HugeiconsIcon icon={mode.icon} strokeWidth={2.25} className="h-2.5 w-2.5" />
            {mode.label}
          </span>
          {share.grantCount > 0 && <span>{share.grantCount} with access</span>}
          <span className="flex items-center gap-0.5">
            <HugeiconsIcon icon={Eye} strokeWidth={2.25} className="h-2.5 w-2.5" />
            {share.viewCount}
          </span>
          {share.pendingRequestCount > 0 && (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {share.pendingRequestCount} pending
            </span>
          )}
        </p>
      </Link>

      {/* An invite-only link still works for the people invited, so the
          copy button stays useful in every mode. */}
      <Button
        size="icon"
        variant="outline"
        aria-label="Copy link"
        className="h-8 w-8 shrink-0"
        onClick={() => void copyToClipboard(url)}
      >
        <HugeiconsIcon icon={Copy} strokeWidth={2.25} className="h-3.5 w-3.5" />
      </Button>
    </li>
  );
}

function RequestRow({ request }: { request: ShareAccessRequest }) {
  const approve = useApproveRequestMutation();
  const deny = useDenyRequestMutation();
  const busy = approve.isPending || deny.isPending;

  async function decide(action: "approve" | "deny") {
    const mutation = action === "approve" ? approve : deny;
    try {
      await mutation.mutateAsync({ id: request.shareId, requestId: request.id });
      toast.add({ title: action === "approve" ? "Access granted" : "Request declined", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Couldn't update that request.", type: "error" });
    }
  }

  return (
    <li className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.04] p-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <HugeiconsIcon icon={UserLock} strokeWidth={2.25} className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-xs text-foreground">
          <span className="font-semibold">{request.requesterName ?? request.requesterEmail}</span> wants access to{" "}
          <span className="font-semibold">{request.resourceName}</span>
        </p>
        {request.message && <p className="text-[11px] italic text-muted-foreground">&ldquo;{request.message}&rdquo;</p>}
        <p className="font-mono text-[10px] text-muted-foreground/70">{timeAgo(request.createdAt)}</p>
      </div>

      <div className="flex shrink-0 gap-1.5">
        <Button size="sm" disabled={busy} onClick={() => decide("approve")} className="h-6 rounded-full px-2.5 text-[10px]">
          Approve
        </Button>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => decide("deny")} className="h-6 rounded-full px-2.5 text-[10px]">
          Decline
        </Button>
      </div>
    </li>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">{text}</p>;
}
