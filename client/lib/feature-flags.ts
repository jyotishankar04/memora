import { apiFetch } from "@/lib/auth";

export interface FeatureFlag {
  key: string;
  value: boolean | string | number;
  description: string | null;
  category: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProvidersStatus {
  google: boolean;
  github: boolean;
  signupsEnabled: boolean;
}

export async function listFlags(): Promise<FeatureFlag[]> {
  return apiFetch<FeatureFlag[]>("/admin/flags");
}

export async function updateFlag(key: string, value: boolean | string | number): Promise<FeatureFlag> {
  return apiFetch<FeatureFlag>(`/admin/flags/${key}`, {
    method: "PATCH",
    body: { value },
  });
}

/** Public — no auth required, used by the login page too. */
export async function getProvidersStatus(): Promise<ProvidersStatus> {
  return apiFetch<ProvidersStatus>("/auth/providers");
}
