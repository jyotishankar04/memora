"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getActiveAnnouncement } from "@/lib/announcements";
import { AnnouncementFullPage } from "@/components/announcements/announcement-full-page";

/**
 * Mounted once at the root layout. When the active announcement is set to
 * "full_page", it blocks every route the same way maintenance mode does —
 * except /admin, so an admin can always get in to turn it back off.
 */
export function AnnouncementGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // /admin so an admin can manage it, and /auth/login so one whose session
  // has expired can still get back in — same escape hatch as maintenance mode.
  const isBypassed = pathname?.startsWith("/admin") || pathname === "/auth/login";

  const { data } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: getActiveAnnouncement,
    staleTime: 60 * 1000,
    refetchInterval: 15 * 1000,
    retry: 1,
    enabled: !isBypassed,
  });

  if (!isBypassed && data?.displayMode === "full_page") {
    return <AnnouncementFullPage announcement={data} />;
  }

  return <>{children}</>;
}
