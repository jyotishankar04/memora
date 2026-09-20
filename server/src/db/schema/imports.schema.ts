import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { importItemStatusEnum, importSourceTypeEnum } from "./enums.schema";
import { ImportItemStatus } from "../enums";
import { users } from "./auth.schema";

// ============================================================
// IMPORT MANAGEMENT
// ============================================================

export const importBatches = pgTable(
  "import_batches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceType: importSourceTypeEnum("source_type").notNull(),
    totalItems: integer("total_items").notNull().default(0),
    processedItems: integer("processed_items").notNull().default(0),
    failedItems: integer("failed_items").notNull().default(0),
    sourceFileName: varchar("source_file_name", { length: 255 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_import_batches_user_id").on(table.userId),
    index("idx_import_batches_source_type").on(table.sourceType),
  ]
);

export const importItems = pgTable(
  "import_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    batchId: uuid("batch_id")
      .notNull()
      .references(() => importBatches.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceItemId: varchar("source_item_id", { length: 255 }),
    title: varchar("title", { length: 255 }).notNull(),
    url: text("url"),
    content: text("content"),
    status: importItemStatusEnum("status").notNull().default(ImportItemStatus.CREATED),
    resultingMemoryId: uuid("resulting_memory_id"),
    errorMessage: text("error_message"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_import_items_batch_id").on(table.batchId),
    index("idx_import_items_user_id").on(table.userId),
    index("idx_import_items_status").on(table.status),
  ]
);
