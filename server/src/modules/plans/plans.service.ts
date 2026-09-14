import { and, desc, eq, gte, isNull, or, sql, sum } from "drizzle-orm";
import { db, type DbOrTx } from "../../db";
import { attachments, collections, memories, aiUsageLogs, plans, planLimits, shares, userPlanAssignments } from "../../db/schema";
import { CollectionSource, PlanAssignmentStatus, PlanLimitType, ShareLinkAccess } from "../../db/enums";
import { AppError } from "../../shared/errors/app-error";

export type PlanLimits = Partial<Record<PlanLimitType, number | null>>;

export async function listPublicPlans(dbClient: DbOrTx = db) {
  const rows = await dbClient
    .select()
    .from(plans)
    .where(eq(plans.isActive, true))
    .orderBy(plans.sortOrder);

  return Promise.all(
    rows.map(async (plan) => ({ ...plan, limits: await getPlanLimits(plan.id, dbClient) })),
  );
}

export async function getPlanLimits(planId: string, dbClient: DbOrTx = db): Promise<PlanLimits> {
  const rows = await dbClient.select().from(planLimits).where(eq(planLimits.planId, planId));
  const limits: PlanLimits = {};
  for (const row of rows) {
    limits[row.limitType] = row.limitValue;
  }
  return limits;
}

/**
 * The plan currently in effect for a user: their active, not-yet-expired
 * assignment if one exists, else the plan marked isDefault. Throws if
 * neither exists — a misconfigured deployment (no default plan seeded)
 * should fail loudly here rather than silently letting every limit check
 * pass as unlimited.
 */
export async function resolveEffectivePlan(userId: string, dbClient: DbOrTx = db) {
  const [assignment] = await dbClient
    .select()
    .from(userPlanAssignments)
    .where(
      and(
        eq(userPlanAssignments.userId, userId),
        eq(userPlanAssignments.status, PlanAssignmentStatus.ACTIVE),
        or(isNull(userPlanAssignments.endsAt), gte(userPlanAssignments.endsAt, new Date())),
      ),
    )
    .orderBy(desc(userPlanAssignments.startsAt))
    .limit(1);

  if (assignment) {
    const [plan] = await dbClient.select().from(plans).where(eq(plans.id, assignment.planId)).limit(1);
    if (plan) return { plan, assignment };
  }

  const [defaultPlan] = await dbClient.select().from(plans).where(eq(plans.isDefault, true)).limit(1);
  if (!defaultPlan) {
    throw new AppError("No default plan configured", 500, "NO_DEFAULT_PLAN");
  }
  return { plan: defaultPlan, assignment: null };
}

function startOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Current usage for one limit type. Deliberately one query per type rather
 * than a single mega-query — each limit lives on a different table with a
 * different "what counts" rule (e.g. collections only count source='user',
 * AI usage only counts user-initiated Ask queries, not ingestion/embedding
 * background calls — see ai.routes.ts's "ask:" requestType prefix).
 */
export async function getCurrentUsage(userId: string, limitType: PlanLimitType, dbClient: DbOrTx = db): Promise<number> {
  switch (limitType) {
    case PlanLimitType.MEMORY_COUNT: {
      const [row] = await dbClient
        .select({ value: sql<number>`count(*)::int` })
        .from(memories)
        .where(and(eq(memories.userId, userId), eq(memories.inTrash, false)));
      return row?.value ?? 0;
    }
    case PlanLimitType.COLLECTION_COUNT: {
      const [row] = await dbClient
        .select({ value: sql<number>`count(*)::int` })
        .from(collections)
        .where(and(eq(collections.userId, userId), eq(collections.source, CollectionSource.USER)));
      return row?.value ?? 0;
    }
    case PlanLimitType.STORAGE_MB: {
      const [row] = await dbClient
        .select({ value: sum(attachments.fileSize) })
        .from(attachments)
        .innerJoin(memories, eq(attachments.memoryId, memories.id))
        .where(eq(memories.userId, userId));
      const bytes = Number(row?.value ?? 0);
      return Math.ceil(bytes / (1024 * 1024));
    }
    case PlanLimitType.AI_MONTHLY_QUERIES: {
      // Exact match, not a "rag:%" prefix — a single question fans out into
      // several rag:* rows internally (front_desk, agent, check_grounding
      // can each log more than once), so counting those would overcount.
      // ai.service.ts's streamAsk logs exactly one "ask:query" row per
      // actual user question.
      const [row] = await dbClient
        .select({ value: sql<number>`count(*)::int` })
        .from(aiUsageLogs)
        .where(
          and(
            eq(aiUsageLogs.userId, userId),
            eq(aiUsageLogs.requestType, "ask:query"),
            gte(aiUsageLogs.createdAt, startOfCurrentMonth()),
          ),
        );
      return row?.value ?? 0;
    }
    case PlanLimitType.AI_MONTHLY_VISION_QUERIES: {
      // Same exact-match convention as AI_MONTHLY_QUERIES above — counts
      // "ingestion:vision" rows only, one per image actually analyzed
      // (process-image-vision.ts and parse-web-content.ts's image branch).
      const [row] = await dbClient
        .select({ value: sql<number>`count(*)::int` })
        .from(aiUsageLogs)
        .where(
          and(
            eq(aiUsageLogs.userId, userId),
            eq(aiUsageLogs.requestType, "ingestion:vision"),
            gte(aiUsageLogs.createdAt, startOfCurrentMonth()),
          ),
        );
      return row?.value ?? 0;
    }
    case PlanLimitType.PUBLIC_SHARE_COUNT: {
      // Only links actually set to "public" count against the cap — an
      // invite-only or password-protected share is gated by a features flag
      // instead, not by this quota. The `shares` table is imported directly
      // rather than calling share.service: that module imports this one.
      const [row] = await dbClient
        .select({ value: sql<number>`count(*)::int` })
        .from(shares)
        .where(and(eq(shares.ownerId, userId), eq(shares.linkAccess, ShareLinkAccess.PUBLIC)));
      return row?.value ?? 0;
    }
  }
}

interface LimitCheckResult {
  ok: boolean;
  plan: Awaited<ReturnType<typeof resolveEffectivePlan>>["plan"];
  limitValue: number | null;
  current: number;
}

async function checkLimit(
  userId: string,
  limitType: PlanLimitType,
  delta: number,
  dbClient: DbOrTx,
): Promise<LimitCheckResult> {
  const { plan } = await resolveEffectivePlan(userId, dbClient);
  const limits = await getPlanLimits(plan.id, dbClient);
  const limitValue = limits[limitType];
  if (limitValue == null) return { ok: true, plan, limitValue: null, current: 0 }; // unlimited

  const current = await getCurrentUsage(userId, limitType, dbClient);
  return { ok: current + delta <= limitValue, plan, limitValue, current };
}

/**
 * Throws 403 if performing an action that adds `delta` to the current usage
 * of `limitType` would exceed the user's effective plan limit. A null
 * limitValue means unlimited — the common case for Pro, and for every limit
 * type on a still-being-configured plan.
 */
export async function assertWithinLimit(
  userId: string,
  limitType: PlanLimitType,
  delta: number,
  dbClient: DbOrTx = db,
): Promise<void> {
  const result = await checkLimit(userId, limitType, delta, dbClient);
  if (!result.ok) {
    throw new AppError(
      `This would exceed your ${result.plan.name} plan's limit (${result.limitValue}).`,
      403,
      "PLAN_LIMIT_EXCEEDED",
      { limitType, limitValue: result.limitValue, current: result.current, delta },
    );
  }
}

/**
 * Boolean counterpart to assertWithinLimit, for callers that should degrade
 * gracefully on exceeding a limit rather than fail outright — e.g. the
 * ingestion pipeline skipping vision analysis on an over-quota image instead
 * of failing the whole memory.
 */
export async function isWithinLimit(
  userId: string,
  limitType: PlanLimitType,
  delta = 1,
  dbClient: DbOrTx = db,
): Promise<boolean> {
  const result = await checkLimit(userId, limitType, delta, dbClient);
  return result.ok;
}

/**
 * Whether the AI ingestion pipeline may create another auto-organized
 * (source='system') collection for this user. Mirrors assertWithinLimit's
 * semantics (allowed up to and including the plan's collection_count
 * limit) but checks the system-collection count, not the user's own, and
 * returns a boolean instead of throwing — hitting this cap isn't a
 * user-facing error, it's a signal for the ingestion pipeline to fall back
 * to a general collection instead of failing the whole pipeline.
 */
export async function canCreateSystemCollection(userId: string, dbClient: DbOrTx = db): Promise<boolean> {
  const { plan } = await resolveEffectivePlan(userId, dbClient);
  const limits = await getPlanLimits(plan.id, dbClient);
  const limitValue = limits[PlanLimitType.COLLECTION_COUNT];
  if (limitValue == null) return true; // unlimited

  const [row] = await dbClient
    .select({ value: sql<number>`count(*)::int` })
    .from(collections)
    .where(and(eq(collections.userId, userId), eq(collections.source, CollectionSource.SYSTEM)));
  const current = row?.value ?? 0;
  return current < limitValue;
}

/**
 * Boolean counterpart to assertWithinLimit — for admin-configured on/off
 * perks (plans.features), not countable quotas. Doesn't throw; callers
 * decide how to react (the collections module throws its own
 * FEATURE_NOT_AVAILABLE AppError so the message can name the feature).
 */
export async function hasFeature(userId: string, key: string, dbClient: DbOrTx = db): Promise<boolean> {
  const { plan } = await resolveEffectivePlan(userId, dbClient);
  return Boolean(plan.features?.[key]);
}

export async function getMyPlanSummary(userId: string) {
  const { plan, assignment } = await resolveEffectivePlan(userId);
  const limits = await getPlanLimits(plan.id);

  const usage: Partial<Record<PlanLimitType, number>> = {};
  for (const limitType of Object.keys(limits) as PlanLimitType[]) {
    usage[limitType] = await getCurrentUsage(userId, limitType);
  }

  return { plan, assignment, limits, usage };
}
