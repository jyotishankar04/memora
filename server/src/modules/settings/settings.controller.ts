import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { getSettings, updateSettings } from "./settings.service";

export class SettingsController {
  static async getSettings(req: Request, res: Response) {
    const settings = await getSettings(req.user!.id);
    res.status(200).json(ApiResponse.success(settings));
  }

  static async updateSettings(req: Request, res: Response) {
    const settings = await updateSettings(req.user!.id, req.body);
    res.status(200).json(ApiResponse.success(settings));
  }
}
