import { and, count, desc, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { db } from "../../db";
import { attachments, collectionMemories, collections, memories, memoryTags, tags } from "../../db/schema";
import { MemoryStatus, type MemoryType } from "../../db/enums";
import { AppError } from "../../shared/errors/app-error";
import { logger } from "../../shared/utils/logger";
import { enqueueIngestion } from "../ai/ingestion/queue";
import { getVectorStore } from "../ai/vector-store";
import { normalizeUrl } from "./normalize-url";
import type {
  AttachmentInput,
  BrowserCaptureInput,
  CreateMemoryInput,
  ListMemoriesQuery,
  UpdateMemoryInput,
} from "./memory.schema";

export interface MemoryListItem {
  id: string;
  type: string;
  title: string;
  url: string | null;
  description: string | null;
  source: string | null;
  faviconUrl: string | null;
  previewImageUrl: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  inTrash: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  // AI ingestion output (docs/AI_REQUIREMENTS.md) — null until the
  // background pipeline finishes for this memory.
  resourceCategory: string | null;
  inferredIntent: string | null;
  contentType: string | null;
  extractedFields: Record<string, string> | null;
  // URL capture & preview system (docs/URL_CAPTURE_AND_PREVIEW.md) — status
  // is always set (defaults to "processing"); the preview.* fields stay null
  // until ingestion runs, or forever for non-link memories.
  status: string;
  previewStatus: string | null;
  previewSource: string | null;
  platform: string | null;
  resourceType: string | null;
  canonicalUrl: string | null;
  captureMethod: string | null;
  collections: { id: string; name: string }[];
}

export interface AttachmentResponse {
  id: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: Date;
}

export interface MemoryDetail extends MemoryListItem {
  content: string | null;
  keywords: string[] | null;
  attachments: AttachmentResponse[];
}

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function attachTags(memoryIds: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (memoryIds.length === 0) return map;

  const rows = await db
    .select({ memoryId: memoryTags.memoryId, name: tags.name })
    .from(memoryTags)
    .innerJoin(tags, eq(memoryTags.tagId, tags.id))
    .where(inArray(memoryTags.memoryId, memoryIds));

  for (const row of rows) {
    const list = map.get(row.memoryId) ?? [];
    list.push(row.name);
    map.set(row.memoryId, list);
  }
  return map;
}

async function attachCollections(memoryIds: string[]): Promise<Map<string, { id: string; name: string }[]>> {
  const map = new Map<string, { id: string; name: string }[]>();
  if (memoryIds.length === 0) return map;

  const rows = await db
    .select({ memoryId: collectionMemories.memoryId, id: collections.id, name: collections.name })
    .from(collectionMemories)
    .innerJoin(collections, eq(collectionMemories.collectionId, collections.id))
    .where(inArray(collectionMemories.memoryId, memoryIds));

  for (const row of rows) {
    const list = map.get(row.memoryId) ?? [];
    list.push({ id: row.id, name: row.name });
    map.set(row.memoryId, list);
  }
  return map;
}

// Resolves tag names to ids for a user, creating any that don't exist yet.
export async function resolveTagIds(tx: Tx, userId: string, tagNames: string[]): Promise<string[]> {
  const uniqueNames = [...new Set(tagNames.map((name) => name.trim()).filter(Boolean))];
  if (uniqueNames.length === 0) return [];

  await tx
    .insert(tags)
    .values(uniqueNames.map((name) => ({ userId, name })))
    .onConflictDoNothing({ target: [tags.userId, tags.name] });

  const rows = await tx
    .select({ id: tags.id })
    .from(tags)
    .where(and(eq(tags.userId, userId), inArray(tags.name, uniqueNames)));

  return rows.map((row) => row.id);
}

function toListItem(
  row: typeof memories.$inferSelect,
  memoryTagsList: string[],
  memoryCollectionsList: { id: string; name: string }[],
): MemoryListItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    url: row.url,
    description: row.description,
    source: row.source,
    faviconUrl: row.faviconUrl,
    previewImageUrl: row.previewImageUrl,
    isFavorite: row.isFavorite,
    isArchived: row.isArchived,
    inTrash: row.inTrash,
    tags: memoryTagsList,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    resourceCategory: row.resourceCategory,
    inferredIntent: row.inferredIntent,
    contentType: row.contentType,
    extractedFields: row.extractedFields as Record<string, string> | null,
    status: row.status,
    previewStatus: row.previewStatus,
    previewSource: row.previewSource,
    platform: row.platform,
    resourceType: row.resourceType,
    canonicalUrl: row.canonicalUrl,
    captureMethod: row.captureMethod,
    collections: memoryCollectionsList,
  };
}

