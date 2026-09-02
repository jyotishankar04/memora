import { apiFetch } from "@/lib/auth";

export interface Thread {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type ThreadMessagePart =
  | { type: "text"; text: string }
  | {
      type: "dynamic-tool";
      toolName: string;
      toolCallId: string;
      state: "output-available";
      output: { kwargs: { content: string } };
    };

export interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  parts: ThreadMessagePart[];
}

export async function listThreads(): Promise<Thread[]> {
  return apiFetch<Thread[]>("/ai/threads");
}

export async function createThread(title?: string): Promise<Thread> {
  return apiFetch<Thread>("/ai/threads", { method: "POST", body: { title } });
}

export async function getThreadMessages(threadId: string): Promise<ThreadMessage[]> {
  return apiFetch<ThreadMessage[]>(`/ai/threads/${threadId}/messages`);
}

/** Base URL for the streaming ask endpoint — consumed directly by
 * DefaultChatTransport (see app/(platfrom)/app/ask/page.tsx), not apiFetch,
 * since that endpoint returns a stream, not a JSON envelope. */
export function askStreamUrl(threadId: string): string {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
  return `${API_URL}/ai/threads/${threadId}/ask`;
}
