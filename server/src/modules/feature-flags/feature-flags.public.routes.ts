import { Router } from "express";
import { FeatureFlagsController } from "./feature-flags.controller";

const router = Router();

// No auth — read by every client to decide whether to render its maintenance UI.
router.get("/status", FeatureFlagsController.maintenanceStatus);

export default router;