export async function listMemories(
  userId: string,
  query: ListMemoriesQuery,
): Promise<{ items: MemoryListItem[]; page: number; limit: number; total: number }> {
  const conditions: SQL[] = [
    eq(memories.userId, userId),
    eq(memories.inTrash, query.inTrash ?? false),
    eq(memories.isArchived, query.isArchived ?? false),
  ];

  if (query.type) conditions.push(eq(memories.type, query.type as MemoryType));
  if (query.isFavorite !== undefined) conditions.push(eq(memories.isFavorite, query.isFavorite));
  if (query.q) {
    conditions.push(or(ilike(memories.title, `%${query.q}%`), ilike(memories.description, `%${query.q}%`))!);
  }

  if (query.collectionId) {
    const rows = await db
      .select({ memoryId: collectionMemories.memoryId })
      .from(collectionMemories)
      .where(eq(collectionMemories.collectionId, query.collectionId));
    const ids = rows.map((row) => row.memoryId);
    if (ids.length === 0) return { items: [], page: query.page, limit: query.limit, total: 0 };
    conditions.push(inArray(memories.id, ids));
  }

  if (query.tag) {
    const rows = await db
      .select({ memoryId: memoryTags.memoryId })
      .from(memoryTags)
      .innerJoin(tags, eq(memoryTags.tagId, tags.id))
      .where(and(eq(tags.userId, userId), eq(tags.name, query.tag)));
    const ids = rows.map((row) => row.memoryId);
    if (ids.length === 0) return { items: [], page: query.page, limit: query.limit, total: 0 };
    conditions.push(inArray(memories.id, ids));
  }

  const where = and(...conditions);

  const [{ value: total }] = await db.select({ value: count() }).from(memories).where(where);

  const rows = await db
    .select()
    .from(memories)
    .where(where)
    .orderBy(desc(memories.createdAt))
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);

  const memoryIds = rows.map((row) => row.id);
  const [tagsByMemory, collectionsByMemory] = await Promise.all([
    attachTags(memoryIds),
    attachCollections(memoryIds),
  ]);
  const items = rows.map((row) =>
    toListItem(row, tagsByMemory.get(row.id) ?? [], collectionsByMemory.get(row.id) ?? []),
  );

  return { items, page: query.page, limit: query.limit, total };
}

export async function getMemoryById(userId: string, id: string): Promise<MemoryDetail> {
  const [row] = await db
    .select()
    .from(memories)
    .where(and(eq(memories.id, id), eq(memories.userId, userId)))
    .limit(1);

  if (!row) {
    throw new AppError("Memory not found", 404, "NOT_FOUND");
  }

  const [tagsByMemory, collectionsByMemory] = await Promise.all([
    attachTags([row.id]),
    attachCollections([row.id]),
  ]);

  const attachmentRows = await db
    .select({
      id: attachments.id,
      fileUrl: attachments.fileUrl,
      fileSize: attachments.fileSize,
      mimeType: attachments.mimeType,
      createdAt: attachments.createdAt,
    })
    .from(attachments)
    .where(eq(attachments.memoryId, row.id));

  return {
    ...toListItem(row, tagsByMemory.get(row.id) ?? [], collectionsByMemory.get(row.id) ?? []),
    content: row.content,
    keywords: row.keywords,
    attachments: attachmentRows,
  };
}

async function insertAttachments(tx: Tx, memoryId: string, input: AttachmentInput[]): Promise<void> {
  if (input.length === 0) return;
  await tx.insert(attachments).values(
    input.map((attachment) => ({
      memoryId,
      fileUrl: attachment.fileUrl,
      fileSize: attachment.fileSize,
      mimeType: attachment.mimeType,
    })),
  );
}

