import { apiFetch } from "@/lib/auth";
import type { Collection, MemoryType } from "@/types/memory";

export interface CreateCollectionInput {
  name: string;
  icon?: string;
  description?: string;
}

export type UpdateCollectionInput = Partial<CreateCollectionInput> & { isVaulted?: boolean };

export async function listCollections(includeSystem = false, vaulted = false): Promise<Collection[]> {
  const params = new URLSearchParams();
  if (includeSystem) params.set("includeSystem", "true");
  if (vaulted) params.set("isVaulted", "true");
  const qs = params.toString();
  return apiFetch<Collection[]>(`/collections${qs ? `?${qs}` : ""}`);
}

/** One-way: turns a system collection into a user-owned one. Never the reverse. */
export async function convertCollectionToUser(id: string): Promise<Collection> {
  return apiFetch<Collection>(`/collections/${id}/convert-to-user`, { method: "PATCH" });
}

export async function createCollection(input: CreateCollectionInput): Promise<Collection> {
  return apiFetch<Collection>("/collections", { method: "POST", body: input });
}

export async function updateCollection(id: string, patch: UpdateCollectionInput): Promise<Collection> {
  return apiFetch<Collection>(`/collections/${id}`, { method: "PATCH", body: patch });
}

export async function deleteCollection(id: string): Promise<void> {
  await apiFetch<void>(`/collections/${id}`, { method: "DELETE" });
}

export async function shareCollection(id: string): Promise<Collection> {
  return apiFetch<Collection>(`/collections/${id}/share`, { method: "PATCH" });
}

export async function unshareCollection(id: string): Promise<Collection> {
  return apiFetch<Collection>(`/collections/${id}/unshare`, { method: "PATCH" });
}

export interface PublicMemoryItem {
  id: string;
  type: MemoryType;
  title: string;
  url: string | null;
  description: string | null;
  content: string | null;
  faviconUrl: string | null;
  previewImageUrl: string | null;
  createdAt: string;
}

export interface PublicCollection {
  name: string;
  icon: string;
  description: string | null;
  memories: PublicMemoryItem[];
}

/** Unauthenticated — safe to call from a public, cookie-less page. */
export async function getPublicCollection(slug: string): Promise<PublicCollection> {
  return apiFetch<PublicCollection>(`/collections/public/${slug}`);
}
