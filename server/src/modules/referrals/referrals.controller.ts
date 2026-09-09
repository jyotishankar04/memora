import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import type { TrackClickInput } from "./referrals.schema";
import { getMyReferralStats, trackClick } from "./referrals.service";

export class ReferralsController {
  static async me(req: Request, res: Response) {
    const stats = await getMyReferralStats(req.user!.id);
    res.status(200).json(ApiResponse.success(stats));
  }

  static async trackClick(req: Request, res: Response) {
    const { code } = req.body as TrackClickInput;
    await trackClick(code);
    res.status(204).end();
  }
}
