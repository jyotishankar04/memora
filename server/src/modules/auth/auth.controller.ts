import crypto from "node:crypto";
import type { Request, Response } from "express";
import { env } from "../../config/env";
import { ApiResponse } from "../../shared/response/api-response";
import { getClientIp } from "../../shared/utils/device-fingerprint";
import {
  OAUTH_STATE_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  clearOAuthStateCookie,
  setAuthCookies,
  setOAuthStateCookie,
} from "../../shared/utils/cookies";
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

async function handleOAuthCallback(req: Request, res: Response, exchangeCode: (code: string) => Promise<OAuthProfile>) {
  const cookieState = req.cookies?.[OAUTH_STATE_COOKIE];
  clearOAuthStateCookie(res);

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
    }

    const userWithRoles = await getUserWithRoles(user.id);
    const tokens = await issueTokenPair(
      user,
      userWithRoles.roles,
      getClientIp(req),
      req.headers["user-agent"] ?? "",
    );

    setAuthCookies(res, tokens);
    res.redirect(`${env.FRONTEND_URL}${userWithRoles.onboardingCompleted ? "/app" : "/onboard"}`);
  } catch {
    res.redirect(loginUrl("oauth_failed"));
  }
}

export class AuthController {
  static initiateGoogle(_req: Request, res: Response) {
    const state = crypto.randomUUID();
    setOAuthStateCookie(res, state);
    res.redirect(buildGoogleAuthUrl(state));
  }

  static initiateGithub(_req: Request, res: Response) {
    const state = crypto.randomUUID();
    setOAuthStateCookie(res, state);
    res.redirect(buildGithubAuthUrl(state));
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
