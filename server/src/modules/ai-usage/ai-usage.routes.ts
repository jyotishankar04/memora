import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { requireAdmin } from "../../shared/middlewares/require-admin";
import { AiUsageController } from "./ai-usage.controller";
import { validateUsageByUser, validateUsageRange } from "./ai-usage.validator";

const router = Router();

router.get("/summary", authenticate, requireAdmin, validateUsageRange, AiUsageController.summary);
router.get("/by-user", authenticate, requireAdmin, validateUsageByUser, AiUsageController.byUser);
router.get("/users/:id", authenticate, requireAdmin, validateUsageRange, AiUsageController.forUser);

export default router;
