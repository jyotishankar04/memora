import { eq } from "drizzle-orm";
import { db } from "../../db";
import { featureFlags } from "../../db/schema";
import type { UpdateFlagInput } from "./feature-flags.schema";

/**
 * Reserved, dot-namespaced keys the app itself consumes (auth gating, the
 * maintenance guard). Anything else is a free-form flag an admin can add —
 * this table has no fixed column set, so new flags never need a migration.
 */
export const RESERVED_FLAG_KEYS = {
  AUTH_GOOGLE_ENABLED: "auth.google.enabled",
  AUTH_GITHUB_ENABLED: "auth.github.enabled",
  SIGNUPS_ENABLED: "signups.enabled",
  MAINTENANCE_ENABLED: "maintenance.enabled",
  MAINTENANCE_MESSAGE: "maintenance.message",
} as const;

const DEFAULT_FLAGS: { key: string; value: unknown; description: string; category: string }[] = [
  { key: RESERVED_FLAG_KEYS.AUTH_GOOGLE_ENABLED, value: true, description: "Allow signing in with Google.", category: "auth" },
  { key: RESERVED_FLAG_KEYS.AUTH_GITHUB_ENABLED, value: true, description: "Allow signing in with GitHub.", category: "auth" },
  { key: RESERVED_FLAG_KEYS.SIGNUPS_ENABLED, value: true, description: "Allow new account signups.", category: "auth" },
  { key: RESERVED_FLAG_KEYS.MAINTENANCE_ENABLED, value: false, description: "Block non-admin traffic app-wide.", category: "system" },
  {
    key: RESERVED_FLAG_KEYS.MAINTENANCE_MESSAGE,
    value: "We're currently performing maintenance. Please check back soon.",
    description: "Message shown while maintenance mode is on.",
    category: "system",
  },
];

/** Idempotent — inserts any reserved flag that doesn't exist yet, leaves existing rows untouched. */
export async function seedDefaultFlags(): Promise<void> {
  for (const flag of DEFAULT_FLAGS) {
    await db.insert(featureFlags).values(flag).onConflictDoNothing({ target: featureFlags.key });
  }
}

export async function listFlags() {
  return db.select().from(featureFlags).orderBy(featureFlags.category, featureFlags.key);
}

async function getFlagValue<T>(key: string, fallback: T): Promise<T> {
  const [row] = await db.select({ value: featureFlags.value }).from(featureFlags).where(eq(featureFlags.key, key)).limit(1);
  return row ? (row.value as T) : fallback;
}

export async function updateFlag(key: string, patch: UpdateFlagInput, adminUserId: string) {
  const [before] = await db.select().from(featureFlags).where(eq(featureFlags.key, key)).limit(1);

  const [after] = await db
    .insert(featureFlags)
    .values({
      key,
      value: patch.value,
      description: patch.description,
      category: patch.category,
      updatedBy: adminUserId,
    })
    .onConflictDoUpdate({
      target: featureFlags.key,
      set: {
        value: patch.value,
        ...(patch.description !== undefined ? { description: patch.description } : {}),
        ...(patch.category !== undefined ? { category: patch.category } : {}),
        updatedBy: adminUserId,
        updatedAt: new Date(),
      },
    })
    .returning();

  return { before, after };
}

// --- Typed getters — the only way other modules should read a flag's value ---

export async function isProviderEnabled(provider: "google" | "github"): Promise<boolean> {
  const key = provider === "google" ? RESERVED_FLAG_KEYS.AUTH_GOOGLE_ENABLED : RESERVED_FLAG_KEYS.AUTH_GITHUB_ENABLED;
  return getFlagValue<boolean>(key, true);
}

export async function isSignupsEnabled(): Promise<boolean> {
  return getFlagValue<boolean>(RESERVED_FLAG_KEYS.SIGNUPS_ENABLED, true);
}

export async function isMaintenanceMode(): Promise<boolean> {
  return getFlagValue<boolean>(RESERVED_FLAG_KEYS.MAINTENANCE_ENABLED, false);
}

export async function getMaintenanceMessage(): Promise<string> {
  return getFlagValue<string>(RESERVED_FLAG_KEYS.MAINTENANCE_MESSAGE, "We're currently performing maintenance. Please check back soon.");
}
