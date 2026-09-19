import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { env } from "../../config/env";
import { logger } from "../../shared/utils/logger";
import type { CreateCheckoutSessionInput } from "./billing.schema";
import { createCheckoutSession, handleCheckoutCompleted } from "./billing.service";
import { getStripeClient } from "./stripe-client";

export class BillingController {
  static async checkout(req: Request, res: Response) {
    const { planKey } = req.body as CreateCheckoutSessionInput;
    const result = await createCheckoutSession(req.user!.id, req.user!.email, planKey);
    res.status(200).json(ApiResponse.success(result));
  }

  static async webhook(req: Request, res: Response) {
    const stripe = getStripeClient();
    if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
      return res.status(503).json(ApiResponse.error("BILLING_NOT_CONFIGURED", "Billing isn't configured yet"));
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"] as string, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      logger.warn({ err }, "[billing] webhook signature verification failed");
      return res.status(400).json(ApiResponse.error("INVALID_SIGNATURE", "Webhook signature verification failed"));
    }

    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object);
    }

    res.status(200).json({ received: true });
  }
}
