import { and, count, eq } from "drizzle-orm";
import { db } from "../../db";
import { collectionMemories, collections } from "../../db/schema";
import { CollectionSource, MemoryType, PlanLimitType, ShareResourceType } from "../../db/enums";
import { AppError } from "../../shared/errors/app-error";
import { assertWithinLimit } from "../plans/plans.service";
import { getSharedPayload, resolveShareAccess } from "../share/share.access";
import {
  getCollectionShareState,
  getCollectionShareStates,
  publishCollection,
  unpublishCollection,
} from "../share/share.service";
import type { CreateCollectionInput, ListCollectionsQuery, UpdateCollectionInput } from "./collection.schema";

export interface CollectionResponse {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  source: CollectionSource;
  memoryCount: number;
  isPublic: boolean;
  publicSlug: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Public collection pages are unauthenticated — every field here is
// deliberately public-safe, reviewed against the full memories schema
// rather than spreading a row and hoping nothing sensitive leaks. No
// status/diagnostic fields (fetchStatus, captureMethod, browserCapture,
// canonicalUrl), no owner-only fields (tags, isFavorite, isArchived).
export interface PublicMemoryItem {
  id: string;
  type: MemoryType;
  title: string;
  url: string | null;
  description: string | null;
  content: string | null;
  faviconUrl: string | null;
  previewImageUrl: string | null;
  createdAt: Date;
}

export interface PublicCollectionResponse {
  name: string;
  icon: string;
  description: string | null;
  memories: PublicMemoryItem[];
}

export async function listCollections(userId: string, query: ListCollectionsQuery): Promise<CollectionResponse[]> {
  const conditions = [eq(collections.userId, userId)];
  if (!query.includeSystem) {
    conditions.push(eq(collections.source, CollectionSource.USER));
  }

  const rows = await db
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

  // isPublic/publicSlug now live on `shares`, not on this table. They're
  // still returned so the existing client keeps working unchanged until the
  // new share UI lands — see the note on shareCollection below.
  const states = await getCollectionShareStates(rows.map((row) => row.id));

  return rows.map((row) => ({
    ...row,
    ...(states.get(row.id) ?? { isPublic: false, publicSlug: null }),
  }));
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

  // A brand-new collection has no share row yet.
  return { ...row, memoryCount: 0, isPublic: false, publicSlug: null };
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

  return { ...row, memoryCount, ...(await getCollectionShareState(id)) };
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

  return { ...row, memoryCount, ...(await getCollectionShareState(id)) };
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

/**
 * Legacy endpoint, now a thin wrapper over the sharing module.
 *
 * Publishing is no longer a Pro perk gated by plans.features — it's free
 * and capped by the PUBLIC_SHARE_COUNT plan limit, which publishCollection
 * enforces. The slug is still minted once and kept across unshare/reshare,
 * which is now a property of the share row rather than of this table.
 *
 * Kept only so the current client keeps working; it goes away with the
 * is_public/public_slug columns once the new share UI ships.
 */
export async function shareCollection(userId: string, id: string): Promise<CollectionResponse> {
  await publishCollection(userId, id);
  return getCollectionResponse(userId, id);
}

/** Legacy endpoint — see shareCollection. Keeps the slug, as it always did. */
export async function unshareCollection(userId: string, id: string): Promise<CollectionResponse> {
  await unpublishCollection(userId, id);
  return getCollectionResponse(userId, id);
}

/** Shared helper for the two legacy share endpoints above. */
async function getCollectionResponse(userId: string, id: string): Promise<CollectionResponse> {
  const [row] = await db
    .select()
    .from(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .limit(1);

  if (!row) {
    throw new AppError("Collection not found", 404, "NOT_FOUND");
  }

  const [{ value: memoryCount }] = await db
    .select({ value: count() })
    .from(collectionMemories)
    .where(eq(collectionMemories.collectionId, id));

  return { ...row, memoryCount, ...(await getCollectionShareState(id)) };
}

/**
 * Legacy unauthenticated reader for /c/:slug.
 *
 * Delegates to the sharing module so there is exactly one place that
 * decides whether a slug may be read — this used to be a second, parallel
 * implementation of that rule, which is precisely the drift the new model
 * exists to prevent. Only a genuinely public link resolves here; the
 * password and request modes are unreachable through this route by design,
 * since the old client has no UI for either.
 */
export async function getPublicCollection(slug: string): Promise<PublicCollectionResponse> {
  const decision = await resolveShareAccess(slug, null, []);

  if (decision.outcome !== "allow" || decision.share.resourceType !== ShareResourceType.COLLECTION) {
    throw new AppError("Collection not found", 404, "NOT_FOUND");
  }

  const payload = await getSharedPayload(decision.share);
  if (!payload.collection) {
    throw new AppError("Collection not found", 404, "NOT_FOUND");
  }

  return { ...payload.collection, memories: payload.memories };
}
