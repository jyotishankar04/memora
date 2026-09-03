import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { requireAdmin } from "../../shared/middlewares/require-admin";
import { FeatureFlagsController } from "./feature-flags.controller";
import { validateUpdateFlag } from "./feature-flags.validator";

const router = Router();

router.get("/", authenticate, requireAdmin, FeatureFlagsController.list);
router.patch("/:key", authenticate, requireAdmin, validateUpdateFlag, FeatureFlagsController.update);

export default router;
