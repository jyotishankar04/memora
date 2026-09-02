import { z } from "zod";
import { UserStatus } from "../../db/enums";

export const listUsersQuerySchema = z.object({
  q: z.string().trim().max(255).optional(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BANNED, UserStatus.SUSPENDED, UserStatus.DELETED]).optional(),
  role: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateUserRolesSchema = z.object({
  role: z.string().min(1).max(100),
  action: z.enum(["grant", "revoke"]),
});

export const updateUserStatusSchema = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BANNED, UserStatus.SUSPENDED]),
});

export const analyticsRangeQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});

export const auditLogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UpdateUserRolesInput = z.infer<typeof updateUserRolesSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type AnalyticsRangeQuery = z.infer<typeof analyticsRangeQuerySchema>;
export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;
