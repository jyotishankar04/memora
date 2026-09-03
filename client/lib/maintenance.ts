import { apiFetch } from "@/lib/auth";

export interface MaintenanceStatus {
  enabled: boolean;
  message: string;
}

/** Public, unauthenticated — every surface (marketing, platform, auth) polls this to decide whether to gate itself. */
export async function getMaintenanceStatus(): Promise<MaintenanceStatus> {
  return apiFetch<MaintenanceStatus>("/maintenance/status");
}
