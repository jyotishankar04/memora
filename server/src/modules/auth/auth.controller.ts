import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { getClientIp } from "../../shared/utils/device-fingerprint";
import {
  assignDefaultRole,
  exchangeGithubCode,
  exchangeGoogleCode,
  findOrCreateUser,
  getUserWithRoles,
  issueTokenPair,
  revokeRefreshToken,
  rotateRefreshToken,
} from "./auth.service";

async function handleOAuthCallback(
  req: Request,
  res: Response,
  exchangeCode: (code: string, redirectUri: string) => ReturnType<typeof exchangeGoogleCode>,
) {
  const { code, redirectUri } = req.body as { code: string; redirectUri: string };

  const profile = await exchangeCode(code, redirectUri);
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

  res.status(isNewUser ? 201 : 200).json(ApiResponse.success({ user: userWithRoles, tokens, isNewUser }));
}

export class AuthController {
  static async googleCallback(req: Request, res: Response) {
    await handleOAuthCallback(req, res, exchangeGoogleCode);
  }

  static async githubCallback(req: Request, res: Response) {
    await handleOAuthCallback(req, res, exchangeGithubCode);
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body as { refreshToken: string };
    const tokens = await rotateRefreshToken(refreshToken, getClientIp(req), req.headers["user-agent"] ?? "");
    res.status(200).json(ApiResponse.success({ tokens }));
  }

  static async logout(req: Request, res: Response) {
    const { refreshToken } = req.body as { refreshToken: string };
    await revokeRefreshToken(refreshToken, req.user!.id);
    res.status(200).json(ApiResponse.success({ message: "Logged out successfully" }));
  }

  static async me(req: Request, res: Response) {
    const user = await getUserWithRoles(req.user!.id);
    res.status(200).json(ApiResponse.success({ user }));
  }
}
