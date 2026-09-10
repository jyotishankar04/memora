import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import { vector, tsvector, EMBEDDING_DIMENSIONS } from "./pgvector-type";
import {
  AccentColor,
  AnnouncementDisplayMode,
  AnnouncementType,
  CollectionSource,
  CouponDiscountType,
  CouponRedemptionStatus,
  CreditLedgerReason,
  MemoryStatus,
  MemoryType,
  OrganizeMode,
  PlanAssignmentSource,
  PlanAssignmentStatus,
  PlanBillingInterval,
  PlanLimitType,
  Provider,
  ReferralCodeType,
  ReferralConversionStage,
  SettingsTheme,
  TransactionStatus,
  TransactionType,
  UserStatus,
} from "./enums";

export const userStatusEnum = pgEnum("user_status", [
  UserStatus.ACTIVE,
  UserStatus.INACTIVE,
  UserStatus.BANNED,
  UserStatus.SUSPENDED,
  UserStatus.DELETED,
]);

export const providerEnum = pgEnum("provider", [
  Provider.GOOGLE,
  Provider.GITHUB,
]);

export const settingsThemeEnum = pgEnum("settings_theme", [
  SettingsTheme.SYSTEM,
  SettingsTheme.LIGHT,
  SettingsTheme.DARK,
]);

export const accentColorEnum = pgEnum("accent_color", [
  AccentColor.BLUE,
  AccentColor.PURPLE,
  AccentColor.GREEN,
  AccentColor.ORANGE,
]);

export const organizeModeEnum = pgEnum("organize_mode", [
  OrganizeMode.AUTO,
  OrganizeMode.MANUAL,
]);

export const memoryTypeEnum = pgEnum("memory_type", [
  MemoryType.WEB,
  MemoryType.VIDEO,
  MemoryType.NOTE,
  MemoryType.IMAGE,
  MemoryType.DOCUMENT,
  MemoryType.VOICE,
]);

export const memoryStatusEnum = pgEnum("memory_status", [
  MemoryStatus.PROCESSING,
  MemoryStatus.READY,
  MemoryStatus.PARTIAL,
  MemoryStatus.FAILED,
]);

export const announcementTypeEnum = pgEnum("announcement_type", [
  AnnouncementType.COUNTDOWN,
  AnnouncementType.ANNOUNCEMENT,
  AnnouncementType.UPDATE,
]);

export const announcementDisplayModeEnum = pgEnum("announcement_display_mode", [
  AnnouncementDisplayMode.BANNER,
  AnnouncementDisplayMode.FULL_PAGE,
]);

export const collectionSourceEnum = pgEnum("collection_source", [
  CollectionSource.USER,
  CollectionSource.SYSTEM,
]);

export const planLimitTypeEnum = pgEnum("plan_limit_type", [
  PlanLimitType.MEMORY_COUNT,
  PlanLimitType.AI_MONTHLY_QUERIES,
  PlanLimitType.STORAGE_MB,
  PlanLimitType.COLLECTION_COUNT,
]);

export const planBillingIntervalEnum = pgEnum("plan_billing_interval", [
  PlanBillingInterval.MONTHLY,
  PlanBillingInterval.YEARLY,
  PlanBillingInterval.ONE_TIME,
]);

export const planAssignmentStatusEnum = pgEnum("plan_assignment_status", [
  PlanAssignmentStatus.ACTIVE,
  PlanAssignmentStatus.EXPIRED,
  PlanAssignmentStatus.CANCELLED,
  PlanAssignmentStatus.SUPERSEDED,
]);

export const planAssignmentSourceEnum = pgEnum("plan_assignment_source", [
  PlanAssignmentSource.ADMIN_MANUAL,
  PlanAssignmentSource.SIGNUP_DEFAULT,
  PlanAssignmentSource.REFERRAL_REWARD,
  PlanAssignmentSource.COUPON_REDEMPTION,
  PlanAssignmentSource.PAYMENT,
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  TransactionType.SUBSCRIPTION_PURCHASE,
  TransactionType.SUBSCRIPTION_RENEWAL,
  TransactionType.UPGRADE,
  TransactionType.DOWNGRADE,
  TransactionType.REFUND,
  TransactionType.ADMIN_GRANT,
]);

export const transactionStatusEnum = pgEnum("transaction_status", [
  TransactionStatus.PENDING,
  TransactionStatus.SUCCEEDED,
  TransactionStatus.FAILED,
  TransactionStatus.REFUNDED,
  TransactionStatus.CANCELLED,
]);

