import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new AppError(`Unsupported file type: ${file.mimetype}`, 400, "UNSUPPORTED_FILE_TYPE"));
      return;
    }
    cb(null, true);
  },
}).single("file");

// Wraps multer so its own errors (file too large, etc.) come back through the
// shared {success,data,meta,error} envelope instead of multer's default shape.
export function handleUpload(req: Request, res: Response, next: NextFunction) {
  uploadSingle(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      return next(new AppError(err.message, 400, "UPLOAD_ERROR"));
    }
    if (err) {
      return next(err);
    }
    next();
  });
}
