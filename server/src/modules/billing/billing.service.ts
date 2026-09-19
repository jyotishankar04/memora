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
