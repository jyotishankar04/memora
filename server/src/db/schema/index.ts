// ============================================================
// SCHEMA INDEX - Re-exports all tables and enums for backward compatibility
// ============================================================
// All existing imports continue to work unchanged:
//   import { users, memories, plans } from "../../db/schema"
//
// This file re-exports everything from modular schema files,
// maintaining the original schema.ts interface while organizing
// code into logical, maintainable modules.
// ============================================================

// Enums (used by all modules)
export * from "./enums.schema";

// Authentication & Sessions
export {
  users,
  authIdentities,
  calendarConnections,
  calendarEventLinks,
  refreshTokens,
  sessions,
  devices,
} from "./auth.schema";

// RBAC - Role-Based Access Control
export {
  roles,
  permissions,
  rolePermissions,
  userRoles,
} from "./rbac.schema";

// User Settings & Onboarding
export {
  userOnboarding,
  userSettings,
} from "./onboarding.schema";

// Memories, Collections & Tags
export {
  collections,
  memories,
  collectionMemories,
  tags,
  memoryTags,
  attachments,
  memoryChunks,
  threads,
} from "./memories.schema";

// Sharing & Collaboration
export {
  shares,
  shareGrants,
  shareAccessRequests,
  shareViews,
  notifications,
} from "./sharing.schema";

// Billing & Subscriptions
export {
  plans,
  planLimits,
  userPlanAssignments,
  transactions,
  coupons,
  couponRedemptions,
  referralCodes,
  referralConversions,
  creditLedger,
  userCreditBalances,
} from "./billing.schema";

// System Features & Admin
export {
  featureFlags,
  announcements,
  adminAuditLogs,
  aiUsageLogs,
} from "./system.schema";

// Email Management
export {
  emailCampaigns,
  emailMessages,
} from "./email.schema";

// Import Batches
export {
  importBatches,
  importItems,
} from "./imports.schema";

// Relations (Drizzle ORM relationship definitions)
export { relations } from "./relations";
