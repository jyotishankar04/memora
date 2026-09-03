import { Router } from "express";
import healthRoutes from "../modules/health/health.route";
import authRoutes from "../modules/auth";
import userRoutes from "../modules/user";
import settingsRoutes from "../modules/settings";
import memoryRoutes from "../modules/memory";
import collectionRoutes from "../modules/collection";
import tagRoutes from "../modules/tag";
import uploadRoutes from "../modules/upload";
import aiRoutes from "../modules/ai";
import { adminRouter as featureFlagsAdminRoutes, publicRouter as featureFlagsPublicRoutes } from "../modules/feature-flags";
import aiUsageRoutes from "../modules/ai-usage";
import { adminRouter as announcementsAdminRoutes, publicRouter as announcementsPublicRoutes } from "../modules/announcements";
import adminRoutes from "../modules/admin";
import { maintenanceMode } from "../shared/middlewares/maintenance-mode";

const router = Router();

// Blocks non-admin traffic app-wide when maintenance mode is on. Runs before
// every route mount so it can gate all of them; bypasses /health, /admin,
// and /auth internally.
router.use(maintenanceMode);

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/settings", settingsRoutes);
router.use("/memories", memoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/tags", tagRoutes);
router.use("/uploads", uploadRoutes);
router.use("/ai", aiRoutes);
router.use("/admin/flags", featureFlagsAdminRoutes);
router.use("/admin/ai-usage", aiUsageRoutes);
router.use("/admin/announcements", announcementsAdminRoutes);
router.use("/announcements", announcementsPublicRoutes);
router.use("/maintenance", featureFlagsPublicRoutes);
router.use("/admin", adminRoutes);

export default router;
