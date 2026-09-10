import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { CreditsController } from "./credits.controller";

// Mounted at /credits by routes/index.ts. No spend/redemption endpoint yet —
// the ledger supports negative amounts whenever that's designed; nothing
// here invents one. Admin viewing/adjusting balances lives in
// modules/admin/credits, which imports credits.service directly.
const router = Router();

router.get("/me", authenticate, CreditsController.me);
router.get("/me/ledger", authenticate, CreditsController.myLedger);

export default router;
