import type { Request, Response } from "express";
import { ApiResponse } from "../../../shared/response/api-response";
import type { AdjustCreditsInput } from "./credits.schema";
import { adjustUserCredits, getUserCreditDetail } from "./credits.service";

export class AdminCreditsController {
  static async getUserDetail(req: Request, res: Response) {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const detail = await getUserCreditDetail(req.params.userId as string, page, limit);
    res.status(200).json(ApiResponse.success(detail));
  }

  static async adjust(req: Request, res: Response) {
    const entry = await adjustUserCredits(req.params.userId as string, req.body as AdjustCreditsInput, req.user!.id, req.ip);
    res.status(201).json(ApiResponse.success(entry));
  }
}
