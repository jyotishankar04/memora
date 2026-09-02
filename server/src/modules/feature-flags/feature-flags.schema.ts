import { z } from "zod";

export const updateFlagSchema = z.object({
  value: z.union([z.boolean(), z.string(), z.number()]),
  description: z.string().optional(),
  category: z.string().max(50).optional(),
});

export type UpdateFlagInput = z.infer<typeof updateFlagSchema>;