export async function createMemory(
  userId: string,
  input: CreateMemoryInput,
): Promise<MemoryDetail & { duplicateOf: { id: string; title: string } | null }> {
  // Non-blocking duplicate detection (docs/URL_CAPTURE_AND_PREVIEW.md) — never
  // a reason to refuse the save, only a hint the client can surface.
  const normalizedUrl = normalizeUrl(input.url);
  const duplicateOf = normalizedUrl
    ? await db
        .select({ id: memories.id, title: memories.title })
        .from(memories)
        .where(
          and(
            eq(memories.userId, userId),
            eq(memories.normalizedUrl, normalizedUrl),
            eq(memories.inTrash, false),
          ),
        )
        .limit(1)
        .then((rows) => rows[0] ?? null)
    : null;

  const memoryId = await db.transaction(async (tx) => {
    // An image memory with an uploaded attachment but no explicit preview gets
    // one for free — this is what makes the list-view thumbnail show the real
    // uploaded image without any client-side change.
    const previewImageUrl =
      input.previewImageUrl ??
      (input.type === "image" ? input.attachments?.[0]?.fileUrl : undefined);

    const values: typeof memories.$inferInsert = {
      userId,
      type: input.type as MemoryType,
      title: input.title ?? "Untitled",
      url: input.url,
      normalizedUrl,
      content: input.content,
      description: input.description,
      faviconUrl: input.faviconUrl,
      previewImageUrl,
      keywords: input.keywords,
      captureMethod: input.captureMethod ?? "manual",
    };
    const [row] = await tx.insert(memories).values(values).returning({ id: memories.id });

    if (input.attachments?.length) {
      await insertAttachments(tx, row.id, input.attachments);
    }

    if (input.collectionIds?.length) {
      const owned = await tx
        .select({ id: collections.id })
        .from(collections)
        .where(and(eq(collections.userId, userId), inArray(collections.id, input.collectionIds)));
      if (owned.length > 0) {
        await tx
          .insert(collectionMemories)
          .values(owned.map((collection) => ({ collectionId: collection.id, memoryId: row.id })));
      }
    }

    if (input.tags?.length) {
      const tagIds = await resolveTagIds(tx, userId, input.tags);
      if (tagIds.length > 0) {
        await tx.insert(memoryTags).values(tagIds.map((tagId) => ({ memoryId: row.id, tagId })));
      }
    }

    return row.id;
  });

  // Fire-and-forget: AI ingestion runs async in the background — a queue
  // failure must never fail the create request itself.
  enqueueIngestion(memoryId).catch((err) => {
    logger.error({ memoryId, err }, "Failed to enqueue ingestion job");
  });

  const detail = await getMemoryById(userId, memoryId);
  return { ...detail, duplicateOf };
}

export async function updateMemory(
  userId: string,
  id: string,
  input: UpdateMemoryInput,
): Promise<MemoryDetail> {
  await db.transaction(async (tx) => {
    const columns: Record<string, unknown> = { updatedAt: new Date() };
    if (input.title !== undefined) columns.title = input.title;
    if (input.content !== undefined) columns.content = input.content;
    if (input.description !== undefined) columns.description = input.description;
    if (input.isFavorite !== undefined) columns.isFavorite = input.isFavorite;
    if (input.isArchived !== undefined) columns.isArchived = input.isArchived;
    if (input.inTrash !== undefined) columns.inTrash = input.inTrash;

    const [updated] = await tx
      .update(memories)
      .set(columns)
      .where(and(eq(memories.id, id), eq(memories.userId, userId)))
      .returning({ id: memories.id });

    if (!updated) {
      throw new AppError("Memory not found", 404, "NOT_FOUND");
    }

    if (input.collectionIds !== undefined) {
      await tx.delete(collectionMemories).where(eq(collectionMemories.memoryId, id));
      if (input.collectionIds.length > 0) {
        const owned = await tx
          .select({ id: collections.id })
          .from(collections)
          .where(and(eq(collections.userId, userId), inArray(collections.id, input.collectionIds)));
        if (owned.length > 0) {
          await tx
            .insert(collectionMemories)
            .values(owned.map((collection) => ({ collectionId: collection.id, memoryId: id })));
        }
      }
    }

    if (input.tags !== undefined) {
      await tx.delete(memoryTags).where(eq(memoryTags.memoryId, id));
      if (input.tags.length > 0) {
        const tagIds = await resolveTagIds(tx, userId, input.tags);
        if (tagIds.length > 0) {
          await tx.insert(memoryTags).values(tagIds.map((tagId) => ({ memoryId: id, tagId })));
        }
      }
    }

    if (input.attachments !== undefined) {
      await tx.delete(attachments).where(eq(attachments.memoryId, id));
      await insertAttachments(tx, id, input.attachments);
    }
  });

  return getMemoryById(userId, id);
}

