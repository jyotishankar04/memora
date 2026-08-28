import { z } from "zod";

export const completeOnboardingSchema = z.object({
  name: z.string().min(1).max(255),
  interests: z.array(z.string().min(1).max(100)).max(20).default([]),
  contentTypes: z.array(z.string().min(1).max(100)).max(20).default([]),
  organizeMode: z.enum(["auto", "manual"]).default("auto"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(255),
});

export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
