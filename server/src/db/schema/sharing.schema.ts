import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  shareResourceTypeEnum,
  shareLinkAccessEnum,
  shareGrantStatusEnum,
  shareGrantSourceEnum,
  shareAccessRequestStatusEnum,
  notificationTypeEnum,
} from "./enums.schema";
import { ShareGrantStatus, ShareGrantSource, ShareAccessRequestStatus } from "../enums";
import { users } from "./auth.schema";

// ============================================================
// SHARING & COLLABORATION
// ============================================================

export const shares = pgTable(
  "shares",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    resourceType: shareResourceTypeEnum("resource_type").notNull(),
    resourceId: uuid("resource_id").notNull(),
    linkToken: varchar("link_token", { length: 100 }).unique(),
    linkAccess: shareLinkAccessEnum("link_access"),
    allowDownload: boolean("allow_download").notNull().default(false),
    allowCopy: boolean("allow_copy").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_shares_user_id").on(table.userId),
    index("idx_shares_resource").on(table.resourceType, table.resourceId),
    uniqueIndex("uq_shares_link_token").on(table.linkToken),
  ]
);

export const shareGrants = pgTable(
  "share_grants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shareId: uuid("share_id")
      .notNull()
      .references(() => shares.id, { onDelete: "cascade" }),
    granteeEmail: varchar("grantee_email", { length: 255 }).notNull(),
    status: shareGrantStatusEnum("status").notNull().default(ShareGrantStatus.PENDING),
    source: shareGrantSourceEnum("source").notNull().default(ShareGrantSource.DIRECT_INVITE),
    allowedAt: timestamp("allowed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_share_grants_share_id").on(table.shareId),
    index("idx_share_grants_grantee_email").on(table.granteeEmail),
  ]
);

export const shareAccessRequests = pgTable(
  "share_access_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shareId: uuid("share_id")
      .notNull()
      .references(() => shares.id, { onDelete: "cascade" }),
    requesterEmail: varchar("requester_email", { length: 255 }).notNull(),
    status: shareAccessRequestStatusEnum("status").notNull().default(ShareAccessRequestStatus.PENDING),
    message: text("message"),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_share_access_requests_share_id").on(table.shareId),
    index("idx_share_access_requests_requester_email").on(table.requesterEmail),
  ]
);

export const shareViews = pgTable(
  "share_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shareId: uuid("share_id")
      .notNull()
      .references(() => shares.id, { onDelete: "cascade" }),
    viewerEmail: varchar("viewer_email", { length: 255 }),
    viewCount: integer("view_count").notNull().default(1),
    lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_share_views_share_id").on(table.shareId),
    index("idx_share_views_viewer_email").on(table.viewerEmail),
  ]
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message"),
    relatedEntityId: uuid("related_entity_id"),
    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_notifications_user_id").on(table.userId),
    index("idx_notifications_is_read").on(table.isRead),
  ]
);
