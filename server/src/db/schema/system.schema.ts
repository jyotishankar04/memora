import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { announcementTypeEnum, announcementDisplayModeEnum } from "./enums.schema";
import { users } from "./auth.schema";

// ============================================================
// SYSTEM FEATURES & ADMIN
// ============================================================

export const featureFlags = pgTable(
  "feature_flags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    isEnabled: boolean("is_enabled").notNull().default(false),
    rolloutPercentage: integer("rollout_percentage").notNull().default(0),
    config: jsonb("config").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_feature_flags_key").on(table.key)]
);

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: announcementTypeEnum("type").notNull(),
    displayMode: announcementDisplayModeEnum("display_mode").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    ctaText: varchar("cta_text", { length: 100 }),
    ctaUrl: text("cta_url"),
    isActive: boolean("is_active").notNull().default(true),
    startAt: timestamp("start_at", { withTimezone: true }).notNull().defaultNow(),
    endAt: timestamp("end_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_announcements_is_active").on(table.isActive),
    index("idx_announcements_type").on(table.type),
  ]
);

export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminUserId: uuid("admin_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    action: varchar("action", { length: 100 }).notNull(),
    resource: varchar("resource", { length: 100 }).notNull(),
    resourceId: uuid("resource_id"),
    changes: jsonb("changes").$type<Record<string, unknown>>().notNull().default({}),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_admin_audit_logs_admin_user_id").on(table.adminUserId),
    index("idx_admin_audit_logs_resource").on(table.resource, table.resourceId),
    index("idx_admin_audit_logs_created_at").on(table.createdAt),
  ]
);

export const aiUsageLogs = pgTable(
  "ai_usage_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    model: varchar("model", { length: 100 }).notNull(),
    operation: varchar("operation", { length: 100 }).notNull(),
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    costMinor: integer("cost_minor").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_ai_usage_logs_user_id").on(table.userId),
    index("idx_ai_usage_logs_model").on(table.model),
    index("idx_ai_usage_logs_operation").on(table.operation),
  ]
);
