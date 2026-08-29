import { apiFetch, apiFetchRaw } from "@/lib/auth";
import type { Memory, MemoryDetail, MemoryType } from "@/types/memory";

export interface ListMemoriesParams {
  type?: MemoryType;
  isFavorite?: boolean;
  isArchived?: boolean;
  inTrash?: boolean;
  collectionId?: string;
  tag?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface ListMemoriesResult {
  items: Memory[];
  page: number;
  limit: number;
  total: number;
}

export interface CreateMemoryInput {
  type: MemoryType;
  url?: string;
  title?: string;
  content?: string;
  description?: string;
  faviconUrl?: string;
  previewImageUrl?: string;
  keywords?: string[];
  collectionIds?: string[];
  tags?: string[];
}

export type UpdateMemoryInput = Partial<
  Pick<CreateMemoryInput, "title" | "content" | "collectionIds" | "tags"> & {
    description: string;
    isFavorite: boolean;
    isArchived: boolean;
    inTrash: boolean;
  }
>;

function toQueryString(params: ListMemoriesParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function listMemories(params: ListMemoriesParams = {}): Promise<ListMemoriesResult> {
  const { data, meta } = await apiFetchRaw<Memory[]>(`/memories${toQueryString(params)}`);
  return {
    items: data,
    page: (meta.page as number) ?? 1,
    limit: (meta.limit as number) ?? data.length,
    total: (meta.total as number) ?? data.length,
  };
}

export async function getMemory(id: string): Promise<MemoryDetail> {
  return apiFetch<MemoryDetail>(`/memories/${id}`);
}

export async function createMemory(input: CreateMemoryInput): Promise<MemoryDetail> {
  return apiFetch<MemoryDetail>("/memories", { method: "POST", body: JSON.stringify(input) });
}

export async function updateMemory(id: string, patch: UpdateMemoryInput): Promise<MemoryDetail> {
  return apiFetch<MemoryDetail>(`/memories/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function deleteMemory(id: string): Promise<void> {
  await apiFetch<void>(`/memories/${id}`, { method: "DELETE" });
}
