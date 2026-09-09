import { z } from "zod";
import { PlanAssignmentStatus, TransactionStatus } from "../../../db/enums";

export const assignPlanSchema = z.object({
  planId: z.string().uuid(),
  endsAt: z.string().datetime().nullable().optional(), // null/omitted = doesn't expire
  reason: z.string().max(1000).optional(),
  amountMinor: z.coerce.number().int().min(0).default(0), // 0 = pure grant, no charge recorded
  // If this assignment fulfills a coupon-discounted or referred purchase,
  // pass the redemption/conversion id to flip it to converted atomically
  // with the assignment + transaction — the manual-admin equivalent of what
  // a future Stripe webhook handler would do.
  couponRedemptionId: z.string().uuid().optional(),
  referralConversionId: z.string().uuid().optional(),
});

export const listTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum([
      TransactionStatus.PENDING,
      TransactionStatus.SUCCEEDED,
      TransactionStatus.FAILED,
      TransactionStatus.REFUNDED,
      TransactionStatus.CANCELLED,
    ])
    .optional(),
  userId: z.string().uuid().optional(),
});

export const revenueQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});

export const listAssignmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum([PlanAssignmentStatus.ACTIVE, PlanAssignmentStatus.EXPIRED, PlanAssignmentStatus.CANCELLED, PlanAssignmentStatus.SUPERSEDED])
    .optional(),
});

export type AssignPlanInput = z.infer<typeof assignPlanSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
export type RevenueQuery = z.infer<typeof revenueQuerySchema>;
export type ListAssignmentsQuery = z.infer<typeof listAssignmentsQuerySchema>;
