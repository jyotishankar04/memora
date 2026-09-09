import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/authenticate";
import { requireAdmin } from "../../../shared/middlewares/require-admin";
import { AdminCouponsController } from "./coupons.controller";
import { validateCreateCoupon, validateListCoupons, validateUpdateCoupon } from "./coupons.validator";

// Mounted at /admin/coupons by ../index.ts. No delete route — deactivate
// via isActive: false instead, since redemption history references the
// coupon by id (onDelete: "restrict").
const router = Router();

router.get("/", authenticate, requireAdmin, validateListCoupons, AdminCouponsController.list);
router.post("/", authenticate, requireAdmin, validateCreateCoupon, AdminCouponsController.create);
router.patch("/:id", authenticate, requireAdmin, validateUpdateCoupon, AdminCouponsController.update);
router.get("/:id/redemptions", authenticate, requireAdmin, AdminCouponsController.redemptions);

export default router;
