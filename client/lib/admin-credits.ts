import { apiFetch } from "@/lib/auth";

export interface CreditLedgerEntry {
  id: string;
  userId: string | null;
  amount: number;
  reason: string;
  note: string | null;
  createdAt: string;
}

export interface UserCreditDetail {
  balance: number;
  ledger: { items: CreditLedgerEntry[]; page: number; limit: number; total: number };
}

export async function getUserCreditDetail(userId: string, page = 1, limit = 20): Promise<UserCreditDetail> {
  return apiFetch<UserCreditDetail>(`/admin/credits/users/${userId}?page=${page}&limit=${limit}`);
}

export async function adjustUserCredits(userId: string, amount: number, note?: string): Promise<CreditLedgerEntry> {
  return apiFetch<CreditLedgerEntry>(`/admin/credits/users/${userId}/adjust`, { method: "POST", body: { amount, note } });
}
