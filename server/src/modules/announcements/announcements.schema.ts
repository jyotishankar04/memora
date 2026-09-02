import { z } from "zod";
import { AnnouncementType } from "../../db/enums";

export const createAnnouncementSchema = z.object({
  type: z.enum([AnnouncementType.COUNTDOWN, AnnouncementType.ANNOUNCEMENT, AnnouncementType.UPDATE]),
  title: z.string().min(1).max(200),
  message: z.string().min(1),
  targetDate: z.string().datetime().nullable().optional(),
  ctaLabel: z.string().max(100).nullable().optional(),
  ctaUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
