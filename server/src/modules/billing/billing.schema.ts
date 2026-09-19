import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  planKey: z.string().min(1).max(50),
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
