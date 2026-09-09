import type { Request, Response } from "express";
import { ApiResponse } from "../../../shared/response/api-response";
import type { AssignPlanInput, ListTransactionsQuery, RevenueQuery } from "./billing.schema";
import { assignPlanToUser, cancelAssignment, getRevenueRollup, listAssignmentsForUser, listTransactions } from "./billing.service";

export class AdminBillingController {
  static async assignPlan(req: Request, res: Response) {
    const result = await assignPlanToUser(req.params.userId as string, req.body as AssignPlanInput, req.user!.id, req.ip);
    res.status(201).json(ApiResponse.success(result));
  }

  static async cancelAssignment(req: Request, res: Response) {
    const assignment = await cancelAssignment(req.params.id as string, req.user!.id, req.ip);
    res.status(200).json(ApiResponse.success(assignment));
  }

  static async listUserAssignments(req: Request, res: Response) {
    const items = await listAssignmentsForUser(req.params.userId as string);
    res.status(200).json(ApiResponse.success(items));
  }

  static async listTransactions(req: Request, res: Response) {
    const query = req.query as unknown as ListTransactionsQuery;
    const result = await listTransactions(query);
    res.status(200).json(ApiResponse.success(result.items, { page: result.page, limit: result.limit, total: result.total }));
  }

  static async revenue(req: Request, res: Response) {
    const query = req.query as unknown as RevenueQuery;
    const data = await getRevenueRollup(query);
    res.status(200).json(ApiResponse.success(data));
  }
}
