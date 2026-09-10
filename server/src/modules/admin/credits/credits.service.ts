import { CreditLedgerReason } from "../../../db/enums";
import { logAdminAction } from "../../../shared/utils/audit-log";
import { getBalance, listLedgerForUser, recordCreditEntry } from "../../credits/credits.service";
import type { AdjustCreditsInput } from "./credits.schema";

export async function getUserCreditDetail(userId: string, page: number, limit: number) {
  const [balance, ledger] = await Promise.all([getBalance(userId), listLedgerForUser(userId, page, limit)]);
  return { balance, ledger };
}

export async function adjustUserCredits(
  userId: string,
  input: AdjustCreditsInput,
  adminUserId: string,
  ipAddress?: string,
) {
  const entry = await recordCreditEntry({
    userId,
    amount: input.amount,
    reason: CreditLedgerReason.ADMIN_ADJUSTMENT,
    note: input.note,
    createdBy: adminUserId,
  });

  await logAdminAction({
    adminUserId,
    action: "credits.adjusted",
    targetType: "user",
    targetId: userId,
    afterValue: { amount: input.amount, note: input.note ?? null },
    ipAddress,
  });

  return entry;
}
