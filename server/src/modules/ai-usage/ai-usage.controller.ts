import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import type { UsageByUserQuery, UsageRangeQuery } from "./ai-usage.schema";
import { getUsageByUser, getUsageForUser, getUsageSummary } from "./ai-usage.service";

export class AiUsageController {
  static async summary(req: Request, res: Response) {
    const query = req.query as unknown as UsageRangeQuery;
    const data = await getUsageSummary(query);
    res.status(200).json(ApiResponse.success(data));
  }

  static async byUser(req: Request, res: Response) {
    const query = req.query as unknown as UsageByUserQuery;
    const result = await getUsageByUser(query);
    res.status(200).json(ApiResponse.success(result.items, { page: result.page, limit: result.limit, total: result.total }));
  }

  static async forUser(req: Request, res: Response) {
    const query = req.query as unknown as UsageRangeQuery;
    const data = await getUsageForUser(req.params.id as string, query);
    res.status(200).json(ApiResponse.success(data));
  }
}
