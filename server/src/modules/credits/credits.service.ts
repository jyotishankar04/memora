import { count, desc, eq, sql } from "drizzle-orm";
import { db, type DbOrTx } from "../../db";
import { creditLedger, userCreditBalances } from "../../db/schema";
import type { CreditLedgerReason } from "../../db/enums";

export interface RecordCreditEntryParams {
  userId: string;
  amount: number; // signed — positive = credit, negative = debit
  reason: CreditLedgerReason;
  referenceType?: string | null;
  referenceId?: string | null;
  note?: string | null;
  createdBy?: string | null; // admin id for manual adjustments, null if system-generated
}

/**
 * Inserts one append-only ledger row and atomically bumps the cached
 * balance. If `dbClient` is the top-level `db` (the default — a standalone
 * call), this opens its own transaction; if a caller passed its own `tx`
 * (composing a larger atomic write, e.g. admin/billing converting a
 * referral and granting credits in one go), it runs directly against that
 * client instead of nesting a transaction.
 */
export async function recordCreditEntry(params: RecordCreditEntryParams, dbClient: DbOrTx = db) {
  const run = async (tx: DbOrTx) => {
    const [entry] = await tx
      .insert(creditLedger)
      .values({
        userId: params.userId,
        amount: params.amount,
        reason: params.reason,
        referenceType: params.referenceType ?? null,
        referenceId: params.referenceId ?? null,
        note: params.note ?? null,
        createdBy: params.createdBy ?? null,
      })
      .returning();

    await tx
      .insert(userCreditBalances)
      .values({ userId: params.userId, balance: params.amount })
      .onConflictDoUpdate({
        target: userCreditBalances.userId,
        set: { balance: sql`${userCreditBalances.balance} + ${params.amount}`, updatedAt: new Date() },
      });

    return entry;
  };

  if (dbClient === db) {
    return db.transaction((tx) => run(tx));
  }
  return run(dbClient);
}

export async function getBalance(userId: string, dbClient: DbOrTx = db): Promise<number> {
  const [row] = await dbClient.select().from(userCreditBalances).where(eq(userCreditBalances.userId, userId)).limit(1);
  return row?.balance ?? 0;
}

export async function listLedgerForUser(userId: string, page: number, limit: number, dbClient: DbOrTx = db) {
  const [{ value: total }] = await dbClient.select({ value: count() }).from(creditLedger).where(eq(creditLedger.userId, userId));

  const items = await dbClient
    .select()
    .from(creditLedger)
    .where(eq(creditLedger.userId, userId))
    .orderBy(desc(creditLedger.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return { items, page, limit, total };
}
