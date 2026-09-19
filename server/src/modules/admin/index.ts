import { Router } from "express";
import usersRoutes from "./users/users.routes";
import analyticsRoutes from "./analytics/analytics.routes";
import auditLogRoutes from "./audit-log/audit-log.routes";
import plansRoutes from "./plans/plans.routes";
import creditsRoutes from "./credits/credits.routes";
import couponsRoutes from "./coupons/coupons.routes";
import referralsRoutes from "./referrals/referrals.routes";
import billingRoutes from "./billing/billing.routes";
import emailRoutes from "./email/email.routes";

// Aggregates every admin sub-module onto one router, mounted at /api/v1/admin
// by ../../routes/index.ts. Each sub-module owns its own routes/controller/
// service/schema/validator files and is mounted at its own sub-path here —
// add a new admin surface by adding one more `router.use(...)` line, not by
// touching any existing sub-module.
const router = Router();

router.use("/users", usersRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/audit-log", auditLogRoutes);
router.use("/plans", plansRoutes);
router.use("/credits", creditsRoutes);
router.use("/coupons", couponsRoutes);
router.use("/referrals", referralsRoutes);
router.use("/billing", billingRoutes);
router.use("/emails", emailRoutes);

export default router;
