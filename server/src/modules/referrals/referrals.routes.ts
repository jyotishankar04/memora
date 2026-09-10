import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { ReferralsController } from "./referrals.controller";
import { validateTrackClick } from "./referrals.validator";

// Mounted at /referrals by routes/index.ts. Admin-issued codes + the
// conversion funnel view live in modules/admin/referrals, which imports
// this module's service functions rather than re-querying.
const router = Router();

router.get("/me", authenticate, ReferralsController.me);
router.post("/track-click", validateTrackClick, ReferralsController.trackClick);

export default router;
