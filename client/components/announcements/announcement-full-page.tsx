import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CountdownTiles } from "@/components/ui/countdown-tiles";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/lib/announcements";

const KICKER: Record<Announcement["type"], string> = {
  countdown: "Launching soon",
  announcement: "Announcement",
  update: "Update",
};

export function AnnouncementFullPage({ announcement }: { announcement: Announcement }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 text-center text-white">
      <div className="pointer-events-none absolute -top-1/3 -left-1/4 h-[700px] w-[700px] rotate-12 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-8">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {KICKER[announcement.type]}
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{announcement.title}</h1>
          <p className="mx-auto max-w-lg text-sm text-white/60 sm:text-base">{announcement.message}</p>
        </div>

        {announcement.targetDate && <CountdownTiles targetDate={announcement.targetDate} size="lg" />}

        {announcement.ctaLabel && announcement.ctaUrl && (
          <Link
            href={announcement.ctaUrl}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 rounded-full bg-white px-8 text-sm font-semibold text-black hover:bg-white/90"
            )}
          >
            {announcement.ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
