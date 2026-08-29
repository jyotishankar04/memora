import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { AppError } from "../../shared/errors/app-error";
import { uploadToStorage } from "./upload.service";

export class UploadController {
  static async create(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError("No file provided", 400, "BAD_REQUEST");
    }
    const uploaded = await uploadToStorage(req.file);
    res.status(201).json(ApiResponse.success(uploaded));
  }
}
