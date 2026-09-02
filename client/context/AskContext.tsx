"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createThread, getThreadMessages, listThreads } from "@/lib/ask";

export const threadsQueryKey = () => ["ai-threads"] as const;
export const threadMessagesQueryKey = (threadId: string) => ["ai-thread-messages", threadId] as const;

export function useThreadsQuery() {
  return useQuery({
    queryKey: threadsQueryKey(),
    queryFn: listThreads,
    // The global QueryClient's default staleTime is 30s (app/providers.tsx)
    // — without this override, navigating back to /app/ask within that
    // window shows a stale cached list instead of refetching, which reads
    // as "history sometimes not showing" right after creating a thread
    // elsewhere or in another tab.
    refetchOnMount: "always",
  });
}

export function useThreadMessagesQuery(threadId: string | null) {
  return useQuery({
    queryKey: threadMessagesQueryKey(threadId ?? ""),
    queryFn: () => getThreadMessages(threadId as string),
    enabled: Boolean(threadId),
    refetchOnMount: "always",
  });
}

export function useCreateThreadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title?: string) => createThread(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: threadsQueryKey() });
    },
  });
}
