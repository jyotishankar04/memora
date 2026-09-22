"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useMemoryQuery, useUpdateMemoryMutation } from "@/context/MemoryContext";
import { useMarkReadMutation } from "@/hooks/use-notifications";
import { eventDetectedRefs, type AppNotification } from "@/lib/notifications";
import { AddToCalendarDialog } from "./add-to-calendar-dialog";

interface EventDetectedPopupProps {
  notification: AppNotification;
  onClose: () => void;
}

/**
 * The confirm-then-commit wrapper for an AI-detected event, shared by the
 * notifications page's inline action and AppShell's live popup. This is
 * the ONLY place a DetectEvent guess (memories.suggestedEventAt) is ever
 * written into the real, user-owned memories.eventAt — via the normal
 * updateMemory path, and only after an explicit "Yes, add it" click.
 */
export function EventDetectedPopup({ notification, onClose }: EventDetectedPopupProps) {
  const refs = eventDetectedRefs(notification);
  const { data: memory } = useMemoryQuery(refs?.memoryId ?? "", { enabled: Boolean(refs) });
  const updateMutation = useUpdateMemoryMutation();
  const markRead = useMarkReadMutation();
  const [confirmed, setConfirmed] = React.useState(false);

  if (!refs) return null;

  function markSeen() {
    if (!notification.readAt) markRead.mutate(notification.id);
  }

  async function confirm() {
    try {
      await updateMutation.mutateAsync({ id: refs!.memoryId, patch: { eventAt: refs!.suggestedEventAt } });
      setConfirmed(true);
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Couldn't save the event date.", type: "error" });
    } finally {
      markSeen();
    }
  }

  function dismiss() {
    markSeen();
    onClose();
  }

  if (confirmed) {
    return (
      <AddToCalendarDialog
        memory={{
          id: refs.memoryId,
          title: memory?.title ?? "Event",
          description: memory?.description ?? null,
          url: memory?.url ?? null,
          eventAt: refs.suggestedEventAt,
        }}
        open
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      />
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && dismiss()}>
      <DialogContent className="sm:max-w-sm gap-5 p-6">
        <DialogHeader className="border-b border-border/20 pb-3">
          <DialogTitle className="text-xs font-bold">Is this an event?</DialogTitle>
          <DialogDescription className="text-[11px]">We spotted a date in something you just saved.</DialogDescription>
        </DialogHeader>

        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">{memory?.title ?? "This memory"}</span> looks like it&apos;s about
          something on{" "}
          <span className="font-semibold text-foreground">
            {new Date(refs.suggestedEventAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
          </span>
          . Add it to your calendar?
        </p>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={dismiss} className="rounded-full">
            Not an event
          </Button>
          <Button type="button" disabled={updateMutation.isPending} onClick={confirm} className="rounded-full">
            {updateMutation.isPending ? "Saving…" : "Yes, add it"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
