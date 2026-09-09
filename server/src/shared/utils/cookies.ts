import type { Response } from "express";
import { env } from "../../config/env";
import { parseDurationMs } from "./duration";

export const ACCESS_TOKEN_COOKIE = "memora_access_token";
export const REFRESH_TOKEN_COOKIE = "memora_refresh_token";
export const OAUTH_STATE_COOKIE = "memora_oauth_state";
export const REFERRAL_CODE_COOKIE = "memora_referral_code";

const AUTH_PATH = "/api/v1/auth";

const baseCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
  res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseCookieOptions,
    path: "/",
    maxAge: parseDurationMs(env.JWT_ACCESS_EXPIRES_IN),
  });

  // Scoped to /auth so the refresh token isn't sent on every ordinary API request.
  res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseCookieOptions,
    path: AUTH_PATH,
    maxAge: parseDurationMs(env.JWT_REFRESH_EXPIRES_IN),
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, { ...baseCookieOptions, path: "/" });
  res.clearCookie(REFRESH_TOKEN_COOKIE, { ...baseCookieOptions, path: AUTH_PATH });
}

export function setOAuthStateCookie(res: Response, state: string) {
  res.cookie(OAUTH_STATE_COOKIE, state, {
    ...baseCookieOptions,
    path: AUTH_PATH,
    maxAge: 10 * 60 * 1000,
  });
}

export function clearOAuthStateCookie(res: Response) {
  res.clearCookie(OAUTH_STATE_COOKIE, { ...baseCookieOptions, path: AUTH_PATH });
}

// Set when /auth/google or /auth/github is hit with a ?ref=CODE query param
// (the client is expected to carry a referral code it captured from the
// landing page through to the "sign in" link), read back in the OAuth
// callback to attribute a new signup — see referrals.service.ts's
// recordReferralSignup. 30 days, not 10 minutes like the state cookie: a
// referral click can precede signup by a lot more than one OAuth round trip.
export function setReferralCodeCookie(res: Response, code: string) {
  res.cookie(REFERRAL_CODE_COOKIE, code, {
    ...baseCookieOptions,
    path: AUTH_PATH,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearReferralCodeCookie(res: Response) {
  res.clearCookie(REFERRAL_CODE_COOKIE, { ...baseCookieOptions, path: AUTH_PATH });
}
