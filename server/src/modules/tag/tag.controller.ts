import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { listTags } from "./tag.service";

export class TagController {
  static async list(req: Request, res: Response) {
    const tags = await listTags(req.user!.id);
    res.status(200).json(ApiResponse.success(tags));
  }
}
