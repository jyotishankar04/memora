import type { Request, Response } from "express";
import { ApiResponse } from "../../../shared/response/api-response";
import type { CreateCouponInput, ListCouponsQuery, UpdateCouponInput } from "./coupons.schema";
import { createCoupon, getCouponRedemptions, listCoupons, updateCoupon } from "./coupons.service";

export class AdminCouponsController {
  static async list(req: Request, res: Response) {
    const query = req.query as unknown as ListCouponsQuery;
    const result = await listCoupons(query);
    res.status(200).json(ApiResponse.success(result.items, { page: result.page, limit: result.limit, total: result.total }));
  }

  static async create(req: Request, res: Response) {
    const coupon = await createCoupon(req.body as CreateCouponInput, req.user!.id, req.ip);
    res.status(201).json(ApiResponse.success(coupon));
  }

  static async update(req: Request, res: Response) {
    const coupon = await updateCoupon(req.params.id as string, req.body as UpdateCouponInput, req.user!.id, req.ip);
    res.status(200).json(ApiResponse.success(coupon));
  }

  static async redemptions(req: Request, res: Response) {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 20), 100);
    const result = await getCouponRedemptions(req.params.id as string, page, limit);
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
