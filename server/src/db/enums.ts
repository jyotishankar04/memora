export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}

export enum Provider {
  GOOGLE = "google",
  GITHUB = "github",
}

export enum OrganizeMode {
  AUTO = "auto",
  MANUAL = "manual",
}

export enum SettingsTheme {
  SYSTEM = "system",
  LIGHT = "light",
  DARK = "dark",
}

export enum AccentColor {
  BLUE = "blue",
  PURPLE = "purple",
  GREEN = "green",
  ORANGE = "orange",
}

export enum MemoryType {
  WEB = "web",
  VIDEO = "video",
  NOTE = "note",
  IMAGE = "image",
  DOCUMENT = "document",
  VOICE = "voice",
}

// A memory always exists once POST /memories returns — this only ever
// describes how much enrichment it received, never whether it exists.
export enum MemoryStatus {
  PROCESSING = "processing",
  READY = "ready",
  PARTIAL = "partial",
  FAILED = "failed",
}

export enum AnnouncementType {
  COUNTDOWN = "countdown",
  ANNOUNCEMENT = "announcement",
  UPDATE = "update",
}

export enum AnnouncementDisplayMode {
  BANNER = "banner",
  FULL_PAGE = "full_page",
}

// A collection either came from the user explicitly creating it, or from the
// system (onboarding defaults, AI-suggested groupings). Only "user" ever
// counts against the collection_count plan limit; conversion is one-way
// (system -> user only — see collection.service.ts's convertToUser).
export enum CollectionSource {
  USER = "user",
  SYSTEM = "system",
}

export enum PlanLimitType {
  MEMORY_COUNT = "memory_count",
  AI_MONTHLY_QUERIES = "ai_monthly_queries",
  AI_MONTHLY_VISION_QUERIES = "ai_monthly_vision_queries",
  STORAGE_MB = "storage_mb",
  COLLECTION_COUNT = "collection_count",
}

export enum PlanBillingInterval {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  ONE_TIME = "one_time",
}

// A user has at most one ACTIVE assignment at a time — inserting a new
// active one flips the previous one to SUPERSEDED (see plans.service.ts),
// mirroring how announcements.isActive is kept singular.
export enum PlanAssignmentStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  SUPERSEDED = "superseded",
}

export enum PlanAssignmentSource {
  ADMIN_MANUAL = "admin_manual",
  SIGNUP_DEFAULT = "signup_default",
  REFERRAL_REWARD = "referral_reward",
  COUPON_REDEMPTION = "coupon_redemption",
  PAYMENT = "payment",
}

export enum TransactionType {
  SUBSCRIPTION_PURCHASE = "subscription_purchase",
  SUBSCRIPTION_RENEWAL = "subscription_renewal",
  UPGRADE = "upgrade",
  DOWNGRADE = "downgrade",
  REFUND = "refund",
  ADMIN_GRANT = "admin_grant",
}

export enum TransactionStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

export enum CouponDiscountType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount",
}

// APPLIED = the code was entered/redeemed; CONVERTED = it actually led to a
// paid transaction. Kept distinct so the admin funnel view can show
// applied-vs-purchased, not just a single redemption count.
export enum CouponRedemptionStatus {
  APPLIED = "applied",
  CONVERTED = "converted",
  EXPIRED = "expired",
  REVOKED = "revoked",
}

// USER = a normal user's own shareable code; ADMIN_ISSUED = a custom
// creator/affiliate code an admin hands out.
export enum ReferralCodeType {
  USER = "user",
  ADMIN_ISSUED = "admin_issued",
}

// APPLIED = the referred person signed up attributed to the code; CONVERTED
// = they went on to make a purchase (referrer reward fires here).
export enum ReferralConversionStage {
  APPLIED = "applied",
  CONVERTED = "converted",
}

export enum CreditLedgerReason {
  REFERRAL_REWARD = "referral_reward",
  ADMIN_ADJUSTMENT = "admin_adjustment",
  PROMOTION = "promotion",
  EXPIRATION = "expiration",
}