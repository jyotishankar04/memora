import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { defineRelations, sql } from "drizzle-orm";
import { vector, EMBEDDING_DIMENSIONS } from "../pgvector-type";
import { memoryTypeEnum, memoryStatusEnum, collectionSourceEnum } from "./enums.schema";
import { MemoryStatus, CollectionSource } from "../enums";
import { users } from "./auth.schema";

// ============================================================
// MEMORIES, COLLECTIONS & TAGS
// ============================================================

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    icon: varchar("icon", { length: 50 }).notNull().default("folder-outline"),
    description: text("description"),
    source: collectionSourceEnum("source").notNull().default(CollectionSource.USER),
    convertedFromSystemAt: timestamp("converted_from_system_at", { withTimezone: true }),
    isVaulted: boolean("is_vaulted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_collections_user_id").on(table.userId),
    index("idx_collections_user_source").on(table.userId, table.source),
  ]
);

export const memories = pgTable(
  "memories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: memoryTypeEnum("type").notNull(),
    status: memoryStatusEnum("status").notNull().default(MemoryStatus.PROCESSING),
    title: text("title").notNull().default("Untitled"),
    url: text("url"),
    normalizedUrl: text("normalized_url"),
    content: text("content"),
    description: text("description"),
    source: varchar("source", { length: 100 }),
    faviconUrl: text("favicon_url"),
    previewImageUrl: text("preview_image_url"),
    keywords: text("keywords").array(),
    previewStatus: text("preview_status"),
    previewSource: text("preview_source"),
    platform: text("platform"),
    resourceType: text("resource_type"),
    canonicalUrl: text("canonical_url"),
    fetchStatus: text("fetch_status"),
    captureMethod: text("capture_method"),
    browserCapture: jsonb("browser_capture"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    isArchived: boolean("is_archived").notNull().default(false),
    inTrash: boolean("in_trash").notNull().default(false),
    trashedAt: timestamp("trashed_at", { withTimezone: true }),
    isVaulted: boolean("is_vaulted").notNull().default(false),
    eventAt: timestamp("event_at", { withTimezone: true }),
    suggestedEventAt: timestamp("suggested_event_at", { withTimezone: true }),
    eventDetectionConfidence: real("event_detection_confidence"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    documentEmbedding: vector("document_embedding", EMBEDDING_DIMENSIONS),
    ftsTokens: text("fts_tokens"),
    resourceCategory: text("resource_category"),
    inferredIntent: text("inferred_intent"),
    intentConfidence: real("intent_confidence"),
    contentType: text("content_type"),
    extractedFields: jsonb("extracted_fields"),
  },
  (table) => [
    index("idx_memories_user_id").on(table.userId),
    index("idx_memories_user_created").on(table.userId, table.createdAt),
    index("idx_memories_user_normalized_url").on(table.userId, table.normalizedUrl),
    index("idx_memories_trashed_at").on(table.trashedAt).where(sql`${table.inTrash} = true`),
  ]
);

export const collectionMemories = pgTable(
  "collection_memories",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    memoryId: uuid("memory_id")
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.memoryId] }),
    index("idx_collection_memories_memory_id").on(table.memoryId),
  ]
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 50 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("uq_tags_user_name").on(table.userId, table.name)]
);

export const memoryTags = pgTable(
  "memory_tags",
  {
    memoryId: uuid("memory_id")
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.memoryId, table.tagId] }),
    index("idx_memory_tags_tag_id").on(table.tagId),
  ]
);

export const attachments = pgTable(
  "attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    memoryId: uuid("memory_id")
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
    fileUrl: text("file_url").notNull(),
    fileSize: integer("file_size"),
    mimeType: varchar("mime_type", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_attachments_memory_id").on(table.memoryId)]
);

export const memoryChunks = pgTable(
  "memory_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    memoryId: uuid("memory_id")
      .notNull()
      .references(() => memories.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    chunkIndex: integer("chunk_index").notNull(),
    chunkContent: text("chunk_content").notNull(),
    tokenCount: integer("token_count"),
    embedding: vector("embedding", EMBEDDING_DIMENSIONS).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("idx_memory_chunks_user_memory").on(table.userId, table.memoryId)]
);

export const threads = pgTable(
  "threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull().default("New chat"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_threads_user_id").on(table.userId)]
);
