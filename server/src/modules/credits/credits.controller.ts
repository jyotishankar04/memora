import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { getBalance, listLedgerForUser } from "./credits.service";

export class CreditsController {
  static async me(req: Request, res: Response) {
    const balance = await getBalance(req.user!.id);
    res.status(200).json(ApiResponse.success({ balance }));
  }

  static async myLedger(req: Request, res: Response) {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const result = await listLedgerForUser(req.user!.id, page, limit);
    res.status(200).json(ApiResponse.success(result.items, { page: result.page, limit: result.limit, total: result.total }));
  }
}
