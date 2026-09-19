import crypto from "node:crypto";
import type { Request, Response } from "express";
import { env } from "../../config/env";
import { ApiResponse } from "../../shared/response/api-response";
import { AppError } from "../../shared/errors/app-error";
import { getClientIp } from "../../shared/utils/device-fingerprint";
import { isProviderEnabled, isSignupsEnabled } from "../feature-flags/feature-flags.service";
import {
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  REFERRAL_CODE_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  clearOAuthNextCookie,
  clearOAuthStateCookie,
  clearReferralCodeCookie,
  setAuthCookies,
  setOAuthNextCookie,
  setOAuthStateCookie,
  setReferralCodeCookie,
} from "../../shared/utils/cookies";
import { recordReferralSignup } from "../referrals/referrals.service";
import { claimPendingGrantsForEmail } from "../share/share.service";
import { sendEmail } from "../email";
import { EmailCategory, EmailTemplateKey } from "../../db/enums";
import { welcomeEmailTemplate } from "../../shared/mailer/templates";
import {
  assignDefaultRole,
  buildGithubAuthUrl,
  buildGoogleAuthUrl,
  exchangeGithubCode,
  exchangeGoogleCode,
  findOrCreateUser,
  getUserWithRoles,
  issueTokenPair,
  revokeRefreshToken,
  rotateRefreshToken,
  type OAuthProfile,
} from "./auth.service";

function loginUrl(error: string): string {
  return `${env.FRONTEND_URL}/auth/login?error=${error}`;
}

/**
 * Where to send someone after sign-in, when they arrived from a shared
 * link ("sign in to view this").
 *
 * The allowlist is intentionally one exact shape — a shared-link path and
 * nothing else. This value comes in on a query string that is reachable
 * straight from an invite email, so anything looser is an open redirect
 * with a credible delivery mechanism attached. Rejecting rather than
 * sanitizing keeps that impossible to get subtly wrong: no protocol-relative
 * "//evil.com", no "/app/settings", no encoded traversal.
 */
const SAFE_NEXT_PATH = /^\/s\/[A-Za-z0-9_-]{1,32}$/;

export function sanitizeNextPath(next: unknown): string | null {
  return typeof next === "string" && SAFE_NEXT_PATH.test(next) ? next : null;
}

async function handleOAuthCallback(req: Request, res: Response, exchangeCode: (code: string) => Promise<OAuthProfile>) {
  const cookieState = req.cookies?.[OAUTH_STATE_COOKIE];
  const referralCode = req.cookies?.[REFERRAL_CODE_COOKIE] as string | undefined;
  // Re-validated on the way out as well as on the way in: the cookie is
  // ours and httpOnly, but the redirect is the dangerous side, so the check
  // belongs where the value is used.
  const nextPath = sanitizeNextPath(req.cookies?.[OAUTH_NEXT_COOKIE]);
  clearOAuthStateCookie(res);
  clearReferralCodeCookie(res);
  clearOAuthNextCookie(res);

  const { code, state, error: providerError } = req.query as { code?: string; state?: string; error?: string };

  if (providerError) {
    return res.redirect(loginUrl("oauth_denied"));
  }
  if (!code || !state || !cookieState || state !== cookieState) {
    return res.redirect(loginUrl("oauth_invalid_state"));
  }

  try {
    const profile = await exchangeCode(code);
    const { user, isNewUser } = await findOrCreateUser(profile);

    if (isNewUser) {
      await assignDefaultRole(user.id);
      // Never blocks/fails the signup itself — same fire-and-forget shape
      // as recordReferralSignup right below.
      const { subject, html } = welcomeEmailTemplate({ name: user.name });
      sendEmail({
        to: user.email,
        recipientUserId: user.id,
        category: EmailCategory.TRANSACTIONAL,
        templateKey: EmailTemplateKey.WELCOME,
        subject,
        html,
      }).catch(() => {});
      // Never blocks/fails the signup itself — an unknown, expired, or
      // missing code just means no attribution, same "attach if present"
      // shape as everything else in this callback.
      if (referralCode) {
        await recordReferralSignup(referralCode, user.id).catch(() => {});
      }
    }

    // Runs on every login, not just signup: an invite that arrives between
    // account creation and this point would otherwise sit pending until the
    // next sign-in. Only claims grants when the provider vouched for the
    // email — see claimPendingGrantsForEmail.
    await claimPendingGrantsForEmail(user.id, user.email, user.emailVerified).catch(() => {});

    const userWithRoles = await getUserWithRoles(user.id);
    const tokens = await issueTokenPair(
      user,
      userWithRoles.roles,
      getClientIp(req),
      req.headers["user-agent"] ?? "",
    );

    setAuthCookies(res, tokens);

    // Onboarding still comes first for a new account, but carries the
    // destination through so an invited user finishes on the thing they
    // were invited to rather than a generic dashboard.
    const destination = userWithRoles.onboardingCompleted
      ? (nextPath ?? "/app")
      : `/onboard${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`;

    res.redirect(`${env.FRONTEND_URL}${destination}`);
  } catch {
    res.redirect(loginUrl("oauth_failed"));
  }
}

