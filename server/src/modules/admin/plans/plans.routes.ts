import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/authenticate";
import { requireAdmin } from "../../../shared/middlewares/require-admin";
import { AdminPlansController } from "./plans.controller";
import { validateCreatePlan, validateUpdatePlan } from "./plans.validator";

// Mounted at /admin/plans by ../index.ts. No delete route — plans are
// retired via isActive: false (updatePlan), never removed, since
// user_plan_assignments references them by id.
const router = Router();

router.get("/", authenticate, requireAdmin, AdminPlansController.list);
router.post("/", authenticate, requireAdmin, validateCreatePlan, AdminPlansController.create);
router.patch("/:id", authenticate, requireAdmin, validateUpdatePlan, AdminPlansController.update);

export default router;
