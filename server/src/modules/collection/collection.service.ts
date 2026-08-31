import { and, count, eq } from "drizzle-orm";
import { db } from "../../db";
import { collectionMemories, collections } from "../../db/schema";
import { AppError } from "../../shared/errors/app-error";
import type { CreateCollectionInput, UpdateCollectionInput } from "./collection.schema";

export interface CollectionResponse {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  memoryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function listCollections(userId: string): Promise<CollectionResponse[]> {
  return db
    .select({
      id: collections.id,
      name: collections.name,
      icon: collections.icon,
      description: collections.description,
      createdAt: collections.createdAt,
      updatedAt: collections.updatedAt,
      memoryCount: count(collectionMemories.memoryId),
    })
    .from(collections)
    .leftJoin(collectionMemories, eq(collectionMemories.collectionId, collections.id))
    .where(eq(collections.userId, userId))
    .groupBy(collections.id);
}

export async function createCollection(
  userId: string,
  input: CreateCollectionInput,
): Promise<CollectionResponse> {
  const [row] = await db
    .insert(collections)
    .values({ userId, name: input.name, icon: input.icon, description: input.description })
    .returning();

  return { ...row, memoryCount: 0 };
}

export async function updateCollection(
  userId: string,
  id: string,
  input: UpdateCollectionInput,
): Promise<CollectionResponse> {
  const columns: Record<string, unknown> = { updatedAt: new Date() };
  if (input.name !== undefined) columns.name = input.name;
  if (input.icon !== undefined) columns.icon = input.icon;
  if (input.description !== undefined) columns.description = input.description;

  const [row] = await db
    .update(collections)
    .set(columns)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .returning();

  if (!row) {
    throw new AppError("Collection not found", 404, "NOT_FOUND");
  }

  const [{ value: memoryCount }] = await db
    .select({ value: count() })
    .from(collectionMemories)
    .where(eq(collectionMemories.collectionId, id));

  return { ...row, memoryCount };
}

export async function deleteCollection(userId: string, id: string): Promise<void> {
  const [deleted] = await db
    .delete(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .returning({ id: collections.id });

  if (!deleted) {
    throw new AppError("Collection not found", 404, "NOT_FOUND");
  }
}
