import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/authenticate";
import { requireAdmin } from "../../../shared/middlewares/require-admin";
import { AdminReferralsController } from "./referrals.controller";
import { validateCreateReferralCode, validateListReferralCodes, validateUpdateReferralCode } from "./referrals.validator";

// Mounted at /admin/referrals by ../index.ts. Users' own self-serve codes
// (type: USER) are created lazily by modules/referrals; this only manages
// admin-issued creator/affiliate codes and views the funnel for any code.
const router = Router();

router.get("/codes", authenticate, requireAdmin, validateListReferralCodes, AdminReferralsController.list);
router.post("/codes", authenticate, requireAdmin, validateCreateReferralCode, AdminReferralsController.create);
router.patch("/codes/:id", authenticate, requireAdmin, validateUpdateReferralCode, AdminReferralsController.update);
router.get("/codes/:id/conversions", authenticate, requireAdmin, AdminReferralsController.conversions);

export default router;
