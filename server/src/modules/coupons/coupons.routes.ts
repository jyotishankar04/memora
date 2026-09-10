import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { CouponsController } from "./coupons.controller";
import { validateApplyCoupon } from "./coupons.validator";

// Mounted at /coupons by routes/index.ts. Admin CRUD + the redemption
// funnel view live in modules/admin/coupons, which imports this module's
// service functions rather than re-querying.
const router = Router();

router.post("/apply", authenticate, validateApplyCoupon, CouponsController.apply);

export default router;
