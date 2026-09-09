import { z } from "zod";

export const trackClickSchema = z.object({
  code: z.string().trim().min(1).max(50),
});

export type TrackClickInput = z.infer<typeof trackClickSchema>;
