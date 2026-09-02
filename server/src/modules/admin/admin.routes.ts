import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { requireAdmin } from "../../shared/middlewares/require-admin";
import { AdminController } from "./admin.controller";
import {
  validateAnalyticsRange,
  validateAuditLogQuery,
  validateListUsers,
  validateUpdateUserRoles,
  validateUpdateUserStatus,
} from "./admin.validator";

const router = Router();

router.get("/users", authenticate, requireAdmin, validateListUsers, AdminController.listUsers);
router.get("/users/:id", authenticate, requireAdmin, AdminController.getUser);
router.patch("/users/:id/roles", authenticate, requireAdmin, validateUpdateUserRoles, AdminController.updateRoles);
router.patch("/users/:id/status", authenticate, requireAdmin, validateUpdateUserStatus, AdminController.updateStatus);

router.get("/analytics/signups", authenticate, requireAdmin, validateAnalyticsRange, AdminController.signupsOverTime);
router.get("/analytics/active-users", authenticate, requireAdmin, validateAnalyticsRange, AdminController.activeUsers);
router.get("/analytics/content-growth", authenticate, requireAdmin, validateAnalyticsRange, AdminController.contentGrowth);

router.get("/audit-log", authenticate, requireAdmin, validateAuditLogQuery, AdminController.auditLog);

export default router;
