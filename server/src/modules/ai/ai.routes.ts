import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { AiController } from "./ai.controller";
import { validateAsk, validateCreateThread, validateThreadIdParams } from "./ai.validator";

const router = Router();

router.post("/threads", authenticate, validateCreateThread, AiController.createThread);
router.get("/threads", authenticate, AiController.listThreads);
router.get("/threads/:id/messages", authenticate, validateThreadIdParams, AiController.getThreadMessages);
router.post("/threads/:id/ask", authenticate, validateThreadIdParams, validateAsk, AiController.ask);

export default router;
