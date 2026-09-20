import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  planBillingIntervalEnum,
  planLimitTypeEnum,
  planAssignmentStatusEnum,
  planAssignmentSourceEnum,
  transactionTypeEnum,
  transactionStatusEnum,
  couponDiscountTypeEnum,
  couponRedemptionStatusEnum,
  referralCodeTypeEnum,
  referralConversionStageEnum,
  creditLedgerReasonEnum,
} from "./enums.schema";
import {
  PlanAssignmentStatus,
  CouponRedemptionStatus,
  ReferralCodeType,
  ReferralConversionStage,
  EmailStatus,
} from "../enums";
import { users } from "./auth.schema";

// ============================================================
// BILLING & SUBSCRIPTIONS
// ============================================================

export const plans = pgTable(
  "plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    priceMinor: integer("price_minor").notNull().default(0),
    billingInterval: planBillingIntervalEnum("billing_interval").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    stripePriceId: varchar("stripe_price_id", { length: 255 }),
    polarProductId: varchar("polar_product_id", { length: 255 }),
    features: jsonb("features").$type<Record<string, boolean>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_plans_key").on(table.key),
    index("idx_plans_billing_interval").on(table.billingInterval),
  ]
);

export const planLimits = pgTable(
  "plan_limits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "cascade" }),
    limitType: planLimitTypeEnum("limit_type").notNull(),
    limitValue: integer("limit_value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_plan_limits_plan_id").on(table.planId),
    uniqueIndex("uq_plan_limits_plan_type").on(table.planId, table.limitType),
  ]
);

export const userPlanAssignments = pgTable(
  "user_plan_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "restrict" }),
    status: planAssignmentStatusEnum("status").notNull().default(PlanAssignmentStatus.ACTIVE),
    source: planAssignmentSourceEnum("source").notNull(),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
    polarSubscriptionId: varchar("polar_subscription_id", { length: 255 }),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_user_plan_assignments_user_id").on(table.userId),
    index("idx_user_plan_assignments_plan_id").on(table.planId),
    index("idx_user_plan_assignments_status").on(table.status),
  ]
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: transactionTypeEnum("type").notNull(),
    status: transactionStatusEnum("status").notNull(),
    amountMinor: integer("amount_minor").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("USD"),
    stripeTransactionId: varchar("stripe_transaction_id", { length: 255 }),
    polarTransactionId: varchar("polar_transaction_id", { length: 255 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_transactions_user_id").on(table.userId),
    index("idx_transactions_type").on(table.type),
    index("idx_transactions_status").on(table.status),
  ]
);

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 100 }).notNull().unique(),
    description: text("description"),
    discountType: couponDiscountTypeEnum("discount_type").notNull(),
    discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
    maxRedemptions: integer("max_redemptions"),
    currentRedemptions: integer("current_redemptions").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_coupons_code").on(table.code)]
);

export const couponRedemptions = pgTable(
  "coupon_redemptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    couponId: uuid("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: couponRedemptionStatusEnum("status").notNull().default(CouponRedemptionStatus.APPLIED),
    redeemedAt: timestamp("redeemed_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_coupon_redemptions_coupon_id").on(table.couponId),
    index("idx_coupon_redemptions_user_id").on(table.userId),
    uniqueIndex("uq_coupon_redemptions_user_coupon").on(table.userId, table.couponId),
  ]
);

export const referralCodes = pgTable(
  "referral_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 100 }).notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: referralCodeTypeEnum("type").notNull().default(ReferralCodeType.USER),
    maxRedemptions: integer("max_redemptions"),
    currentRedemptions: integer("current_redemptions").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_referral_codes_user_id").on(table.userId),
    index("idx_referral_codes_code").on(table.code),
  ]
);

export const referralConversions = pgTable(
  "referral_conversions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referralCodeId: uuid("referral_code_id")
      .notNull()
      .references(() => referralCodes.id, { onDelete: "cascade" }),
    convertedUserId: uuid("converted_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stage: referralConversionStageEnum("stage").notNull().default(ReferralConversionStage.APPLIED),
    referrerRewardMinor: integer("referrer_reward_minor").notNull().default(0),
    convertedUserRewardMinor: integer("converted_user_reward_minor").notNull().default(0),
    convertedAt: timestamp("converted_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_referral_conversions_referral_code_id").on(table.referralCodeId),
    index("idx_referral_conversions_converted_user_id").on(table.convertedUserId),
  ]
);

export const creditLedger = pgTable(
  "credit_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reason: creditLedgerReasonEnum("reason").notNull(),
    amountMinor: integer("amount_minor").notNull(),
    balanceBefore: integer("balance_before").notNull(),
    balanceAfter: integer("balance_after").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_credit_ledger_user_id").on(table.userId),
    index("idx_credit_ledger_reason").on(table.reason),
  ]
);

export const userCreditBalances = pgTable(
  "user_credit_balances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    balanceMinor: integer("balance_minor").notNull().default(0),
    lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_user_credit_balances_user_id").on(table.userId)]
);
