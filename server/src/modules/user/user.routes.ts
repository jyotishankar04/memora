import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { UserController } from "./user.controller";
import { validateCompleteOnboarding, validateUpdateProfile } from "./user.validator";

const router = Router();

router.patch("/me", authenticate, validateUpdateProfile, UserController.updateProfile);
router.post("/me/onboarding", authenticate, validateCompleteOnboarding, UserController.completeOnboarding);

export default router;
