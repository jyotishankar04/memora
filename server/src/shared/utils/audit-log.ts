import { db } from "../../db";
import { adminAuditLogs } from "../../db/schema";

interface LogAdminActionInput {
  adminUserId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  beforeValue?: unknown;
  afterValue?: unknown;
  ipAddress?: string;
}

/** Writes one admin_audit_logs row. Called directly by mutating admin service functions. */
export async function logAdminAction(input: LogAdminActionInput): Promise<void> {
  await db.insert(adminAuditLogs).values({
    adminUserId: input.adminUserId,
    action: input.action,
    targetType: input.targetType,
    targetId: input.targetId,
    beforeValue: input.beforeValue,
    afterValue: input.afterValue,
    ipAddress: input.ipAddress,
  });
}
