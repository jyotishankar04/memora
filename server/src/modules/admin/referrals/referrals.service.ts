import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { referralCodes, referralConversions } from "../../../db/schema";
import { ReferralCodeType, ReferralConversionStage } from "../../../db/enums";
import { AppError } from "../../../shared/errors/app-error";
import { logAdminAction } from "../../../shared/utils/audit-log";
import type { CreateReferralCodeInput, ListReferralCodesQuery, UpdateReferralCodeInput } from "./referrals.schema";

export async function listReferralCodes(query: ListReferralCodesQuery) {
  const [{ value: total }] = await db.select({ value: count() }).from(referralCodes);

  const items = await db
    .select()
    .from(referralCodes)
    .orderBy(desc(referralCodes.createdAt))
    .limit(query.limit)
    .offset((query.page - 1) * query.limit);

  return { items, page: query.page, limit: query.limit, total };
}

export async function createAdminReferralCode(input: CreateReferralCodeInput, adminUserId: string, ipAddress?: string) {
  const [code] = await db
    .insert(referralCodes)
    .values({
      code: input.code,
      type: ReferralCodeType.ADMIN_ISSUED,
      ownerUserId: input.ownerUserId ?? null,
      rewardCreditsAmount: input.rewardCreditsAmount,
      isActive: input.isActive,
      createdBy: adminUserId,
    })
    .returning();

  await logAdminAction({
    adminUserId,
    action: "referral_code.created",
    targetType: "referral_code",
    targetId: code.id,
    afterValue: code,
    ipAddress,
  });

  return code;
}

export async function updateReferralCode(
  codeId: string,
  input: UpdateReferralCodeInput,
  adminUserId: string,
  ipAddress?: string,
) {
  const [before] = await db.select().from(referralCodes).where(eq(referralCodes.id, codeId)).limit(1);
  if (!before) {
    throw new AppError("Referral code not found", 404, "NOT_FOUND");
  }

  const [after] = await db
    .update(referralCodes)
    .set({
      ...(input.rewardCreditsAmount !== undefined ? { rewardCreditsAmount: input.rewardCreditsAmount } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    })
    .where(eq(referralCodes.id, codeId))
    .returning();

  await logAdminAction({
    adminUserId,
    action: "referral_code.updated",
    targetType: "referral_code",
    targetId: codeId,
    beforeValue: before,
    afterValue: after,
    ipAddress,
  });

  return after;
}

/** Applied-vs-converted funnel for one code — mirrors admin/coupons's getCouponRedemptions shape. */
export async function getReferralCodeConversions(codeId: string, page: number, limit: number) {
  const [code] = await db.select().from(referralCodes).where(eq(referralCodes.id, codeId)).limit(1);
  if (!code) {
    throw new AppError("Referral code not found", 404, "NOT_FOUND");
  }

  const [{ value: appliedCount }] = await db
    .select({ value: count() })
    .from(referralConversions)
    .where(eq(referralConversions.referralCodeId, codeId));

  const [{ value: convertedCount }] = await db
    .select({ value: count() })
    .from(referralConversions)
    .where(and(eq(referralConversions.referralCodeId, codeId), eq(referralConversions.stage, ReferralConversionStage.CONVERTED)));

  const items = await db
    .select()
    .from(referralConversions)
    .where(eq(referralConversions.referralCodeId, codeId))
    .orderBy(desc(referralConversions.appliedAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return { code, items, page, limit, appliedCount, convertedCount };
}
