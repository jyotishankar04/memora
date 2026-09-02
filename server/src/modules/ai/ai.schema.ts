import { z } from "zod";

export const createThreadSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

export const askSchema = z.object({
  query: z.string().min(1).max(2000),
});

export const threadIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateThreadInput = z.infer<typeof createThreadSchema>;
export type AskInput = z.infer<typeof askSchema>;
