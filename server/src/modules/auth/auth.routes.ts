import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { oauthRateLimiter, refreshRateLimiter } from "../../shared/middlewares/rate-limit";
import { AuthController } from "./auth.controller";
import { validateGithubOAuth, validateGoogleOAuth, validateLogout, validateRefresh } from "./auth.validator";

const router = Router();

router.post("/oauth/google", oauthRateLimiter, validateGoogleOAuth, AuthController.googleCallback);
router.post("/oauth/github", oauthRateLimiter, validateGithubOAuth, AuthController.githubCallback);
router.post("/refresh", refreshRateLimiter, validateRefresh, AuthController.refresh);
router.post("/logout", authenticate, validateLogout, AuthController.logout);
router.get("/me", authenticate, AuthController.me);

export default router;