export const couponDiscountTypeEnum = pgEnum("coupon_discount_type", [
  CouponDiscountType.PERCENTAGE,
  CouponDiscountType.FIXED_AMOUNT,
]);

export const couponRedemptionStatusEnum = pgEnum("coupon_redemption_status", [
  CouponRedemptionStatus.APPLIED,
  CouponRedemptionStatus.CONVERTED,
  CouponRedemptionStatus.EXPIRED,
  CouponRedemptionStatus.REVOKED,
]);

export const referralCodeTypeEnum = pgEnum("referral_code_type", [
  ReferralCodeType.USER,
  ReferralCodeType.ADMIN_ISSUED,
]);

export const referralConversionStageEnum = pgEnum("referral_conversion_stage", [
  ReferralConversionStage.APPLIED,
  ReferralConversionStage.CONVERTED,
]);

export const creditLedgerReasonEnum = pgEnum("credit_ledger_reason", [
  CreditLedgerReason.REFERRAL_REWARD,
  CreditLedgerReason.ADMIN_ADJUSTMENT,
  CreditLedgerReason.PROMOTION,
  CreditLedgerReason.EXPIRATION,
]);

// -----------------------------------------------------------------------------
// 1. Users Table
// -----------------------------------------------------------------------------
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  status: userStatusEnum("status").notNull().default(UserStatus.ACTIVE),
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// -----------------------------------------------------------------------------
// 2. OAuth Auth Identities Table
// -----------------------------------------------------------------------------
export const authIdentities = pgTable(
  "auth_identities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: providerEnum("provider").notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    providerData: jsonb("provider_data")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("uq_auth_identities_provider_provider_id").on(
      table.provider,
      table.providerId
    ),
    index("idx_auth_identities_user_id").on(table.userId),
  ]
);

// -----------------------------------------------------------------------------
// 3. Dynamic Roles Table (Supports Free, Pro, Admin, Custom)
// -----------------------------------------------------------------------------
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g. "free_user", "pro_user", "admin"
  description: text("description"),
  isSystem: boolean("is_system").notNull().default(false), // Protected core roles
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// -----------------------------------------------------------------------------
// 4. Dynamic Permissions Table
// -----------------------------------------------------------------------------
export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g. "bookmarks:export", "ai:summarize", "billing:manage"
  description: text("description"),
  category: varchar("category", { length: 100 }), // e.g. "ai", "bookmarks", "billing", "admin"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// -----------------------------------------------------------------------------
// 5. Role Permissions (Dynamic Role <-> Permission mapping)
// -----------------------------------------------------------------------------
export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_role_permissions_role_perm").on(
      table.roleId,
      table.permissionId
    ),
    index("idx_role_permissions_role_id").on(table.roleId),
  ]
);

// -----------------------------------------------------------------------------
// 6. User Roles (Dynamic User <-> Role assignment)
// -----------------------------------------------------------------------------
export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    assignedBy: uuid("assigned_by").references(() => users.id, {
      onDelete: "set null",
    }),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_user_roles_user_role").on(table.userId, table.roleId),
    index("idx_user_roles_user_id").on(table.userId),
  ]
);

// -----------------------------------------------------------------------------
// 7. Refresh Tokens Table
// -----------------------------------------------------------------------------
export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revoked: boolean("revoked").notNull().default(false),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_refresh_tokens_user_id").on(table.userId)]
);

