import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { MemoryController } from "./memory.controller";
import {
  validateBrowserCapture,
  validateCreateMemory,
  validateListMemories,
  validateUpdateMemory,
} from "./memory.validator";

const router = Router();

router.get("/", authenticate, validateListMemories, MemoryController.list);
router.post("/", authenticate, validateCreateMemory, MemoryController.create);
// Must come before "/:id" — otherwise Express matches these as :id="export"/"graph".
router.get("/export", authenticate, MemoryController.exportAll);
router.get("/graph", authenticate, MemoryController.graph);
router.get("/:id", authenticate, MemoryController.get);
router.patch("/:id", authenticate, validateUpdateMemory, MemoryController.update);
router.delete("/:id", authenticate, MemoryController.remove);

router.post("/:id/browser-capture", authenticate, validateBrowserCapture, MemoryController.browserCapture);
router.post("/:id/refresh-preview", authenticate, MemoryController.refreshPreview);
router.get("/:id/processing-status", authenticate, MemoryController.processingStatus);

export default router;
