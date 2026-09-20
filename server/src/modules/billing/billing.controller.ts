import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { env } from "../../config/env";
import { logger } from "../../shared/utils/logger";
import type { CreateCheckoutSessionInput } from "./billing.schema";
import { createCheckoutSession, handleCheckoutCompleted, createPolarCheckoutSession, handlePolarSubscriptionCreated } from "./billing.service";
import { getStripeClient } from "./stripe-client";
import { verifyPolarWebhookSignature } from "./polar-client";

export class BillingController {
  static async checkout(req: Request, res: Response) {
    const { planKey } = req.body as CreateCheckoutSessionInput;

    // Try Polar first if configured, fall back to Stripe
    let result;
    if (env.POLAR_SECRET_KEY && env.POLAR_PUBLISHABLE_KEY) {
      result = await createPolarCheckoutSession(req.user!.id, req.user!.email, planKey);
    } else {
      result = await createCheckoutSession(req.user!.id, req.user!.email, planKey);
    }

    res.status(200).json(ApiResponse.success(result));
  }

  static async webhook(req: Request, res: Response) {
    // Detect webhook provider by signature header
    const stripeSignature = req.headers["stripe-signature"];
    const polarSignature = req.headers["polar-signature"];

    // Handle Stripe webhook
    if (stripeSignature) {
      const stripe = getStripeClient();
      if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
        return res.status(503).json(ApiResponse.error("BILLING_NOT_CONFIGURED", "Billing isn't configured yet"));
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, stripeSignature as string, env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        logger.warn({ err }, "[stripe] webhook signature verification failed");
        return res.status(400).json(ApiResponse.error("INVALID_SIGNATURE", "Webhook signature verification failed"));
      }

      if (event.type === "checkout.session.completed") {
        await handleCheckoutCompleted(event.data.object);
      }

      return res.status(200).json({ received: true });
    }

    // Handle Polar webhook
    if (polarSignature) {
      if (!env.POLAR_WEBHOOK_SECRET) {
        return res.status(503).json(ApiResponse.error("BILLING_NOT_CONFIGURED", "Billing isn't configured yet"));
      }

      // Get raw body for signature verification (Polar requires raw body string)
      const rawBody = req.body instanceof Buffer ? req.body.toString() : JSON.stringify(req.body);

      if (!verifyPolarWebhookSignature(rawBody, polarSignature as string)) {
        logger.warn("[polar] webhook signature verification failed");
        return res.status(400).json(ApiResponse.error("INVALID_SIGNATURE", "Webhook signature verification failed"));
      }

      const event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      if (event.type === "subscription.created") {
        await handlePolarSubscriptionCreated(event.data);
      }

      return res.status(200).json({ received: true });
    }

    // Unknown webhook provider
    logger.warn({ headers: req.headers }, "[billing] webhook with no recognized signature");
    return res.status(400).json(ApiResponse.error("UNKNOWN_PROVIDER", "Unable to determine webhook provider"));
  }
}