export class AuthController {
  static async initiateGoogle(req: Request, res: Response) {
    if (!(await isProviderEnabled("google"))) {
      throw new AppError("Google sign-in is currently disabled", 403, "PROVIDER_DISABLED");
    }
    const state = crypto.randomUUID();
    setOAuthStateCookie(res, state);
    const ref = req.query.ref as string | undefined;
    if (ref) setReferralCodeCookie(res, ref);
    const next = sanitizeNextPath(req.query.next);
    if (next) setOAuthNextCookie(res, next);
    res.redirect(buildGoogleAuthUrl(state));
  }

  static async initiateGithub(req: Request, res: Response) {
    if (!(await isProviderEnabled("github"))) {
      throw new AppError("GitHub sign-in is currently disabled", 403, "PROVIDER_DISABLED");
    }
    const state = crypto.randomUUID();
    setOAuthStateCookie(res, state);
    const ref = req.query.ref as string | undefined;
    if (ref) setReferralCodeCookie(res, ref);
    const next = sanitizeNextPath(req.query.next);
    if (next) setOAuthNextCookie(res, next);
    res.redirect(buildGithubAuthUrl(state));
  }

  static async providers(_req: Request, res: Response) {
    const [google, github, signupsEnabled] = await Promise.all([
      isProviderEnabled("google"),
      isProviderEnabled("github"),
      isSignupsEnabled(),
    ]);
    res.status(200).json(ApiResponse.success({ google, github, signupsEnabled }));
  }

  static async googleCallback(req: Request, res: Response) {
    await handleOAuthCallback(req, res, exchangeGoogleCode);
  }

  static async githubCallback(req: Request, res: Response) {
    await handleOAuthCallback(req, res, exchangeGithubCode);
  }

  static async refresh(req: Request, res: Response) {
    const rawRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!rawRefreshToken) {
      return res.status(401).json(ApiResponse.error("UNAUTHORIZED", "Not authenticated"));
    }

    const tokens = await rotateRefreshToken(rawRefreshToken, getClientIp(req), req.headers["user-agent"] ?? "");
    setAuthCookies(res, tokens);
    res.status(200).json(ApiResponse.success({ message: "Token refreshed" }));
  }

  static async logout(req: Request, res: Response) {
    const rawRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (rawRefreshToken) {
      try {
        await revokeRefreshToken(rawRefreshToken, req.user!.id);
      } catch {
        // already revoked or unknown — logout is idempotent either way
      }
    }
    clearAuthCookies(res);
    res.status(200).json(ApiResponse.success({ message: "Logged out successfully" }));
  }

  static async me(req: Request, res: Response) {
    const user = await getUserWithRoles(req.user!.id);
    res.status(200).json(ApiResponse.success({ user }));
  }
}
