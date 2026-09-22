import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { createPresignedUpload } from "./upload.service";

export class UploadController {
  static async presign(req: Request, res: Response) {
    const presigned = await createPresignedUpload(req.body);
    res.status(200).json(ApiResponse.success(presigned));
  }
}