// -----------------------------------------------------------------------------
// 8. Sessions Table
// -----------------------------------------------------------------------------
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    refreshTokenId: uuid("refresh_token_id").references(
      () => refreshTokens.id,
      { onDelete: "cascade" }
    ),
    deviceId: varchar("device_id", { length: 255 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_sessions_user_id").on(table.userId)]
);

// -----------------------------------------------------------------------------
// 9. Devices Table
// -----------------------------------------------------------------------------
export const devices = pgTable(
  "devices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deviceFingerprint: varchar("device_fingerprint", { length: 255 }).notNull(),
    deviceName: varchar("device_name", { length: 255 }),
    platform: varchar("platform", { length: 100 }),
    browser: varchar("browser", { length: 100 }),
    deviceType: varchar("device_type", { length: 100 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("uq_devices_user_fingerprint").on(
      table.userId,
      table.deviceFingerprint
    ),
    index("idx_devices_user_id").on(table.userId),
  ]
);

// -----------------------------------------------------------------------------
// 10. User Onboarding Table (answers collected by the /onboard questionnaire)
// -----------------------------------------------------------------------------
export const userOnboarding = pgTable("user_onboarding", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  interests: jsonb("interests").$type<string[]>().notNull().default([]),
  contentTypes: jsonb("content_types").$type<string[]>().notNull().default([]),
  organizeMode: organizeModeEnum("organize_mode")
    .notNull()
    .default(OrganizeMode.AUTO),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// -----------------------------------------------------------------------------
// 11. User Settings Table (ai / capture / notifications / appearance toggles)
// -----------------------------------------------------------------------------
// No `default_collection_id` column yet — the `collections` table doesn't
// exist in this schema yet (memory-capture layer, not built). The settings
// API reports it as always null until that lands.
export const userSettings = pgTable("user_settings", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  aiAutoOrganization: boolean("ai_auto_organization").notNull().default(true),
  aiSummaries: boolean("ai_summaries").notNull().default(true),
  aiRelatedMemories: boolean("ai_related_memories").notNull().default(true),
  aiSemanticSearch: boolean("ai_semantic_search").notNull().default(true),
  aiAskMemora: boolean("ai_ask_memora").notNull().default(true),
  captureExtractContent: boolean("capture_extract_content").notNull().default(true),
  captureGenerateTitle: boolean("capture_generate_title").notNull().default(true),
  captureGenerateSummary: boolean("capture_generate_summary").notNull().default(true),
  captureSuggestTags: boolean("capture_suggest_tags").notNull().default(true),
  notifyWeeklySummary: boolean("notify_weekly_summary").notNull().default(true),
  notifyForgottenMemories: boolean("notify_forgotten_memories").notNull().default(true),
  notifyProductUpdates: boolean("notify_product_updates").notNull().default(false),
  theme: settingsThemeEnum("theme").notNull().default(SettingsTheme.SYSTEM),
  accentColor: accentColorEnum("accent_color").notNull().default(AccentColor.BLUE),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// -----------------------------------------------------------------------------
// 12. Collections Table
// -----------------------------------------------------------------------------
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
    // "system" collections (onboarding defaults, AI-suggested groupings) stay
    // hidden in the UI behind a toggle and never count against the
    // collection_count plan limit. Conversion is one-way (system -> user
    // only, via collection.service.ts's convertToUser) — convertedFromSystemAt
    // being non-null doubles as "already converted," so there's no separate
    // boolean to drift out of sync.
    source: collectionSourceEnum("source").notNull().default(CollectionSource.USER),
    convertedFromSystemAt: timestamp("converted_from_system_at", { withTimezone: true }),
    // Pro-only "shareable collection" perk (plans.features.publicCollections
    // gates who can set this). publicSlug is generated once on first share
    // and never regenerated — toggling isPublic off/on again reuses the
    // same link rather than rotating it, so a link a user already shared
    // doesn't silently break just because they paused sharing.
    isPublic: boolean("is_public").notNull().default(false),
    publicSlug: varchar("public_slug", { length: 32 }).unique(),
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

// -----------------------------------------------------------------------------
// 13. Memories Table
// -----------------------------------------------------------------------------
export const memories = pgTable(
  "memories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: memoryTypeEnum("type").notNull(),
    // Always exists once POST /memories returns — this describes enrichment
    // progress, never whether the memory itself succeeded or failed to save.
    status: memoryStatusEnum("status").notNull().default(MemoryStatus.PROCESSING),
    title: text("title").notNull().default("Untitled"),
    url: text("url"),
    // Lowercased host, tracking params/fragment/trailing-slash stripped —
    // for non-blocking duplicate detection (see normalize-url.ts). Null for
    // non-link memories.
    normalizedUrl: text("normalized_url"),
    content: text("content"),
    description: text("description"),
    source: varchar("source", { length: 100 }),
    faviconUrl: text("favicon_url"),
    previewImageUrl: text("preview_image_url"),
    keywords: text("keywords").array(),
    // URL capture & preview system (docs/URL_CAPTURE_AND_PREVIEW.md) — all
    // null until ingestion runs, or forever null for non-link memories.
    previewStatus: text("preview_status"),
    previewSource: text("preview_source"),
    platform: text("platform"),
    resourceType: text("resource_type"),
    canonicalUrl: text("canonical_url"),
    // Diagnostics only — never shown to the user directly, see UI_COPY in
    // the plan ("Preview unavailable", not "Cloudflare blocked our crawler").
    fetchStatus: text("fetch_status"),
    captureMethod: text("capture_method"),
    // Raw browser-observed metadata from the Chrome extension's
    // POST /:id/browser-capture, consumed by the ingestion pipeline's merge
    // step and kept for re-merging on a later /refresh-preview.
    browserCapture: jsonb("browser_capture"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    isArchived: boolean("is_archived").notNull().default(false),
    inTrash: boolean("in_trash").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),

    // AI ingestion (docs/AI_REQUIREMENTS.md) — populated async by the
    // ingestion pipeline after create, all nullable until that job runs.
    documentEmbedding: vector("document_embedding", EMBEDDING_DIMENSIONS),
    // Populated by a DB trigger from title/description/inferred_intent/content
    // (see the ingestion migration) — the app never writes this column.
    ftsTokens: tsvector("fts_tokens"),
    resourceCategory: text("resource_category"),
    inferredIntent: text("inferred_intent"),
    intentConfidence: real("intent_confidence"),
    // Open-vocabulary content type (e.g. "recipe", "task", "quote" — not
    // constrained to a fixed enum, unlike resourceCategory) plus whatever
    // structured fields the DetectContentType node pulled out of the raw
    // text for that type (e.g. a recipe's ingredients, a task's due date).
    contentType: text("content_type"),
    extractedFields: jsonb("extracted_fields"),
  },
  (table) => [
    index("idx_memories_user_id").on(table.userId),
    index("idx_memories_user_created").on(table.userId, table.createdAt),
    index("idx_memories_user_normalized_url").on(table.userId, table.normalizedUrl),
  ]
);

// -----------------------------------------------------------------------------
// 14. Collection <-> Memory Junction Table
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// 15. Tags Table (scoped per-user — a tag name is only unique within its owner)
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// 16. Memory <-> Tag Junction Table
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// 17. Attachments Table (files uploaded to R2 and linked to a memory)
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// 18. Memory Chunks Table (semantic chunks for RAG retrieval, AI ingestion)
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// 19. Threads Table (Ask SaveForLatter chat threads — listing/naming only;
//     message content lives in LangGraph's own Postgres checkpointer tables,
//     keyed by this table's id as thread_id)
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// 20. Feature Flags Table (global config as key/value — auth toggles,
//     signups toggle, maintenance mode, and any future flag, all without a
//     migration per flag. Read via feature-flags.service.ts's typed getters,
//     never raw, by callers like auth.service.ts and the maintenance guard.)
// -----------------------------------------------------------------------------
export const featureFlags = pgTable(
  "feature_flags",
  {
    key: varchar("key", { length: 100 }).primaryKey(),
    value: jsonb("value").notNull(),
    description: text("description"),
    category: varchar("category", { length: 50 }), // e.g. "auth", "system", "experimental"
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_feature_flags_category").on(table.category)]
);

// -----------------------------------------------------------------------------
// 21. Announcements Table (launch/update countdowns and banners — a history,
//     not a singleton; "only one active" is enforced in the service layer)
// -----------------------------------------------------------------------------
export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: announcementTypeEnum("type").notNull().default(AnnouncementType.ANNOUNCEMENT),
    // "full_page" blocks every page (marketing, platform, auth) except /admin,
    // the same way maintenance mode does — for hard launch splashes, not the
    // default sticky-banner treatment.
    displayMode: announcementDisplayModeEnum("display_mode").notNull().default(AnnouncementDisplayMode.BANNER),
    title: varchar("title", { length: 200 }).notNull(),
    message: text("message").notNull(),
    targetDate: timestamp("target_date", { withTimezone: true }),
    ctaLabel: varchar("cta_label", { length: 100 }),
    ctaUrl: text("cta_url"),
    isActive: boolean("is_active").notNull().default(false),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_announcements_active").on(table.isActive),
    index("idx_announcements_created_at").on(table.createdAt),
  ]
);

// -----------------------------------------------------------------------------
// 22. AI Usage Logs Table (per-call token/cost record for the admin AI-usage
//     dashboard. FKs use "set null" rather than this schema's usual cascade —
//     aggregate cost history should survive a user/thread/memory deletion.)
// -----------------------------------------------------------------------------
export const aiUsageLogs = pgTable(
  "ai_usage_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    requestType: varchar("request_type", { length: 100 }).notNull(), // e.g. "ingestion:classify_intent", "rag:agent", "embedding:document"
    provider: varchar("provider", { length: 50 }).notNull(), // "groq" | "openai" — distinct from the OAuth providerEnum
    model: varchar("model", { length: 100 }).notNull(),
    promptTokens: integer("prompt_tokens"),
    completionTokens: integer("completion_tokens"),
    totalTokens: integer("total_tokens"),
    costEstimateUsd: real("cost_estimate_usd"),
    threadId: uuid("thread_id").references(() => threads.id, { onDelete: "set null" }),
    memoryId: uuid("memory_id").references(() => memories.id, { onDelete: "set null" }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_ai_usage_logs_user_created").on(table.userId, table.createdAt),
    index("idx_ai_usage_logs_created_at").on(table.createdAt),
    index("idx_ai_usage_logs_request_type_created").on(table.requestType, table.createdAt),
  ]
);

// -----------------------------------------------------------------------------
// 23. Admin Audit Logs Table (who did what admin action, to what, when —
//     written from every mutating admin endpoint)
// -----------------------------------------------------------------------------
export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminUserId: uuid("admin_user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }).notNull(), // e.g. "user.role.granted", "flag.updated"
    targetType: varchar("target_type", { length: 50 }), // e.g. "user", "feature_flag", "announcement"
    targetId: varchar("target_id", { length: 255 }), // polymorphic — not a strict FK
    beforeValue: jsonb("before_value"),
    afterValue: jsonb("after_value"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_admin_audit_logs_admin_user_created").on(table.adminUserId, table.createdAt),
    index("idx_admin_audit_logs_target").on(table.targetType, table.targetId),
  ]
);

// -----------------------------------------------------------------------------
// 24. Plans Table (admin-editable pricing tiers — Free/Plus/Pro today, but not
//     a hardcoded enum: an admin can rename, reprice, or add a tier without a
//     deploy. `key` is the stable machine identifier other code references;
//     `name` is the only field an admin is expected to change often.)
// -----------------------------------------------------------------------------
export const plans = pgTable(
  "plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 50 }).notNull().unique(), // e.g. "free", "plus", "pro" — never renamed
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    priceMinor: integer("price_minor").notNull().default(0), // cents
    currency: varchar("currency", { length: 3 }).notNull().default("usd"),
    billingInterval: planBillingIntervalEnum("billing_interval")
      .notNull()
      .default(PlanBillingInterval.MONTHLY),
    isActive: boolean("is_active").notNull().default(true),
    // Auto-assigned on signup. Only one plan may be default at a time —
    // enforced in the service layer with the same flip-others-first
    // transaction pattern as announcements.isActive.
    isDefault: boolean("is_default").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    // Admin-editable, boolean/on-off perks distinct from the numeric
    // PlanLimitType quota system above (memory_count etc.) — for capabilities
    // that are either on or off rather than a countable limit, e.g.
    // publicCollections. Checked via plans/plans.service.ts's hasFeature(),
    // the boolean-returning counterpart to assertWithinLimit().
    features: jsonb("features").$type<Record<string, boolean>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_plans_active_sort").on(table.isActive, table.sortOrder)]
);

// -----------------------------------------------------------------------------
// 25. Plan Limits Table (one row per plan per limit type — admin-editable
//     numbers, not code. `limitValue: null` means unlimited.)
// -----------------------------------------------------------------------------
export const planLimits = pgTable(
  "plan_limits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    limitType: planLimitTypeEnum("limit_type").notNull(),
    limitValue: integer("limit_value"), // null = unlimited
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("uq_plan_limits_plan_type").on(table.planId, table.limitType)]
);

// -----------------------------------------------------------------------------
// 26. User Plan Assignments Table ("subscription" without live billing — a
//     history, not a singleton, same as announcements. Only one ACTIVE
//     assignment per user is enforced in the service layer: inserting a new
//     active row first flips any existing active row to SUPERSEDED. Effective
//     plan resolves lazily — WHERE userId=X AND status='active' AND
//     (endsAt IS NULL OR endsAt > now()), falling back to plans.isDefault.)
// -----------------------------------------------------------------------------
export const userPlanAssignments = pgTable(
  "user_plan_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "restrict" }),
    status: planAssignmentStatusEnum("status").notNull().default(PlanAssignmentStatus.ACTIVE),
    source: planAssignmentSourceEnum("source").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull().defaultNow(),
    endsAt: timestamp("ends_at", { withTimezone: true }), // null = doesn't expire
    assignedBy: uuid("assigned_by").references(() => users.id, { onDelete: "set null" }), // admin who granted it manually
    reason: text("reason"), // admin note, e.g. "30-day Pro goodwill grant"
    // Polymorphic, same style as adminAuditLogs.targetType/targetId — e.g.
    // sourceRefType "referral_conversion" | "coupon_redemption" | "transaction".
    sourceRefType: varchar("source_ref_type", { length: 50 }),
    sourceRefId: varchar("source_ref_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_user_plan_assignments_user_status").on(table.userId, table.status),
    index("idx_user_plan_assignments_ends_at").on(table.endsAt),
  ]
);

