import { env } from "./env";

export const polarConfig = {
  secretKey: env.POLAR_SECRET_KEY,
  publishableKey: env.POLAR_PUBLISHABLE_KEY,
  mode: env.POLAR_MODE,
  webhookSecret: env.POLAR_WEBHOOK_SECRET,
  isConfigured: !!(env.POLAR_SECRET_KEY && env.POLAR_PUBLISHABLE_KEY),
};

/**
 * Polar API base URL depends on mode.
 * Sandbox: https://sandbox-api.polar.sh
 * Production: https://api.polar.sh
 */
export const getPolarApiUrl = () => {
  return polarConfig.mode === "production" ? "https://api.polar.sh" : "https://sandbox-api.polar.sh";
};

/**
 * Polar Checkout URLs (where users complete payment).
 * Sandbox: https://sandbox.polar.sh
 * Production: https://polar.sh
 */
export const getPolarCheckoutUrl = () => {
  return polarConfig.mode === "production" ? "https://polar.sh" : "https://sandbox.polar.sh";
};
