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

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/settings", settingsRoutes);
router.use("/memories", memoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/tags", tagRoutes);
router.use("/uploads", uploadRoutes);
router.use("/ai", aiRoutes);

export default router;
