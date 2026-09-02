import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { logAdminAction } from "../../shared/utils/audit-log";
import { listFlags, updateFlag } from "./feature-flags.service";

export class FeatureFlagsController {
  static async list(_req: Request, res: Response) {
    const flags = await listFlags();
    res.status(200).json(ApiResponse.success(flags));
  }

  static async update(req: Request, res: Response) {
    const key = req.params.key as string;
    const { before, after } = await updateFlag(key, req.body, req.user!.id);

    await logAdminAction({
      adminUserId: req.user!.id,
      action: "flag.updated",
      targetType: "feature_flag",
      targetId: key,
      beforeValue: before ?? null,
      afterValue: after,
      ipAddress: req.ip,
    });

    res.status(200).json(ApiResponse.success(after));
  }
}
