import { apiFetch } from "@/lib/auth";
import type { Collection } from "@/types/memory";

export interface CreateCollectionInput {
  name: string;
  icon?: string;
  description?: string;
}

export type UpdateCollectionInput = Partial<CreateCollectionInput>;

export async function listCollections(): Promise<Collection[]> {
  return apiFetch<Collection[]>("/collections");
}

export async function createCollection(input: CreateCollectionInput): Promise<Collection> {
  return apiFetch<Collection>("/collections", { method: "POST", body: JSON.stringify(input) });
}

export async function updateCollection(id: string, patch: UpdateCollectionInput): Promise<Collection> {
  return apiFetch<Collection>(`/collections/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function deleteCollection(id: string): Promise<void> {
  await apiFetch<void>(`/collections/${id}`, { method: "DELETE" });
}
