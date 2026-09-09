import { and, eq, ne } from "drizzle-orm";
import { db, type DbOrTx } from "../../../db";
import { plans, planLimits } from "../../../db/schema";
import { PlanLimitType } from "../../../db/enums";
import { AppError } from "../../../shared/errors/app-error";
import { logAdminAction } from "../../../shared/utils/audit-log";
import { getPlanLimits } from "../../plans/plans.service";
import type { CreatePlanInput, UpdatePlanInput } from "./plans.schema";

interface DefaultPlanSeed {
  key: string;
  name: string;
  description: string;
  priceMinor: number;
  isDefault: boolean;
  sortOrder: number;
  limits: { limitType: PlanLimitType; limitValue: number | null }[];
}

// Placeholders, same "not load-bearing" reasoning as every seed value in
// this codebase (see seedDefaultFlags) — the entire point of this table is
// that an admin edits these via admin/plans without a deploy. Prices are in
// paise (this product prices in INR — see the marketing pricing table).
const DEFAULT_PLANS: DefaultPlanSeed[] = [
  {
    key: "free",
    name: "Free",
    description: "Perfect for building your personal memory vault.",
    priceMinor: 0,
    isDefault: true,
    sortOrder: 0,
    limits: [
      { limitType: PlanLimitType.MEMORY_COUNT, limitValue: 100 },
      { limitType: PlanLimitType.AI_MONTHLY_QUERIES, limitValue: 20 },
      { limitType: PlanLimitType.STORAGE_MB, limitValue: 250 },
      { limitType: PlanLimitType.COLLECTION_COUNT, limitValue: 5 },
    ],
  },
  {
    key: "plus",
    name: "Plus",
    description: "For people who save more than they can keep track of.",
    priceMinor: 49900,
    isDefault: false,
    sortOrder: 1,
    limits: [
      { limitType: PlanLimitType.MEMORY_COUNT, limitValue: 2000 },
      { limitType: PlanLimitType.AI_MONTHLY_QUERIES, limitValue: 300 },
      { limitType: PlanLimitType.STORAGE_MB, limitValue: 5000 },
      { limitType: PlanLimitType.COLLECTION_COUNT, limitValue: 50 },
    ],
  },
  {
    key: "pro",
    name: "Pro",
    description: "Ideal for power users who want a true second brain.",
    priceMinor: 199900,
    isDefault: false,
    sortOrder: 2,
    limits: [
      { limitType: PlanLimitType.MEMORY_COUNT, limitValue: null },
      { limitType: PlanLimitType.AI_MONTHLY_QUERIES, limitValue: 2000 },
      { limitType: PlanLimitType.STORAGE_MB, limitValue: 50000 },
      { limitType: PlanLimitType.COLLECTION_COUNT, limitValue: null },
    ],
  },
];

/**
 * Idempotent (onConflictDoNothing on both the plan and each limit), same
 * pattern as seedDefaultFlags — run via `pnpm db:seed` (src/db/seed.ts),
 * not automatically on boot. Never overwrites a value an admin has since
 * edited, unlike upsertLimits below (which is deliberately an overwrite,
 * for admin edits).
 */
export async function seedDefaultPlans(): Promise<void> {
  for (const seed of DEFAULT_PLANS) {
    await db
      .insert(plans)
      .values({
        key: seed.key,
        name: seed.name,
        description: seed.description,
        priceMinor: seed.priceMinor,
        isDefault: seed.isDefault,
        sortOrder: seed.sortOrder,
      })
      .onConflictDoNothing({ target: plans.key });

    const [plan] = await db.select().from(plans).where(eq(plans.key, seed.key)).limit(1);
    if (!plan) continue;

    for (const limit of seed.limits) {
      await db
        .insert(planLimits)
        .values({ planId: plan.id, limitType: limit.limitType, limitValue: limit.limitValue })
        .onConflictDoNothing({ target: [planLimits.planId, planLimits.limitType] });
    }
  }
}

export async function listAllPlans() {
  const rows = await db.select().from(plans).orderBy(plans.sortOrder);
  return Promise.all(rows.map(async (plan) => ({ ...plan, limits: await getPlanLimits(plan.id) })));
}

async function upsertLimits(tx: DbOrTx, planId: string, limits: NonNullable<CreatePlanInput["limits"]>) {
  for (const limit of limits) {
    await tx
      .insert(planLimits)
      .values({ planId, limitType: limit.limitType, limitValue: limit.limitValue })
      .onConflictDoUpdate({
        target: [planLimits.planId, planLimits.limitType],
        set: { limitValue: limit.limitValue },
      });
  }
}

export async function createPlan(input: CreatePlanInput, adminUserId: string, ipAddress?: string) {
  return db.transaction(async (tx) => {
    // Only one plan may be the signup default at a time — same
    // flip-others-first pattern as announcements.isActive.
    if (input.isDefault) {
      await tx.update(plans).set({ isDefault: false }).where(eq(plans.isDefault, true));
    }

    const [plan] = await tx
      .insert(plans)
      .values({
        key: input.key,
        name: input.name,
        description: input.description ?? null,
        priceMinor: input.priceMinor,
        currency: input.currency,
        billingInterval: input.billingInterval,
        isActive: input.isActive,
        isDefault: input.isDefault,
        sortOrder: input.sortOrder,
      })
      .returning();

    if (input.limits?.length) {
      await upsertLimits(tx, plan.id, input.limits);
    }

    await logAdminAction({
      adminUserId,
      action: "plan.created",
      targetType: "plan",
      targetId: plan.id,
      afterValue: { ...plan, limits: input.limits ?? [] },
      ipAddress,
    });

    return plan;
  });
}

export async function updatePlan(planId: string, input: UpdatePlanInput, adminUserId: string, ipAddress?: string) {
  return db.transaction(async (tx) => {
    const [before] = await tx.select().from(plans).where(eq(plans.id, planId)).limit(1);
    if (!before) {
      throw new AppError("Plan not found", 404, "NOT_FOUND");
    }

    if (input.isDefault) {
      await tx.update(plans).set({ isDefault: false }).where(and(eq(plans.isDefault, true), ne(plans.id, planId)));
    }

    const [after] = await tx
      .update(plans)
      .set({
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.priceMinor !== undefined ? { priceMinor: input.priceMinor } : {}),
        ...(input.currency !== undefined ? { currency: input.currency } : {}),
        ...(input.billingInterval !== undefined ? { billingInterval: input.billingInterval } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        ...(input.isDefault !== undefined ? { isDefault: input.isDefault } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      })
      .where(eq(plans.id, planId))
      .returning();

    if (input.limits?.length) {
      await upsertLimits(tx, planId, input.limits);
    }

    const limitsAfter = await getPlanLimits(planId, tx);

    await logAdminAction({
      adminUserId,
      action: "plan.updated",
      targetType: "plan",
      targetId: planId,
      beforeValue: before,
      afterValue: { ...after, limits: limitsAfter },
      ipAddress,
    });

    return { ...after, limits: limitsAfter };
  });
}
