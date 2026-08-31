import { apiFetch } from "@/lib/auth";
import type { Tag } from "@/types/memory";

export async function listTags(): Promise<Tag[]> {
  return apiFetch<Tag[]>("/tags");
}
