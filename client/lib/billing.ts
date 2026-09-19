import { apiFetch } from "@/lib/auth";

export async function createCheckoutSession(planKey: string): Promise<{ url: string }> {
  return apiFetch<{ url: string }>("/billing/checkout", { method: "POST", body: { planKey } });
}
