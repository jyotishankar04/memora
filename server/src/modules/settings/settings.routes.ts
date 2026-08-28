import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { SettingsController } from "./settings.controller";
import { validateUpdateSettings } from "./settings.validator";

const router = Router();

router.get("/", authenticate, SettingsController.getSettings);
router.patch("/", authenticate, validateUpdateSettings, SettingsController.updateSettings);

export default router;
