import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(50).default("folder-outline"),
  description: z.string().optional(),
});

export const updateCollectionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().max(50).optional(),
  description: z.string().optional(),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
