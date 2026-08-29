import { z } from "zod";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "./upload.constants";

export const presignUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().refine((value) => ALLOWED_MIME_TYPES.has(value), {
    message: `mimeType must be one of: ${[...ALLOWED_MIME_TYPES].join(", ")}`,
  }),
  fileSize: z
    .number()
    .int()
    .positive()
    .max(MAX_FILE_SIZE_BYTES, `fileSize must not exceed ${MAX_FILE_SIZE_BYTES} bytes`),
});

export type PresignUploadInput = z.infer<typeof presignUploadSchema>;
