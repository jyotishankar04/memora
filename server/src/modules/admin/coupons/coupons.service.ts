import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { coupons, couponRedemptions } from "../../../db/schema";
import { CouponRedemptionStatus } from "../../../db/enums";
import { AppError } from "../../../shared/errors/app-error";
import { logAdminAction } from "../../../shared/utils/audit-log";
import type { CreateCouponInput, ListCouponsQuery, UpdateCouponInput } from "./coupons.schema";

export async function listCoupons(query: ListCouponsQuery) {
  const [{ value: total }] = await db.select({ value: count() }).from(coupons);

  const items = await db
    .select()
    .from(coupons)
    .orderBy(desc(coupons.createdAt))
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);

  return { items, page: query.page, limit: query.limit, total };
}

export async function createCoupon(input: CreateCouponInput, adminUserId: string, ipAddress?: string) {
  const [coupon] = await db
    .insert(coupons)
    .values({
      code: input.code,
      label: input.label ?? null,
      discountType: input.discountType,
      discountValue: input.discountValue,
      applicablePlanId: input.applicablePlanId ?? null,
      maxRedemptions: input.maxRedemptions ?? null,
      maxRedemptionsPerUser: input.maxRedemptionsPerUser,
      startsAt: input.startsAt ? new Date(input.startsAt) : null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      isActive: input.isActive,
      createdBy: adminUserId,
    })
    .returning();

  await logAdminAction({
    adminUserId,
    action: "coupon.created",
    targetType: "coupon",
    targetId: coupon.id,
    afterValue: coupon,
    ipAddress,
  });

  return coupon;
}

export async function updateCoupon(couponId: string, input: UpdateCouponInput, adminUserId: string, ipAddress?: string) {
  const [before] = await db.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);
  if (!before) {
    throw new AppError("Coupon not found", 404, "NOT_FOUND");
  }

  const [after] = await db
    .update(coupons)
    .set({
      ...(input.label !== undefined ? { label: input.label } : {}),
      ...(input.discountType !== undefined ? { discountType: input.discountType } : {}),
      ...(input.discountValue !== undefined ? { discountValue: input.discountValue } : {}),
      ...(input.applicablePlanId !== undefined ? { applicablePlanId: input.applicablePlanId } : {}),
      ...(input.maxRedemptions !== undefined ? { maxRedemptions: input.maxRedemptions } : {}),
      ...(input.maxRedemptionsPerUser !== undefined ? { maxRedemptionsPerUser: input.maxRedemptionsPerUser } : {}),
      ...(input.startsAt !== undefined ? { startsAt: input.startsAt ? new Date(input.startsAt) : null } : {}),
      ...(input.expiresAt !== undefined ? { expiresAt: input.expiresAt ? new Date(input.expiresAt) : null } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    })
    .where(eq(coupons.id, couponId))
    .returning();

  await logAdminAction({
    adminUserId,
    action: "coupon.updated",
    targetType: "coupon",
    targetId: couponId,
    beforeValue: before,
    afterValue: after,
    ipAddress,
  });

  return after;
}

/** Applied-vs-converted funnel for one coupon: the redemption rows plus the two headline counts. */
export async function getCouponRedemptions(couponId: string, page: number, limit: number) {
  const [coupon] = await db.select().from(coupons).where(eq(coupons.id, couponId)).limit(1);
  if (!coupon) {
    throw new AppError("Coupon not found", 404, "NOT_FOUND");
  }

  const [{ value: total }] = await db.select({ value: count() }).from(couponRedemptions).where(eq(couponRedemptions.couponId, couponId));
  const [{ value: convertedCount }] = await db
    .select({ value: count() })
    .from(couponRedemptions)
    .where(and(eq(couponRedemptions.couponId, couponId), eq(couponRedemptions.status, CouponRedemptionStatus.CONVERTED)));

  const items = await db
    .select()
    .from(couponRedemptions)
    .where(eq(couponRedemptions.couponId, couponId))
    .orderBy(desc(couponRedemptions.appliedAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return { coupon, items, page, limit, appliedCount: total, convertedCount };
}
