import type { Request, Response } from "express";
import { ApiResponse } from "../../../shared/response/api-response";
import type { CreateReferralCodeInput, ListReferralCodesQuery, UpdateReferralCodeInput } from "./referrals.schema";
import { createAdminReferralCode, getReferralCodeConversions, listReferralCodes, updateReferralCode } from "./referrals.service";

export class AdminReferralsController {
  static async list(req: Request, res: Response) {
    const query = req.query as unknown as ListReferralCodesQuery;
    const result = await listReferralCodes(query);
    res.status(200).json(ApiResponse.success(result.items, { page: result.page, limit: result.limit, total: result.total }));
  }

  static async create(req: Request, res: Response) {
    const code = await createAdminReferralCode(req.body as CreateReferralCodeInput, req.user!.id, req.ip);
    res.status(201).json(ApiResponse.success(code));
  }

  static async update(req: Request, res: Response) {
    const code = await updateReferralCode(req.params.id as string, req.body as UpdateReferralCodeInput, req.user!.id, req.ip);
    res.status(200).json(ApiResponse.success(code));
  }

  static async conversions(req: Request, res: Response) {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const result = await getReferralCodeConversions(req.params.id as string, page, limit);
    res.status(200).json(
      ApiResponse.success(result.items, {
        page: result.page,
        limit: result.limit,
        appliedCount: result.appliedCount,
        convertedCount: result.convertedCount,
      }),
    );
  }
}
