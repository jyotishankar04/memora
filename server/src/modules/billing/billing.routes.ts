import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { BillingController } from "./billing.controller";
import { validateCreateCheckoutSession } from "./billing.validator";

// Mounted at /billing by ../../routes/index.ts.
const router = Router();

router.post("/checkout", authenticate, validateCreateCheckoutSession, BillingController.checkout);
// No authenticate — Stripe calls this directly with no user session. Its
// body is the raw Buffer from app.ts's express.raw() mount on this exact
// path, required for signature verification.
router.post("/webhook", BillingController.webhook);

export default router;