// -----------------------------------------------------------------------------
// 27. Transactions Table (billing events — shaped so a future Stripe
//     integration just writes rows here. `provider`/`providerRef` are null
//     today; the unique pair is inert while null and starts deduping webhook
//     replays the moment a real payment provider is wired in.)
// -----------------------------------------------------------------------------
export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    planId: uuid("plan_id").references(() => plans.id, { onDelete: "restrict" }),
    planAssignmentId: uuid("plan_assignment_id").references(() => userPlanAssignments.id, {
      onDelete: "set null",
    }),
    type: transactionTypeEnum("type").notNull(),
    status: transactionStatusEnum("status").notNull().default(TransactionStatus.PENDING),
    amountMinor: integer("amount_minor").notNull().default(0), // cents; 0 for admin_grant
    currency: varchar("currency", { length: 3 }).notNull().default("usd"),
    provider: varchar("provider", { length: 50 }), // null today; "stripe" once integrated
    providerRef: varchar("provider_ref", { length: 255 }), // future Stripe payment_intent/charge id
    // No FK back to coupon_redemptions here — that link lives on
    // coupon_redemptions.transactionId instead (it's a backward reference,
    // this would be a forward one to a table defined later in this file).
    // Find "which redemption led to this transaction" via
    // `coupon_redemptions WHERE transaction_id = X`.
    metadata: jsonb("metadata"),
    initiatedBy: uuid("initiated_by").references(() => users.id, { onDelete: "set null" }), // admin if manual, null if automated
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_transactions_user_occurred").on(table.userId, table.occurredAt),
    index("idx_transactions_status").on(table.status),
    uniqueIndex("uq_transactions_provider_ref").on(table.provider, table.providerRef),
  ]
);

