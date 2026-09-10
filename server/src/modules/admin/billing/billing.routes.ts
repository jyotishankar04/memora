import { Router } from "express";
import { authenticate } from "../../../shared/middlewares/authenticate";
import { requireAdmin } from "../../../shared/middlewares/require-admin";
import { AdminBillingController } from "./billing.controller";
import { validateAssignPlan, validateListAssignments, validateListTransactions, validateRevenueQuery } from "./billing.validator";

// Mounted at /admin/billing by ../index.ts.
const router = Router();

router.post("/users/:userId/assign-plan", authenticate, requireAdmin, validateAssignPlan, AdminBillingController.assignPlan);
router.get("/users/:userId/assignments", authenticate, requireAdmin, AdminBillingController.listUserAssignments);
router.get("/assignments", authenticate, requireAdmin, validateListAssignments, AdminBillingController.listAssignments);
router.patch("/assignments/:id/cancel", authenticate, requireAdmin, AdminBillingController.cancelAssignment);
router.get("/transactions", authenticate, requireAdmin, validateListTransactions, AdminBillingController.listTransactions);
router.get("/revenue", authenticate, requireAdmin, validateRevenueQuery, AdminBillingController.revenue);

export default router;
