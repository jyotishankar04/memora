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
import { emailCategoryEnum, emailTemplateKeyEnum, emailStatusEnum } from "./enums.schema";
import { EmailStatus } from "../enums";
import { users } from "./auth.schema";

// ============================================================
// EMAIL MANAGEMENT
// ============================================================

export const emailCampaigns = pgTable(
  "email_campaigns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    category: emailCategoryEnum("category").notNull(),
    templateKey: emailTemplateKeyEnum("template_key").notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    recipientCount: integer("recipient_count").notNull().default(0),
    sentCount: integer("sent_count").notNull().default(0),
    failedCount: integer("failed_count").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_email_campaigns_category").on(table.category),
    index("idx_email_campaigns_template_key").on(table.templateKey),
  ]
);

export const emailMessages = pgTable(
  "email_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => emailCampaigns.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    htmlContent: text("html_content"),
    plainTextContent: text("plain_text_content"),
    status: emailStatusEnum("status").notNull().default(EmailStatus.QUEUED),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    bouncedAt: timestamp("bounced_at", { withTimezone: true }),
    failureReason: text("failure_reason"),
    openedAt: timestamp("opened_at", { withTimezone: true }),
    clickedAt: timestamp("clicked_at", { withTimezone: true }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_email_messages_campaign_id").on(table.campaignId),
    index("idx_email_messages_user_id").on(table.userId),
    index("idx_email_messages_status").on(table.status),
    index("idx_email_messages_recipient_email").on(table.recipientEmail),
  ]
);
