import {
  pgEnum,
} from "drizzle-orm/pg-core";
import {
  AccentColor,
  AnnouncementDisplayMode,
  AnnouncementType,
  CalendarProvider,
  CollectionSource,
  CouponDiscountType,
  CouponRedemptionStatus,
  CreditLedgerReason,
  EmailCategory,
  EmailStatus,
  EmailTemplateKey,
  ImportItemStatus,
  ImportSourceType,
  MemoryStatus,
  MemoryType,
  NotificationType,
  OrganizeMode,
  PlanAssignmentSource,
  PlanAssignmentStatus,
  PlanBillingInterval,
  PlanLimitType,
  Provider,
  ReferralCodeType,
  ReferralConversionStage,
  SettingsTheme,
  ShareAccessRequestStatus,
  ShareGrantSource,
  ShareGrantStatus,
  ShareLinkAccess,
  ShareResourceType,
  TransactionStatus,
  TransactionType,
  UserStatus,
} from "../enums";

// ============================================================
// ALL PGSENUM DEFINITIONS
// ============================================================

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
  PlanLimitType.AI_MONTHLY_VISION_QUERIES,
  PlanLimitType.STORAGE_MB,
  PlanLimitType.COLLECTION_COUNT,
  PlanLimitType.PUBLIC_SHARE_COUNT,
]);

export const planBillingIntervalEnum = pgEnum("plan_billing_interval", [
  PlanBillingInterval.MONTHLY,
  PlanBillingInterval.SEMI_ANNUAL,
  PlanBillingInterval.YEARLY,
  PlanBillingInterval.ONE_TIME,
]);

export const shareResourceTypeEnum = pgEnum("share_resource_type", [
  ShareResourceType.COLLECTION,
  ShareResourceType.MEMORY,
]);

export const shareLinkAccessEnum = pgEnum("share_link_access", [
  ShareLinkAccess.DISABLED,
  ShareLinkAccess.PUBLIC,
  ShareLinkAccess.REQUEST,
  ShareLinkAccess.PASSWORD,
]);

export const shareGrantStatusEnum = pgEnum("share_grant_status", [
  ShareGrantStatus.PENDING,
  ShareGrantStatus.ACTIVE,
  ShareGrantStatus.REVOKED,
]);

export const shareGrantSourceEnum = pgEnum("share_grant_source", [
  ShareGrantSource.DIRECT_INVITE,
  ShareGrantSource.ACCESS_REQUEST,
]);

export const shareAccessRequestStatusEnum = pgEnum("share_access_request_status", [
  ShareAccessRequestStatus.PENDING,
  ShareAccessRequestStatus.APPROVED,
  ShareAccessRequestStatus.DENIED,
  ShareAccessRequestStatus.CANCELLED,
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  NotificationType.SHARE_INVITE_RECEIVED,
  NotificationType.SHARE_ACCESS_REQUESTED,
  NotificationType.SHARE_ACCESS_APPROVED,
  NotificationType.SHARE_ACCESS_DENIED,
  NotificationType.SHARE_REVOKED,
  NotificationType.EVENT_DETECTED,
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

export const emailCategoryEnum = pgEnum("email_category", [
  EmailCategory.TRANSACTIONAL,
  EmailCategory.MARKETING,
  EmailCategory.ALERT,
  EmailCategory.ANNOUNCEMENT,
  EmailCategory.CUSTOM,
]);

export const emailTemplateKeyEnum = pgEnum("email_template_key", [
  EmailTemplateKey.WELCOME,
  EmailTemplateKey.USER_STATUS_CHANGED,
  EmailTemplateKey.SHARE_INVITE,
  EmailTemplateKey.SHARE_ACCESS_REQUESTED,
  EmailTemplateKey.SHARE_ACCESS_APPROVED,
  EmailTemplateKey.SHARE_ACCESS_DENIED,
  EmailTemplateKey.ADMIN_CUSTOM,
  EmailTemplateKey.EVENT_DETECTED,
]);

export const emailStatusEnum = pgEnum("email_status", [
  EmailStatus.QUEUED,
  EmailStatus.SENDING,
  EmailStatus.SENT,
  EmailStatus.FAILED,
]);

export const importSourceTypeEnum = pgEnum("import_source_type", [
  ImportSourceType.BOOKMARKS_HTML,
  ImportSourceType.URL_LIST,
]);

export const importItemStatusEnum = pgEnum("import_item_status", [
  ImportItemStatus.CREATED,
  ImportItemStatus.SKIPPED_DUPLICATE,
  ImportItemStatus.FAILED,
]);

export const calendarProviderEnum = pgEnum("calendar_provider", [
  CalendarProvider.GOOGLE,
  CalendarProvider.MICROSOFT,
]);

export const ALL_ENUMS = {
  userStatusEnum,
  providerEnum,
  settingsThemeEnum,
  accentColorEnum,
  organizeModeEnum,
  memoryTypeEnum,
  memoryStatusEnum,
  announcementTypeEnum,
  announcementDisplayModeEnum,
  collectionSourceEnum,
  planLimitTypeEnum,
  planBillingIntervalEnum,
  shareResourceTypeEnum,
  shareLinkAccessEnum,
  shareGrantStatusEnum,
  shareGrantSourceEnum,
  shareAccessRequestStatusEnum,
  notificationTypeEnum,
  planAssignmentStatusEnum,
  planAssignmentSourceEnum,
  transactionTypeEnum,
  transactionStatusEnum,
  couponDiscountTypeEnum,
  couponRedemptionStatusEnum,
  referralCodeTypeEnum,
  referralConversionStageEnum,
  creditLedgerReasonEnum,
  emailCategoryEnum,
  emailTemplateKeyEnum,
  emailStatusEnum,
  importItemStatusEnum,
  importSourceTypeEnum,
  calendarProviderEnum,
};
