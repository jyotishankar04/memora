import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "../../db";
import { plans } from "../../db/schema";
import { PlanBillingInterval } from "../../db/enums";
import { AppError } from "../../shared/errors/app-error";
import { env } from "../../config/env";
import { logger } from "../../shared/utils/logger";
import { assignPlanToUser } from "../admin/billing/billing.service";
import { getStripeClient } from "./stripe-client";
import { getPolarClient, polarApiRequest } from "./polar-client";
import { polarConfig } from "../../config/polar";

export async function createCheckoutSession(userId: string, userEmail: string, planKey: string): Promise<{ url: string }> {
  const stripe = getStripeClient();
  if (!stripe) {
    throw new AppError("Billing isn't configured yet", 503, "BILLING_NOT_CONFIGURED");
  }

  const [plan] = await db.select().from(plans).where(eq(plans.key, planKey)).limit(1);
  if (!plan || !plan.isActive) {
    throw new AppError("Plan not found", 404, "NOT_FOUND");
  }

  if (plan.billingInterval === PlanBillingInterval.ONE_TIME) {
    throw new AppError("This plan can't be purchased through Checkout", 400, "UNSUPPORTED_PLAN");
  }

  // Dynamic price_data, computed fresh from the plans row every time —
  // deliberately NOT a stored Stripe Price id, which would go stale the
  // instant an admin edits priceMinor via /admin/plans (Stripe Prices are
  // immutable once created).
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: plan.currency,
          unit_amount: plan.priceMinor,
          product_data: { name: plan.name },
          recurring: { interval: plan.billingInterval === PlanBillingInterval.YEARLY ? "year" : "month" },
        },
        quantity: 1,
      },
    ],
    metadata: { userId, planId: plan.id },
    success_url: `${env.FRONTEND_URL}/app/settings/billing?checkout=success`,
    cancel_url: `${env.FRONTEND_URL}/app/settings/billing?checkout=cancelled`,
  });

  if (!session.url) {
    throw new AppError("Couldn't start checkout", 502, "CHECKOUT_SESSION_FAILED");
  }

  return { url: session.url };
}

/** Called by the webhook on checkout.session.completed. Reuses assignPlanToUser exactly as its own doc comment predicts — adminUserId: null marks this as automated. */
export async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;
  if (!userId || !planId) {
    logger.error({ sessionId: session.id }, "[billing] webhook missing metadata");
    return;
  }

  await assignPlanToUser(
    userId,
    {
      planId,
      amountMinor: session.amount_total ?? 0,
      provider: "stripe",
      providerRef: session.id,
    },
    null,
  );
}

/**
 * Create a Polar checkout session for a given plan.
 * Polar uses a hosted checkout — we generate the URL directly based on the plan key.
 */
export async function createPolarCheckoutSession(userId: string, userEmail: string, planKey: string): Promise<{ url: string }> {
  const polar = getPolarClient();
  if (!polar) {
    throw new AppError("Billing isn't configured yet", 503, "BILLING_NOT_CONFIGURED");
  }

  const [plan] = await db.select().from(plans).where(eq(plans.key, planKey)).limit(1);
  if (!plan || !plan.isActive) {
    throw new AppError("Plan not found", 404, "NOT_FOUND");
  }

  if (plan.billingInterval === PlanBillingInterval.ONE_TIME) {
    throw new AppError("This plan can't be purchased through Checkout", 400, "UNSUPPORTED_PLAN");
  }

  try {
    // For Polar, construct the checkout URL directly
    // The plan key is used as the product ID in Polar (must match what you created in Polar dashboard)
    // Polar checkout format: https://polar.sh/products/{productId}/checkout
    // For sandbox: https://sandbox.polar.sh/products/{productId}/checkout

    const checkoutBaseUrl = polarConfig.mode === "production"
      ? "https://polar.sh"
      : "https://sandbox.polar.sh";

    const checkoutUrl = new URL(`${checkoutBaseUrl}/products/${planKey}/checkout`);

    // Add query params for email and return URL
    checkoutUrl.searchParams.set("customerEmail", userEmail);
    checkoutUrl.searchParams.set("successUrl", `${env.FRONTEND_URL}/app/settings/billing?checkout=success&planKey=${planKey}&userId=${userId}&planId=${plan.id}`);
    checkoutUrl.searchParams.set("cancelUrl", `${env.FRONTEND_URL}/app/settings/billing?checkout=cancelled`);

    return { url: checkoutUrl.toString() };
  } catch (err) {
    logger.error({ err, planKey }, "[polar] checkout URL generation failed");
    throw new AppError("Couldn't start checkout", 502, "CHECKOUT_SESSION_FAILED");
  }
}

/**
 * Handle Polar webhook for subscription.created event.
 * When user completes payment in Polar, the webhook assigns the plan.
 */
export async function handlePolarSubscriptionCreated(event: {
  id: string;
  customer_email?: string;
  metadata?: Record<string, string>;
  product_price_id?: string;
  amount?: number;
}): Promise<void> {
  const userId = event.metadata?.userId;
  const planId = event.metadata?.planId;

  if (!userId || !planId) {
    logger.error({ eventId: event.id }, "[polar] webhook missing metadata");
    return;
  }

  // Verify plan exists
  const [plan] = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
  if (!plan) {
    logger.error({ eventId: event.id, planId }, "[polar] plan not found for subscription");
    return;
  }

  await assignPlanToUser(
    userId,
    {
      planId,
      amountMinor: event.amount ?? plan.priceMinor,
      provider: "polar",
      providerRef: event.id,
    },
    null,
  );
}
