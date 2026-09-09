import { z } from "zod";
import { PlanBillingInterval, PlanLimitType } from "../../../db/enums";

const planLimitInputSchema = z.object({
  limitType: z.enum([
    PlanLimitType.MEMORY_COUNT,
    PlanLimitType.AI_MONTHLY_QUERIES,
    PlanLimitType.STORAGE_MB,
    PlanLimitType.COLLECTION_COUNT,
  ]),
  limitValue: z.coerce.number().int().min(0).nullable(), // null = unlimited
});

export const createPlanSchema = z.object({
  key: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(100),
  description: z.string().max(2000).optional(),
  priceMinor: z.coerce.number().int().min(0).default(0),
  currency: z.string().length(3).default("inr"),
  billingInterval: z
    .enum([PlanBillingInterval.MONTHLY, PlanBillingInterval.YEARLY, PlanBillingInterval.ONE_TIME])
    .default(PlanBillingInterval.MONTHLY),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  limits: z.array(planLimitInputSchema).optional(),
});

// `key` is intentionally excluded — it's the stable machine identifier
// other code references and is set once at creation, never renamed.
export const updatePlanSchema = createPlanSchema.omit({ key: true }).partial();

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
