import crypto from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { db, type DbOrTx } from "../../db";
import { referralCodes, referralConversions } from "../../db/schema";
import { CreditLedgerReason, ReferralCodeType, ReferralConversionStage } from "../../db/enums";
import { AppError } from "../../shared/errors/app-error";
import { recordCreditEntry } from "../credits/credits.service";

// Placeholder, same "not load-bearing" reasoning as the seeded plan prices —
// admin can change what a given code pays out via admin/referrals; new
// self-serve codes are minted with this default.
const DEFAULT_USER_REFERRAL_REWARD_CREDITS = 100;

function generateCode(): string {
  return crypto.randomBytes(5).toString("hex"); // 10 hex chars
}

export async function getOrCreateMyReferralCode(userId: string) {
  const [existing] = await db
    .select()
    .from(referralCodes)
    .where(and(eq(referralCodes.ownerUserId, userId), eq(referralCodes.type, ReferralCodeType.USER)))
    .limit(1);
  if (existing) return existing;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const [created] = await db
        .insert(referralCodes)
        .values({
          code: generateCode(),
          type: ReferralCodeType.USER,
          ownerUserId: userId,
          rewardCreditsAmount: DEFAULT_USER_REFERRAL_REWARD_CREDITS,
        })
        .returning();
      return created;
    } catch (err) {
      // Unique violation on the generated code (astronomically unlikely at
      // 5 bytes, but cheap to guard) — regenerate and retry. Anything else
      // rethrows immediately.
      if (!(err instanceof Error) || (err as { code?: string }).code !== "23505") throw err;
    }
  }
  throw new AppError("Could not generate a unique referral code, try again", 500, "REFERRAL_CODE_GENERATION_FAILED");
}

export async function getMyReferralStats(userId: string) {
  const code = await getOrCreateMyReferralCode(userId);
  const conversions = await db.select().from(referralConversions).where(eq(referralConversions.referralCodeId, code.id));
  const convertedCount = conversions.filter((c) => c.stage === ReferralConversionStage.CONVERTED).length;
  return { code, appliedCount: conversions.length, convertedCount };
}

/** Public, no-auth — a coarse top-of-funnel counter. See referral_codes.clickCount's schema comment for why this isn't a row per click. */
export async function trackClick(code: string): Promise<void> {
  await db.update(referralCodes).set({ clickCount: sql`${referralCodes.clickCount} + 1` }).where(eq(referralCodes.code, code));
  // No-op (not an error) if the code doesn't exist — a public endpoint
  // shouldn't let response shape reveal which codes are valid.
}

/**
 * Called from the OAuth signup flow (see Open Flag #1 — attribution capture
 * point) once a new user completes signup carrying an attributed referral
 * code. Returns null (not an error) for an unknown/inactive code, since
 * signup must still succeed either way.
 */
export async function recordReferralSignup(code: string, referredUserId: string, dbClient: DbOrTx = db) {
  const run = async (tx: DbOrTx) => {
    const [referralCode] = await tx
      .select()
      .from(referralCodes)
      .where(and(eq(referralCodes.code, code), eq(referralCodes.isActive, true)))
      .limit(1);
    if (!referralCode) return null;

    const [conversion] = await tx
      .insert(referralConversions)
      .values({ referralCodeId: referralCode.id, referredUserId })
      .onConflictDoNothing({ target: referralConversions.referredUserId }) // first attribution wins
      .returning();
    return conversion ?? null;
  };
  if (dbClient === db) return db.transaction((tx) => run(tx));
  return run(dbClient);
}

/**
 * Flips a conversion to CONVERTED and grants the referrer's credit reward.
 * Composable via an external tx (see coupons.markRedemptionConverted for the
 * identical reasoning) so admin/billing's manual plan-assignment flow can
 * do this atomically alongside creating the transaction row. Idempotent —
 * re-calling on an already-converted row is a no-op, not a double credit.
 */
export async function markConversionConverted(conversionId: string, transactionId: string, dbClient: DbOrTx = db) {
  const run = async (tx: DbOrTx) => {
    const [conversion] = await tx.select().from(referralConversions).where(eq(referralConversions.id, conversionId)).limit(1);
    if (!conversion) {
      throw new AppError("Referral conversion not found", 404, "NOT_FOUND");
    }
    if (conversion.stage === ReferralConversionStage.CONVERTED) return conversion;

    const [updated] = await tx
      .update(referralConversions)
      .set({ stage: ReferralConversionStage.CONVERTED, convertedAt: new Date(), transactionId })
      .where(eq(referralConversions.id, conversionId))
      .returning();

    const [code] = await tx.select().from(referralCodes).where(eq(referralCodes.id, conversion.referralCodeId)).limit(1);
    if (code?.ownerUserId) {
      await recordCreditEntry(
        {
          userId: code.ownerUserId,
          amount: code.rewardCreditsAmount,
          reason: CreditLedgerReason.REFERRAL_REWARD,
          referenceType: "referral_conversion",
          referenceId: conversionId,
        },
        tx,
      );
    }

    return updated;
  };
  if (dbClient === db) return db.transaction((tx) => run(tx));
  return run(dbClient);
}
