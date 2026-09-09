import { z } from "zod";

export const createReferralCodeSchema = z.object({
  code: z.string().trim().min(1).max(50),
  ownerUserId: z.string().uuid().nullable().optional(),
  rewardCreditsAmount: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true),
});

export const updateReferralCodeSchema = z.object({
  rewardCreditsAmount: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const listReferralCodesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateReferralCodeInput = z.infer<typeof createReferralCodeSchema>;
export type UpdateReferralCodeInput = z.infer<typeof updateReferralCodeSchema>;
export type ListReferralCodesQuery = z.infer<typeof listReferralCodesQuerySchema>;
