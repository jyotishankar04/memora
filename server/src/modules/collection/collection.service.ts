import { and, count, eq } from "drizzle-orm";
import { db } from "../../db";
import { collectionMemories, collections } from "../../db/schema";
import { CollectionSource, PlanLimitType } from "../../db/enums";
import { AppError } from "../../shared/errors/app-error";
import { assertWithinLimit } from "../plans/plans.service";
import type { CreateCollectionInput, ListCollectionsQuery, UpdateCollectionInput } from "./collection.schema";

export interface CollectionResponse {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  source: CollectionSource;
  memoryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function listCollections(userId: string, query: ListCollectionsQuery): Promise<CollectionResponse[]> {
  const conditions = [eq(collections.userId, userId)];
  if (!query.includeSystem) {
    conditions.push(eq(collections.source, CollectionSource.USER));
  }

  return db
    .select({
      id: collections.id,
      name: collections.name,
      icon: collections.icon,
      description: collections.description,
      source: collections.source,
      createdAt: collections.createdAt,
      updatedAt: collections.updatedAt,
      memoryCount: count(collectionMemories.memoryId),
    })
    .from(collections)
    .leftJoin(collectionMemories, eq(collectionMemories.collectionId, collections.id))
    .where(and(...conditions))
    .groupBy(collections.id);
}

export async function createCollection(
  userId: string,
  input: CreateCollectionInput,
): Promise<CollectionResponse> {
  // Every collection created through this endpoint is user-owned — system
  // collections come from internal processes (onboarding defaults,
  // AI-suggested groupings), never this API.
  await assertWithinLimit(userId, PlanLimitType.COLLECTION_COUNT, 1);

  const [row] = await db
    .insert(collections)
    .values({ userId, name: input.name, icon: input.icon, description: input.description, source: CollectionSource.USER })
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

/**
 * One-way system -> user conversion. There is deliberately no path back —
 * nothing in this module ever sets source to "system", so a collection that
 * has been converted (or was user-created to begin with) can never revert.
 */
export async function convertToUser(userId: string, id: string): Promise<CollectionResponse> {
  const [existing] = await db
    .select()
    .from(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .limit(1);

  if (!existing) {
    throw new AppError("Collection not found", 404, "NOT_FOUND");
  }
  if (existing.source === CollectionSource.USER) {
    throw new AppError("This collection is already yours", 400, "ALREADY_USER_COLLECTION");
  }

  // Converting makes a previously-uncounted collection start counting
  // against the plan's collection limit — check before committing to it.
  await assertWithinLimit(userId, PlanLimitType.COLLECTION_COUNT, 1);

  const [row] = await db
    .update(collections)
    .set({ source: CollectionSource.USER, convertedFromSystemAt: new Date(), updatedAt: new Date() })
    .where(eq(collections.id, id))
    .returning();

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
