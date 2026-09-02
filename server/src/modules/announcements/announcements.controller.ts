import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { logAdminAction } from "../../shared/utils/audit-log";
import {
  createAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncement,
  listAnnouncements,
  updateAnnouncement,
} from "./announcements.service";

export class AnnouncementsController {
  static async list(_req: Request, res: Response) {
    const data = await listAnnouncements();
    res.status(200).json(ApiResponse.success(data));
  }

  static async create(req: Request, res: Response) {
    const row = await createAnnouncement(req.body, req.user!.id);

    await logAdminAction({
      adminUserId: req.user!.id,
      action: "announcement.created",
      targetType: "announcement",
      targetId: row.id,
      afterValue: row,
      ipAddress: req.ip,
    });

    res.status(201).json(ApiResponse.success(row));
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const { before, after } = await updateAnnouncement(id, req.body);

    await logAdminAction({
      adminUserId: req.user!.id,
      action: "announcement.updated",
      targetType: "announcement",
      targetId: id,
      beforeValue: before,
      afterValue: after,
      ipAddress: req.ip,
    });

    res.status(200).json(ApiResponse.success(after));
  }

  static async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    const row = await deleteAnnouncement(id);

    await logAdminAction({
      adminUserId: req.user!.id,
      action: "announcement.deleted",
      targetType: "announcement",
      targetId: id,
      beforeValue: row,
      ipAddress: req.ip,
    });

    res.status(200).json(ApiResponse.success({ id: row.id }));
  }

  static async active(_req: Request, res: Response) {
    const row = await getActiveAnnouncement();
    res.status(200).json(ApiResponse.success(row));
  }
}
