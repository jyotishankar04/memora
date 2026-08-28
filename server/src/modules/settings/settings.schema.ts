import { z } from "zod";

export const updateSettingsSchema = z.object({
  ai: z
    .object({
      autoOrganization: z.boolean().optional(),
      summaries: z.boolean().optional(),
      relatedMemories: z.boolean().optional(),
      semanticSearch: z.boolean().optional(),
      askMemora: z.boolean().optional(),
    })
    .optional(),
  capture: z
    .object({
      extractContent: z.boolean().optional(),
      generateTitle: z.boolean().optional(),
      generateSummary: z.boolean().optional(),
      suggestTags: z.boolean().optional(),
    })
    .optional(),
  notifications: z
    .object({
      weeklySummary: z.boolean().optional(),
      forgottenMemories: z.boolean().optional(),
      productUpdates: z.boolean().optional(),
    })
    .optional(),
  appearance: z
    .object({
      theme: z.enum(["system", "light", "dark"]).optional(),
      accentColor: z.enum(["blue", "purple", "green", "orange"]).optional(),
    })
    .optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
