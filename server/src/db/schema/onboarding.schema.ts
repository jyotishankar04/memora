import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { settingsThemeEnum, accentColorEnum, organizeModeEnum } from "./enums.schema";
import { SettingsTheme, AccentColor, OrganizeMode } from "../enums";
import { users } from "./auth.schema";

// ============================================================
// USER ONBOARDING & SETTINGS
// ============================================================

export const userOnboarding = pgTable(
  "user_onboarding",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    completedSteps: text("completed_steps").array().notNull().default([]),
    hasSeenTour: boolean("has_seen_tour").notNull().default(false),
    hasAddedFirstMemory: boolean("has_added_first_memory").notNull().default(false),
    hasConnectedCalendar: boolean("has_connected_calendar").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_user_onboarding_user_id").on(table.userId)]
);

export const userSettings = pgTable(
  "user_settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    theme: settingsThemeEnum("theme").notNull().default(SettingsTheme.SYSTEM),
    accentColor: accentColorEnum("accent_color").notNull().default(AccentColor.BLUE),
    organizeMode: organizeModeEnum("organize_mode").notNull().default(OrganizeMode.MANUAL),
    enableNotifications: boolean("enable_notifications").notNull().default(true),
    enableEmailDigest: boolean("enable_email_digest").notNull().default(false),
    emailDigestFrequency: varchar("email_digest_frequency", { length: 50 }).default("weekly"),
    enableAutoTag: boolean("enable_auto_tag").notNull().default(true),
    enableAutoSummarize: boolean("enable_auto_summarize").notNull().default(true),
    preferences: jsonb("preferences").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("idx_user_settings_user_id").on(table.userId)]
);
