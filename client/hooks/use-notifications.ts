import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotification,
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (status: "unread" | "all") => ["notifications", "list", status] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

export const useNotificationsQuery = (status: "unread" | "all" = "all") =>
  useQuery({ queryKey: notificationKeys.list(status), queryFn: () => listNotifications(status) });

/**
 * Drives the bell badge, so it's mounted on every authenticated page.
 * Polled rather than pushed — there's no websocket in this app, and a
 * minute of latency on "someone asked for access" is acceptable. Cheap
 * enough that it isn't worth building a socket for.
 */
export const useUnreadCountQuery = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadCount,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

function useNotificationMutation<T>(fn: (arg: T) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    // Both the list and the badge change on every one of these.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}

export const useMarkReadMutation = () => useNotificationMutation(markNotificationRead);
export const useMarkAllReadMutation = () => useNotificationMutation(() => markAllNotificationsRead());
export const useDeleteNotificationMutation = () => useNotificationMutation(deleteNotification);

/**
 * Feeds AppShell's live "want to add this to your calendar?" popup. Same
 * polling cadence and rationale as useUnreadCountQuery above — there's no
 * websocket, so a detected event surfaces here within one 60s tick of
 * ingestion finishing while the user happens to be on the site at all.
 */
export const useRecentEventNotificationsQuery = () =>
  useQuery({
    queryKey: notificationKeys.list("unread"),
    queryFn: () => listNotifications("unread"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
