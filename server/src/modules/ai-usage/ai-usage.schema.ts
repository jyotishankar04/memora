import { z } from "zod";

export const usageRangeQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});

export const usageByUserQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type UsageRangeQuery = z.infer<typeof usageRangeQuerySchema>;
export type UsageByUserQuery = z.infer<typeof usageByUserQuerySchema>;
