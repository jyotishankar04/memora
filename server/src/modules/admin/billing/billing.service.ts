import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "../../../db";
import { plans, transactions, userPlanAssignments, users } from "../../../db/schema";
import { PlanAssignmentSource, PlanAssignmentStatus, TransactionStatus, TransactionType } from "../../../db/enums";
import { AppError } from "../../../shared/errors/app-error";
import { logAdminAction } from "../../../shared/utils/audit-log";
import { markRedemptionConverted } from "../../coupons/coupons.service";
import { markConversionConverted } from "../../referrals/referrals.service";
import type { AssignPlanInput, ListAssignmentsQuery, ListTransactionsQuery, RevenueQuery } from "./billing.schema";

/**
 * The manual "give this user a plan" flow — creates the plan assignment and
 * a matching transaction row atomically, and (idempotently) converts the
 * coupon redemption / referral conversion that led to it, if given. This is
 * exactly what a future Stripe webhook handler will do automatically; today
 * an admin triggers it by hand since there's no live checkout yet.
 */
export async function assignPlanToUser(userId: string, input: AssignPlanInput, adminUserId: string, ipAddress?: string) {
  return db.transaction(async (tx) => {
    const [plan] = await tx.select({ currency: plans.currency }).from(plans).where(eq(plans.id, input.planId)).limit(1);
    if (!plan) throw new AppError("Plan not found", 404);

    // Only one ACTIVE assignment per user — same flip-others-first pattern
    // used throughout this schema (announcements.isActive, plans.isDefault).
    await tx
      .update(userPlanAssignments)
      .set({ status: PlanAssignmentStatus.SUPERSEDED })
      .where(and(eq(userPlanAssignments.userId, userId), eq(userPlanAssignments.status, PlanAssignmentStatus.ACTIVE)));

    const [assignment] = await tx
      .insert(userPlanAssignments)
      .values({
        userId,
        planId: input.planId,
        status: PlanAssignmentStatus.ACTIVE,
        source: input.couponRedemptionId
          ? PlanAssignmentSource.COUPON_REDEMPTION
          : input.referralConversionId
            ? PlanAssignmentSource.REFERRAL_REWARD
            : PlanAssignmentSource.ADMIN_MANUAL,
        endsAt: input.endsAt ? new Date(input.endsAt) : null,
        assignedBy: adminUserId,
        reason: input.reason ?? null,
        sourceRefType: input.couponRedemptionId ? "coupon_redemption" : input.referralConversionId ? "referral_conversion" : null,
        sourceRefId: input.couponRedemptionId ?? input.referralConversionId ?? null,
      })
      .returning();

    const [transaction] = await tx
      .insert(transactions)
      .values({
        userId,
        planId: input.planId,
        planAssignmentId: assignment.id,
        type: input.amountMinor > 0 ? TransactionType.SUBSCRIPTION_PURCHASE : TransactionType.ADMIN_GRANT,
        status: TransactionStatus.SUCCEEDED,
        amountMinor: input.amountMinor,
        currency: plan.currency,
        initiatedBy: adminUserId,
        occurredAt: new Date(),
      })
      .returning();

    if (input.couponRedemptionId) {
      await markRedemptionConverted(input.couponRedemptionId, transaction.id, tx);
    }
    if (input.referralConversionId) {
      await markConversionConverted(input.referralConversionId, transaction.id, tx);
    }

    await logAdminAction({
      adminUserId,
      action: "plan.assigned",
      targetType: "user",
      targetId: userId,
      afterValue: { planId: input.planId, assignmentId: assignment.id, transactionId: transaction.id },
      ipAddress,
    });

    return { assignment, transaction };
  });
}

export async function cancelAssignment(assignmentId: string, adminUserId: string, ipAddress?: string) {
  const [before] = await db.select().from(userPlanAssignments).where(eq(userPlanAssignments.id, assignmentId)).limit(1);
  if (!before) {
    throw new AppError("Plan assignment not found", 404, "NOT_FOUND");
  }

  const [after] = await db
    .update(userPlanAssignments)
    .set({ status: PlanAssignmentStatus.CANCELLED })
    .where(eq(userPlanAssignments.id, assignmentId))
    .returning();

  await logAdminAction({
    adminUserId,
    action: "plan_assignment.cancelled",
    targetType: "user_plan_assignment",
    targetId: assignmentId,
    beforeValue: before,
    afterValue: after,
    ipAddress,
  });

  return after;
}

export async function listAssignmentsForUser(userId: string) {
  return db
    .select()
    .from(userPlanAssignments)
    .where(eq(userPlanAssignments.userId, userId))
    .orderBy(desc(userPlanAssignments.startsAt));
}

/** Global "Subscriptions" list — every plan assignment across every user, joined for display. */
export async function listAllAssignments(query: ListAssignmentsQuery) {
  const where = query.status ? eq(userPlanAssignments.status, query.status) : undefined;

  const [{ value: total }] = await db.select({ value: count() }).from(userPlanAssignments).where(where);

  const items = await db
    .select({
      id: userPlanAssignments.id,
      userId: userPlanAssignments.userId,
      userEmail: users.email,
      userName: users.name,
      planId: userPlanAssignments.planId,
      planKey: plans.key,
      planName: plans.name,
      status: userPlanAssignments.status,
      source: userPlanAssignments.source,
      startsAt: userPlanAssignments.startsAt,
      endsAt: userPlanAssignments.endsAt,
      reason: userPlanAssignments.reason,
    })
    .from(userPlanAssignments)
    .leftJoin(users, eq(users.id, userPlanAssignments.userId))
    .leftJoin(plans, eq(plans.id, userPlanAssignments.planId))
    .where(where)
    .orderBy(desc(userPlanAssignments.startsAt))
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);

  return { items, page: query.page, limit: query.limit, total };
}

export async function listTransactions(query: ListTransactionsQuery) {
  const conditions = [];
  if (query.status) conditions.push(eq(transactions.status, query.status));
  if (query.userId) conditions.push(eq(transactions.userId, query.userId));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ value: total }] = await db.select({ value: count() }).from(transactions).where(where);

  const items = await db
    .select()
    .from(transactions)
    .where(where)
    .orderBy(desc(transactions.occurredAt))
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);

  return { items, page: query.page, limit: query.limit, total };
}

export async function getRevenueRollup(query: RevenueQuery) {
  const since = new Date(Date.now() - query.days * 24 * 60 * 60 * 1000);

  const byDay = await db
    .select({
      date: sql<string>`date(${transactions.occurredAt})`,
      totalMinor: sql<number>`coalesce(sum(${transactions.amountMinor}), 0)::int`,
      count: count(),
    })
    .from(transactions)
    .where(and(gte(transactions.occurredAt, since), eq(transactions.status, TransactionStatus.SUCCEEDED)))
    .groupBy(sql`date(${transactions.occurredAt})`)
    .orderBy(sql`date(${transactions.occurredAt})`);

  const byPlan = await db
    .select({
      planId: transactions.planId,
      totalMinor: sql<number>`coalesce(sum(${transactions.amountMinor}), 0)::int`,
      count: count(),
    })
    .from(transactions)
    .where(and(gte(transactions.occurredAt, since), eq(transactions.status, TransactionStatus.SUCCEEDED)))
    .groupBy(transactions.planId);

  return { byDay, byPlan };
}
