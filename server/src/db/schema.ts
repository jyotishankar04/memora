import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { defineRelations } from "drizzle-orm";
import { OrganizeMode, Provider, UserStatus } from "./enums";

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

export const organizeModeEnum = pgEnum("organize_mode", [
  OrganizeMode.AUTO,
  OrganizeMode.MANUAL,
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
// 11. Relations
// -----------------------------------------------------------------------------
export const  relations = defineRelations({
  users: {
    authIdentities: { relation: "hasMany", foreignKey: "userId" },
    refreshTokens: { relation: "hasMany", foreignKey: "userId" },
    sessions: { relation: "hasMany", foreignKey: "userId" },
    devices: { relation: "hasMany", foreignKey: "userId" },
    userRoles: { relation: "hasMany", foreignKey: "userId" },
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
