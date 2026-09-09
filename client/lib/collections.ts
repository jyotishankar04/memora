import { apiFetch } from "@/lib/auth";
import type { Collection } from "@/types/memory";

export interface CreateCollectionInput {
  name: string;
  icon?: string;
  description?: string;
}

export type UpdateCollectionInput = Partial<CreateCollectionInput>;

export async function listCollections(includeSystem = false): Promise<Collection[]> {
  return apiFetch<Collection[]>(`/collections${includeSystem ? "?includeSystem=true" : ""}`);
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