// -----------------------------------------------------------------------------
// 28. Coupons Table (admin-created discount codes — including custom
//     creator/affiliate codes, via `label`/`createdBy`. Tracks the discount
//     funnel only, not commission payout.)
// -----------------------------------------------------------------------------
export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    label: varchar("label", { length: 150 }), // internal note, e.g. affiliate/creator name
    discountType: couponDiscountTypeEnum("discount_type").notNull(),
    discountValue: integer("discount_value").notNull(), // percent (0-100) or amountMinor, depending on discountType
    applicablePlanId: uuid("applicable_plan_id").references(() => plans.id, { onDelete: "restrict" }), // null = any plan
    maxRedemptions: integer("max_redemptions"), // null = unlimited
    maxRedemptionsPerUser: integer("max_redemptions_per_user").notNull().default(1),
    // Denormalized, atomically incremented alongside each redemption insert
    // inside one transaction (see coupons.service.ts) — avoids a COUNT(*)
    // over coupon_redemptions on every apply check.
    redemptionCount: integer("redemption_count").notNull().default(0),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_coupons_active").on(table.isActive)]
);

// -----------------------------------------------------------------------------
// 29. Coupon Redemptions Table (applied vs. converted funnel per redemption —
//     `status` distinguishes "code was entered" from "it led to a purchase."
//     Race-safety: redemption runs inside one transaction with
//     `SELECT ... FOR UPDATE` on the coupon row to lock it before re-checking
//     maxRedemptions/window/active and incrementing redemptionCount.)
// -----------------------------------------------------------------------------
export const couponRedemptions = pgTable(
  "coupon_redemptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    couponId: uuid("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "restrict" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    status: couponRedemptionStatusEnum("status").notNull().default(CouponRedemptionStatus.APPLIED),
    appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
    convertedAt: timestamp("converted_at", { withTimezone: true }),
    transactionId: uuid("transaction_id").references(() => transactions.id, { onDelete: "set null" }),
    discountAmountMinor: integer("discount_amount_minor"), // snapshot at redemption time, survives a later coupon reprice
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_coupon_redemptions_coupon_id").on(table.couponId),
    index("idx_coupon_redemptions_user_id").on(table.userId),
    index("idx_coupon_redemptions_status").on(table.status),
    index("idx_coupon_redemptions_transaction_id").on(table.transactionId),
  ]
);

