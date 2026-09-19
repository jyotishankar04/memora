"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon as CalendarIcon,
  Delete02Icon as Trash2,
  CloudDownloadIcon as Download,
  ExternalLinkIcon as ExternalLink,
} from "@hugeicons/core-free-icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useUpdateMemoryMutation } from "@/context/MemoryContext";
import { buildIcsContent, downloadTextFile, googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar";
import { getCalendarConnectUrl, type CalendarProviderKey } from "@/lib/calendar-api";
import { useCalendarConnectionsQuery, usePushToCalendarMutation } from "@/hooks/use-calendar";
import type { Memory } from "@/types/memory";

interface AddToCalendarDialogProps {
  memory: Pick<Memory, "id" | "title" | "description" | "url" | "eventAt">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Local datetime-local input value ("YYYY-MM-DDTHH:mm") from an ISO string, in the viewer's own timezone. */
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export function AddToCalendarDialog({ memory, open, onOpenChange }: AddToCalendarDialogProps) {
  const updateMutation = useUpdateMemoryMutation();
  const { data: connections } = useCalendarConnectionsQuery();
  const pushMutation = usePushToCalendarMutation();
  const [draft, setDraft] = React.useState(() => (memory.eventAt ? toLocalInputValue(memory.eventAt) : ""));

  const [wasOpen, setWasOpen] = React.useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDraft(memory.eventAt ? toLocalInputValue(memory.eventAt) : "");
  }

  async function saveDate(event: React.FormEvent) {
    event.preventDefault();
    if (!draft || updateMutation.isPending) return;
    try {
      await updateMutation.mutateAsync({ id: memory.id, patch: { eventAt: new Date(draft).toISOString() } });
      toast.add({ title: "Event date saved", type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Couldn't save the event date.", type: "error" });
    }
  }

  async function removeEvent() {
    try {
      await updateMutation.mutateAsync({ id: memory.id, patch: { eventAt: null } });
      toast.add({ title: "Event removed", type: "success" });
      onOpenChange(false);
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Couldn't remove the event.", type: "error" });
    }
  }

  const eventInput = memory.eventAt
    ? { title: memory.title, description: memory.description, url: memory.url, start: memory.eventAt }
    : null;

  function isConnected(provider: CalendarProviderKey): boolean {
    return connections?.some((c) => c.provider === provider) ?? false;
  }

  async function pushToCalendar(provider: CalendarProviderKey) {
    try {
      await pushMutation.mutateAsync({ memoryId: memory.id, provider });
      toast.add({ title: `Added to ${provider === "google" ? "Google" : "Outlook"} Calendar`, type: "success" });
    } catch (err) {
      toast.add({ title: err instanceof Error ? err.message : "Couldn't create the calendar event.", type: "error" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm gap-5 p-6">
        <DialogHeader className="border-b border-border/20 pb-3">
          <DialogTitle className="text-xs font-bold">Add to calendar</DialogTitle>
          <DialogDescription className="truncate text-[11px]">{memory.title}</DialogDescription>
        </DialogHeader>

        {!eventInput ? (
          <form onSubmit={saveDate} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Date &amp; time</label>
              <Input type="datetime-local" value={draft} onChange={(e) => setDraft(e.target.value)} required className="h-9" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
                Cancel
              </Button>
              <Button type="submit" disabled={!draft || updateMutation.isPending} className="rounded-full">
                {updateMutation.isPending ? "Saving…" : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <p className="text-muted-foreground">
              {new Date(memory.eventAt!).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            </p>

            <div className="space-y-2">
              {(["google", "microsoft"] as const).map((provider) =>
                isConnected(provider) ? (
                  <Button
                    key={provider}
                    variant="outline"
                    disabled={pushMutation.isPending}
                    className="h-9 w-full justify-start rounded-xl text-xs font-semibold"
                    onClick={() => pushToCalendar(provider)}
                  >
                    <HugeiconsIcon icon={CalendarIcon} strokeWidth={2.25} className="h-4 w-4" />
                    Create in my {provider === "google" ? "Google" : "Outlook"} Calendar
                  </Button>
                ) : (
                  <Button
                    key={provider}
                    variant="outline"
                    nativeButton={false}
                    className="h-9 w-full justify-start rounded-xl text-xs font-semibold text-muted-foreground"
                    render={<a href={getCalendarConnectUrl(provider)} />}
                  >
                    <HugeiconsIcon icon={ExternalLink} strokeWidth={2.25} className="h-4 w-4" />
                    Connect {provider === "google" ? "Google" : "Outlook"} Calendar to sync directly
                  </Button>
                ),
              )}
              <div className="h-px bg-border/60" />
              <Button
                variant="outline"
                nativeButton={false}
                className="h-9 w-full justify-start rounded-xl text-xs font-semibold"
                render={<a href={googleCalendarUrl(eventInput)} target="_blank" rel="noreferrer" />}
              >
                <HugeiconsIcon icon={CalendarIcon} strokeWidth={2.25} className="h-4 w-4" /> Add to Google Calendar (quick link)
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                className="h-9 w-full justify-start rounded-xl text-xs font-semibold"
                render={<a href={outlookCalendarUrl(eventInput)} target="_blank" rel="noreferrer" />}
              >
                <HugeiconsIcon icon={CalendarIcon} strokeWidth={2.25} className="h-4 w-4" /> Add to Outlook (quick link)
              </Button>
              <Button
                variant="outline"
                className="h-9 w-full justify-start rounded-xl text-xs font-semibold"
                onClick={() => downloadTextFile(`${memory.title.slice(0, 60) || "event"}.ics`, buildIcsContent(eventInput))}
              >
                <HugeiconsIcon icon={Download} strokeWidth={2.25} className="h-4 w-4" /> Download .ics (Apple, others)
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={updateMutation.isPending}
                onClick={removeEvent}
                className="rounded-full text-destructive hover:text-destructive"
              >
                <HugeiconsIcon icon={Trash2} strokeWidth={2.25} className="h-3.5 w-3.5" /> Remove event
              </Button>
              <Button type="button" onClick={() => onOpenChange(false)} className="rounded-full">
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
