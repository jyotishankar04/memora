import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { BatchController } from "./batch.controller";
import {
  validateBatchTag,
  validateBatchMove,
  validateBatchDelete,
  validateBatchRestore,
  validateBatchUpdateStatus,
} from "./batch.validator";

const router = Router();

// Batch operations for memories — all POST since they're state-changing.
// /api/v1/batch/memories/...
router.post("/memories/tag", authenticate, validateBatchTag, BatchController.tagMemories);
router.post("/memories/move", authenticate, validateBatchMove, BatchController.moveToCollection);
router.post("/memories/delete", authenticate, validateBatchDelete, BatchController.deleteMemories);
router.post("/memories/restore", authenticate, validateBatchRestore, BatchController.restoreMemories);
router.post("/memories/status", authenticate, validateBatchUpdateStatus, BatchController.updateStatus);

export default router;
