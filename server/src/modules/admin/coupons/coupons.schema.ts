import { z } from "zod";
import { CouponDiscountType } from "../../../db/enums";

export const createCouponSchema = z.object({
  code: z.string().trim().min(1).max(50),
  label: z.string().max(150).optional(),
  discountType: z.enum([CouponDiscountType.PERCENTAGE, CouponDiscountType.FIXED_AMOUNT]),
  discountValue: z.coerce.number().int().min(1),
  applicablePlanId: z.string().uuid().nullable().optional(),
  maxRedemptions: z.coerce.number().int().min(1).nullable().optional(),
  maxRedemptionsPerUser: z.coerce.number().int().min(1).default(1),
  startsAt: z.string().datetime().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const updateCouponSchema = createCouponSchema.omit({ code: true }).partial();

export const listCouponsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type ListCouponsQuery = z.infer<typeof listCouponsQuerySchema>;
