import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import type { ApplyCouponInput } from "./coupons.schema";
import { applyCoupon } from "./coupons.service";

export class CouponsController {
  static async apply(req: Request, res: Response) {
    const { code } = req.body as ApplyCouponInput;
    const result = await applyCoupon(req.user!.id, code, req.ip);
    res.status(201).json(ApiResponse.success(result));
  }
}