// -----------------------------------------------------------------------------
// 30. Referral Codes Table (a user's own shareable code, or an admin-issued
//     creator/affiliate code. `clickCount` is a coarse, denormalized
//     top-of-funnel counter — no row per anonymous click, see
//     referral_conversions below for the attributed-signup funnel.)
// -----------------------------------------------------------------------------
export const referralCodes = pgTable(
  "referral_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    type: referralCodeTypeEnum("type").notNull().default(ReferralCodeType.USER),
    ownerUserId: uuid("owner_user_id").references(() => users.id, { onDelete: "set null" }), // who earns the reward
    rewardCreditsAmount: integer("reward_credits_amount").notNull(),
    clickCount: integer("click_count").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }), // null for self-serve user codes
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_referral_codes_type").on(table.type)]
);

// -----------------------------------------------------------------------------
// 31. Referral Conversions Table (one row per referred signup, attributed to
//     a code — first attribution wins, see the unique index. `stage` tracks
//     applied (signed up) vs. converted (first purchase); the referrer's
//     credit reward is granted when it advances to converted.)
// -----------------------------------------------------------------------------
export const referralConversions = pgTable(
  "referral_conversions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referralCodeId: uuid("referral_code_id")
      .notNull()
      .references(() => referralCodes.id, { onDelete: "restrict" }),
    referredUserId: uuid("referred_user_id").references(() => users.id, { onDelete: "set null" }),
    stage: referralConversionStageEnum("stage").notNull().default(ReferralConversionStage.APPLIED),
    appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(), // the referred user's signup time
    convertedAt: timestamp("converted_at", { withTimezone: true }),
    transactionId: uuid("transaction_id").references(() => transactions.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("uq_referral_conversions_referred_user").on(table.referredUserId),
    index("idx_referral_conversions_code_id").on(table.referralCodeId),
    index("idx_referral_conversions_stage").on(table.stage),
  ]
);

