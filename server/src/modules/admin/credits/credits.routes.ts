import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/authenticate";
import { requireAdmin } from "../../../shared/middlewares/require-admin";
import { AdminCreditsController } from "./credits.controller";
import { validateAdjustCredits } from "./credits.validator";

// Mounted at /admin/credits by ../index.ts.
const router = Router();

router.get("/users/:userId", authenticate, requireAdmin, AdminCreditsController.getUserDetail);
router.post("/users/:userId/adjust", authenticate, requireAdmin, validateAdjustCredits, AdminCreditsController.adjust);

export default router;
