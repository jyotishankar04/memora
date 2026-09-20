import { polarConfig } from "../../config/polar";

/**
 * Polar SDK client. Returns null if not configured (missing keys).
 * Used for creating checkout sessions and verifying webhooks.
 */
export function getPolarClient() {
  if (!polarConfig.isConfigured) {
    return null;
  }

  // Polar SDK/API client would be initialized here
  // For now, we'll use direct HTTP requests via fetch
  // In production, install @polar-sh/sdk and use:
  // return new Polar({ accessToken: polarConfig.secretKey });

  return polarConfig;
}

/**
 * Make an authenticated request to Polar API.
 * Used for creating checkout sessions and other API operations.
 */
export async function polarApiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: Record<string, unknown>
) {
  if (!polarConfig.isConfigured) {
    throw new Error("Polar is not configured");
  }

  const apiUrl = polarConfig.mode === "production" ? "https://api.polar.sh" : "https://sandbox-api.polar.sh";
  const url = `${apiUrl}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${polarConfig.secretKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Polar API error: ${response.status} ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Verify Polar webhook signature using HMAC-SHA256.
 * Polar sends the signature in the 'Polar-Signature' header.
 */
export function verifyPolarWebhookSignature(body: string, signature: string): boolean {
  if (!polarConfig.webhookSecret) {
    return false;
  }

  const crypto = require("crypto");
  const computed = crypto.createHmac("sha256", polarConfig.webhookSecret).update(body).digest("hex");
  return computed === signature;
}
