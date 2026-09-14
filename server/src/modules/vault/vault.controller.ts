import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { VAULT_TOKEN_COOKIE, clearVaultTokenCookie, setVaultTokenCookie } from "../../shared/utils/cookies";
import { signVaultToken, verifyVaultToken } from "../../shared/utils/jwt";
import { getVaultStatus, setVaultPin, verifyVaultPin } from "./vault.service";

export class VaultController {
  static async status(req: Request, res: Response) {
    const status = await getVaultStatus(req.user!.id);

    const token = req.cookies?.[VAULT_TOKEN_COOKIE];
    const payload = token ? verifyVaultToken(token) : null;
    const unlocked = Boolean(payload && payload.userId === req.user!.id);

    res.json(ApiResponse.success({ ...status, unlocked }));
  }

  static async setPin(req: Request, res: Response) {
    await setVaultPin(req.user!.id, req.body);
    res.status(204).send();
  }

  static async unlock(req: Request, res: Response) {
    const pv = await verifyVaultPin(req.user!.id, req.body.pin);
    setVaultTokenCookie(res, signVaultToken({ typ: "vault", userId: req.user!.id, pv }));
    res.json(ApiResponse.success({ unlocked: true }));
  }

  static async lock(_req: Request, res: Response) {
    clearVaultTokenCookie(res);
    res.status(204).send();
  }
}
