import Stripe from "stripe";
import { env } from "../../config/env";

let client: Stripe | null | undefined;

/** Null when STRIPE_SECRET_KEY is unset — billing is simply not configured, not an error. Mirrors getLangfuseHandler's exact nullable-return degrade pattern. Memoized since constructing a Stripe client is cheap but pointless to repeat per call. */
export function getStripeClient(): Stripe | null {
  if (client !== undefined) return client;
  client = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;
  return client;
}
