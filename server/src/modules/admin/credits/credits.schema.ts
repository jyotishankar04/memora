import { z } from "zod";

export const adjustCreditsSchema = z.object({
  amount: z.coerce.number().int().refine((v) => v !== 0, "amount must be non-zero"),
  note: z.string().max(1000).optional(),
});

export type AdjustCreditsInput = z.infer<typeof adjustCreditsSchema>;
