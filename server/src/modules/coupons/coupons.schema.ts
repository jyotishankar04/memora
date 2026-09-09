import { z } from "zod";

export const applyCouponSchema = z.object({
  code: z.string().trim().min(1).max(50),
});

export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