export async function deleteMemory(userId: string, id: string): Promise<void> {
  const [deleted] = await db
    .delete(memories)
    .where(and(eq(memories.id, id), eq(memories.userId, userId)))
    .returning({ id: memories.id });

  if (!deleted) {
    throw new AppError("Memory not found", 404, "NOT_FOUND");
  }

  // Only meaningful when VECTOR_STORE_PROVIDER=upstash — pgvector cleans up
  // via cascade automatically. Best-effort: an orphaned vector costs a
  // little storage, but must never block the delete response.
  getVectorStore()
    .deleteMemoryVectors(id)
    .catch((err) => {
      logger.error({ memoryId: id, err }, "Failed to delete memory vectors");
    });
}

async function assertOwnedMemory(userId: string, id: string): Promise<void> {
  const [row] = await db
    .select({ id: memories.id })
    .from(memories)
    .where(and(eq(memories.id, id), eq(memories.userId, userId)))
    .limit(1);
  if (!row) {
    throw new AppError("Memory not found", 404, "NOT_FOUND");
  }
}

// Extension submits whatever the live DOM already gave it (POST
// /:id/browser-capture) — stored as-is, then re-run through ingestion so
// parseWebContent's merge step (buildPreview) can upgrade the preview with
// it, per docs/URL_CAPTURE_AND_PREVIEW.md.
export async function submitBrowserCapture(
  userId: string,
  id: string,
  payload: BrowserCaptureInput,
): Promise<MemoryDetail> {
  await assertOwnedMemory(userId, id);

  await db
    .update(memories)
    .set({ browserCapture: payload, updatedAt: new Date() })
    .where(and(eq(memories.id, id), eq(memories.userId, userId)));

  await enqueueIngestion(id).catch((err) => {
    logger.error({ memoryId: id, err }, "Failed to enqueue ingestion job for browser capture");
  });

  return getMemoryById(userId, id);
}

// Re-runs ingestion on demand (e.g. user clicks "retry preview"). A failed
// refresh leaves the prior preview fields untouched — upsertVectors only
// ever writes a field when the corresponding state value is non-null (see
// its `?? undefined` pattern), so nothing gets clobbered by a bad retry.
export async function refreshPreview(userId: string, id: string): Promise<MemoryDetail> {
  await assertOwnedMemory(userId, id);

  await db
    .update(memories)
    .set({ status: MemoryStatus.PROCESSING, updatedAt: new Date() })
    .where(and(eq(memories.id, id), eq(memories.userId, userId)));

  await enqueueIngestion(id).catch((err) => {
    logger.error({ memoryId: id, err }, "Failed to enqueue ingestion job for preview refresh");
  });

  return getMemoryById(userId, id);
}

export interface ProcessingStatus {
  status: string;
  previewStatus: string | null;
  fetchStatus: string | null;
}

export async function getProcessingStatus(userId: string, id: string): Promise<ProcessingStatus> {
  const [row] = await db
    .select({ status: memories.status, previewStatus: memories.previewStatus, fetchStatus: memories.fetchStatus })
    .from(memories)
    .where(and(eq(memories.id, id), eq(memories.userId, userId)))
    .limit(1);

  if (!row) {
    throw new AppError("Memory not found", 404, "NOT_FOUND");
  }

  return row;
}
