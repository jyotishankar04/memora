import { apiFetch } from "@/lib/auth";

export interface DateCount {
  date: string;
  count: number;
}

export interface ContentGrowth {
  memories: DateCount[];
  collections: DateCount[];
}

export async function getSignupsOverTime(days = 30): Promise<DateCount[]> {
  return apiFetch<DateCount[]>(`/admin/analytics/signups?days=${days}`);
}

export async function getActiveUsers(days = 30): Promise<DateCount[]> {
  return apiFetch<DateCount[]>(`/admin/analytics/active-users?days=${days}`);
}

export async function getContentGrowth(days = 30): Promise<ContentGrowth> {
  return apiFetch<ContentGrowth>(`/admin/analytics/content-growth?days=${days}`);
}
