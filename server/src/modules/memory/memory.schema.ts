import { z } from "zod";

export const memoryTypeSchema = z.enum(["web", "video", "note", "image", "document", "voice"]);

export const attachmentInputSchema = z.object({
  fileUrl: z.string().url(),
  fileSize: z.number().int().positive().optional(),
  mimeType: z.string().max(100).optional(),
});

export const createMemorySchema = z.object({
  type: memoryTypeSchema,
  url: z.string().url().optional(),
  title: z.string().min(1).max(500).optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  faviconUrl: z.string().url().optional(),
  previewImageUrl: z.string().url().optional(),
  keywords: z.array(z.string().max(50)).max(20).optional(),
  collectionIds: z.array(z.string().uuid()).max(50).optional(),
  tags: z.array(z.string().min(1).max(50)).max(30).optional(),
  attachments: z.array(attachmentInputSchema).max(10).optional(),
});

export const updateMemorySchema = z.object({
  title: z.string().min(1).max(500).optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  inTrash: z.boolean().optional(),
  collectionIds: z.array(z.string().uuid()).max(50).optional(),
  tags: z.array(z.string().min(1).max(50)).max(30).optional(),
  attachments: z.array(attachmentInputSchema).max(10).optional(),
});

export const listMemoriesQuerySchema = z.object({
  type: memoryTypeSchema.optional(),
  isFavorite: z.coerce.boolean().optional(),
  isArchived: z.coerce.boolean().optional(),
  inTrash: z.coerce.boolean().optional(),
  collectionId: z.string().uuid().optional(),
  tag: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type MemoryTypeInput = z.infer<typeof memoryTypeSchema>;
export type AttachmentInput = z.infer<typeof attachmentInputSchema>;
export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
export type ListMemoriesQuery = z.infer<typeof listMemoriesQuerySchema>;