// -----------------------------------------------------------------------------
// 32. Credit Ledger Table (append-only reward-currency ledger — never
//     updated or deleted, always the reconciliation source of truth for
//     user_credit_balances below. userId uses "set null" rather than this
//     schema's usual cascade: losing rows on user deletion would corrupt
//     platform-wide "credits issued" reporting.)
// -----------------------------------------------------------------------------
export const creditLedger = pgTable(
  "credit_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    amount: integer("amount").notNull(), // signed — positive = credit, negative = debit
    reason: creditLedgerReasonEnum("reason").notNull(),
    // Polymorphic, same style as adminAuditLogs — e.g. referenceType
    // "referral_conversion" | "admin_adjustment".
    referenceType: varchar("reference_type", { length: 50 }),
    referenceId: varchar("reference_id", { length: 255 }),
    note: text("note"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }), // admin for manual adjustments, null if system-generated
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_credit_ledger_user_created").on(table.userId, table.createdAt),
    index("idx_credit_ledger_reference").on(table.referenceType, table.referenceId),
  ]
);

// -----------------------------------------------------------------------------
// 33. User Credit Balances Table (denormalized cache of credit_ledger's
//     running sum, same reasoning as coupons.redemptionCount — kept
//     atomically consistent by updating it inside the same transaction as
//     every ledger insert. Pure live cache, no standalone meaning once the
//     user is gone, so this one cascades unlike credit_ledger itself.)
// -----------------------------------------------------------------------------
export const userCreditBalances = pgTable("user_credit_balances", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  balance: integer("balance").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// -----------------------------------------------------------------------------
// 34. Relations
// -----------------------------------------------------------------------------
export const  relations = defineRelations({
  users: {
    authIdentities: { relation: "hasMany", foreignKey: "userId" },
    refreshTokens: { relation: "hasMany", foreignKey: "userId" },
    sessions: { relation: "hasMany", foreignKey: "userId" },
    devices: { relation: "hasMany", foreignKey: "userId" },
    userRoles: { relation: "hasMany", foreignKey: "userId" },
    aiUsageLogs: { relation: "hasMany", foreignKey: "userId" },
    collections: { relation: "hasMany", foreignKey: "userId" },
    planAssignments: { relation: "hasMany", foreignKey: "userId" },
    transactions: { relation: "hasMany", foreignKey: "userId" },
    couponRedemptions: { relation: "hasMany", foreignKey: "userId" },
    referralCodes: { relation: "hasMany", foreignKey: "ownerUserId" },
    creditLedgerEntries: { relation: "hasMany", foreignKey: "userId" },
  },
  collections: {
    user: { relation: "belongsTo", foreignKey: "userId" },
  },
  plans: {
    limits: { relation: "hasMany", foreignKey: "planId" },
    assignments: { relation: "hasMany", foreignKey: "planId" },
  },
  planLimits: {
    plan: { relation: "belongsTo", foreignKey: "planId" },
  },
  userPlanAssignments: {
    user: { relation: "belongsTo", foreignKey: "userId" },
    plan: { relation: "belongsTo", foreignKey: "planId" },
    assignedByUser: { relation: "belongsTo", foreignKey: "assignedBy" },
  },
  transactions: {
    user: { relation: "belongsTo", foreignKey: "userId" },
    plan: { relation: "belongsTo", foreignKey: "planId" },
    planAssignment: { relation: "belongsTo", foreignKey: "planAssignmentId" },
    initiatedByUser: { relation: "belongsTo", foreignKey: "initiatedBy" },
  },
  coupons: {
    redemptions: { relation: "hasMany", foreignKey: "couponId" },
    applicablePlan: { relation: "belongsTo", foreignKey: "applicablePlanId" },
    createdByUser: { relation: "belongsTo", foreignKey: "createdBy" },
  },
  couponRedemptions: {
    coupon: { relation: "belongsTo", foreignKey: "couponId" },
    user: { relation: "belongsTo", foreignKey: "userId" },
    transaction: { relation: "belongsTo", foreignKey: "transactionId" },
  },
  referralCodes: {
    ownerUser: { relation: "belongsTo", foreignKey: "ownerUserId" },
    conversions: { relation: "hasMany", foreignKey: "referralCodeId" },
  },
  referralConversions: {
    referralCode: { relation: "belongsTo", foreignKey: "referralCodeId" },
    referredUser: { relation: "belongsTo", foreignKey: "referredUserId" },
    transaction: { relation: "belongsTo", foreignKey: "transactionId" },
  },
  creditLedger: {
    user: { relation: "belongsTo", foreignKey: "userId" },
    createdByUser: { relation: "belongsTo", foreignKey: "createdBy" },
  },
  userCreditBalances: {
    user: { relation: "belongsTo", foreignKey: "userId" },
  },
  featureFlags: {
    updatedByUser: { relation: "belongsTo", foreignKey: "updatedBy" },
  },
  announcements: {
    createdByUser: { relation: "belongsTo", foreignKey: "createdBy" },
  },
  aiUsageLogs: {
    user: { relation: "belongsTo", foreignKey: "userId" },
    thread: { relation: "belongsTo", foreignKey: "threadId" },
    memory: { relation: "belongsTo", foreignKey: "memoryId" },
  },
  adminAuditLogs: {
    adminUser: { relation: "belongsTo", foreignKey: "adminUserId" },
  },
  roles: {
    userRoles: { relation: "hasMany", foreignKey: "roleId" },
    rolePermissions: { relation: "hasMany", foreignKey: "roleId" },
  },
  permissions: {
    rolePermissions: { relation: "hasMany", foreignKey: "permissionId" },
  },
  authIdentities: {
    user: { relation: "belongsTo", foreignKey: "userId" },
  },
  refreshTokens:
  {
    user: { relation: "belongsTo", foreignKey: "userId" },
    sessions: { relation: "hasMany", foreignKey: "refreshTokenId" },
  },
  sessions: {
    user: { relation: "belongsTo", foreignKey: "userId" },
    refreshToken: { relation: "belongsTo", foreignKey: "refreshTokenId" },
  },
  devices: {
    user: { relation: "belongsTo", foreignKey: "userId" },
  },
  userRoles: {
    user: { relation: "belongsTo", foreignKey: "userId" },
    role: { relation: "belongsTo", foreignKey: "roleId" },
  },
  rolePermissions: {
    role: { relation: "belongsTo", foreignKey: "roleId" },
    permission: { relation: "belongsTo", foreignKey: "permissionId" },
  },
});
