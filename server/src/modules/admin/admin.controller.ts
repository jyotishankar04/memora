import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import type { AnalyticsRangeQuery, AuditLogQuery, ListUsersQuery } from "./admin.schema";
import {
  getActiveUsers,
  getAuditLog,
  getContentGrowth,
  getSignupsOverTime,
  getUserDetail,
  listUsers,
  updateUserRoles,
  updateUserStatus,
} from "./admin.service";

export class AdminController {
  static async listUsers(req: Request, res: Response) {
    const query = req.query as unknown as ListUsersQuery;
    const result = await listUsers(query);
    res.status(200).json(ApiResponse.success(result.items, { page: result.page, limit: result.limit, total: result.total }));
  }

  static async getUser(req: Request, res: Response) {
    const user = await getUserDetail(req.params.id as string);
    res.status(200).json(ApiResponse.success(user));
  }

  static async updateRoles(req: Request, res: Response) {
    const result = await updateUserRoles(req.params.id as string, req.body, req.user!.id, req.ip);
    res.status(200).json(ApiResponse.success(result));
  }

  static async updateStatus(req: Request, res: Response) {
    const result = await updateUserStatus(req.params.id as string, req.body, req.user!.id, req.ip);
    res.status(200).json(ApiResponse.success(result));
  }

  static async signupsOverTime(req: Request, res: Response) {
    const query = req.query as unknown as AnalyticsRangeQuery;
    const data = await getSignupsOverTime(query);
    res.status(200).json(ApiResponse.success(data));
  }

  static async activeUsers(req: Request, res: Response) {
    const query = req.query as unknown as AnalyticsRangeQuery;
    const data = await getActiveUsers(query);
    res.status(200).json(ApiResponse.success(data));
  }

  static async contentGrowth(req: Request, res: Response) {
    const query = req.query as unknown as AnalyticsRangeQuery;
    const data = await getContentGrowth(query);
    res.status(200).json(ApiResponse.success(data));
  }

  static async auditLog(req: Request, res: Response) {
    const query = req.query as unknown as AuditLogQuery;
    const result = await getAuditLog(query);
    res.status(200).json(ApiResponse.success(result.items, { page: result.page, limit: result.limit, total: result.total }));
  }
}
