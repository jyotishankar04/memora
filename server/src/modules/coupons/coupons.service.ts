import { and, count, eq, sql } from "drizzle-orm";
import { db, type DbOrTx } from "../../db";
import { coupons, couponRedemptions, plans } from "../../db/schema";
import { CouponDiscountType, CouponRedemptionStatus } from "../../db/enums";
import { AppError } from "../../shared/errors/app-error";

async function computeDiscountAmountMinor(
  coupon: typeof coupons.$inferSelect,
  tx: DbOrTx,
): Promise<number | null> {
  if (coupon.discountType === CouponDiscountType.FIXED_AMOUNT) return coupon.discountValue;
  // Percentage discounts need a base price to compute against. A coupon
  // scoped to one plan can snapshot it now; a code valid on "any plan" has
  // no single base price at apply time, so the snapshot stays null until
  // it's actually attached to a real transaction/plan.
  if (!coupon.applicablePlanId) return null;
  const [plan] = await tx.select().from(plans).where(eq(plans.id, coupon.applicablePlanId)).limit(1);
  if (!plan) return null;
  return Math.round((plan.priceMinor * coupon.discountValue) / 100);
}

/**
 * Redeems a coupon code for a user. Runs inside one transaction with
 * `SELECT ... FOR UPDATE` on the coupon row — this is the codebase's first
 * use of row locking, needed because `redemptionCount` vs. `maxRedemptions`
 * is a check-then-act race under concurrent applies of the same code.
 */
export async function applyCoupon(userId: string, code: string, ipAddress?: string) {
  return db.transaction(async (tx) => {
    const [coupon] = await tx.select().from(coupons).where(eq(coupons.code, code)).for("update").limit(1);
    if (!coupon) {
      throw new AppError("Invalid coupon code", 404, "COUPON_NOT_FOUND");
    }
    if (!coupon.isActive) {
      throw new AppError("This coupon is no longer active", 400, "COUPON_INACTIVE");
    }

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new AppError("This coupon isn't active yet", 400, "COUPON_NOT_STARTED");
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new AppError("This coupon has expired", 400, "COUPON_EXPIRED");
    }
    if (coupon.maxRedemptions != null && coupon.redemptionCount >= coupon.maxRedemptions) {
      throw new AppError("This coupon has reached its redemption limit", 400, "COUPON_MAX_REDEMPTIONS");
    }

    const [{ value: userRedemptions }] = await tx
      .select({ value: count() })
      .from(couponRedemptions)
      .where(and(eq(couponRedemptions.couponId, coupon.id), eq(couponRedemptions.userId, userId)));
    if (userRedemptions >= coupon.maxRedemptionsPerUser) {
      throw new AppError("You've already used this coupon", 400, "COUPON_ALREADY_USED");
    }

    const discountAmountMinor = await computeDiscountAmountMinor(coupon, tx);

    const [redemption] = await tx
      .insert(couponRedemptions)
      .values({ couponId: coupon.id, userId, discountAmountMinor, ipAddress })
      .returning();

    await tx.update(coupons).set({ redemptionCount: sql`${coupons.redemptionCount} + 1` }).where(eq(coupons.id, coupon.id));

    return { redemption, coupon };
  });
}

/**
 * Flips a redemption from applied to converted once it's led to an actual
 * purchase. Accepts an external `tx` so callers (admin/billing's manual
 * plan-assignment flow today, a future Stripe webhook handler later) can
 * compose this into one larger atomic write instead of nesting a
 * transaction.
 */
export async function markRedemptionConverted(redemptionId: string, transactionId: string, dbClient: DbOrTx = db) {
  const run = async (tx: DbOrTx) => {
    const [row] = await tx
      .update(couponRedemptions)
      .set({ status: CouponRedemptionStatus.CONVERTED, convertedAt: new Date(), transactionId })
      .where(eq(couponRedemptions.id, redemptionId))
      .returning();
    if (!row) {
      throw new AppError("Coupon redemption not found", 404, "NOT_FOUND");
    }
    return row;
  };
  if (dbClient === db) return db.transaction((tx) => run(tx));
  return run(dbClient);
}
