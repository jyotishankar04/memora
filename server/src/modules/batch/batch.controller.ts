import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import {
  batchTagMemories,
  batchMoveToCollection,
  batchDeleteMemories,
  batchRestoreMemories,
  batchUpdateMemoryStatus,
} from "./batch.service";
import type {
  BatchTagInput,
  BatchMoveToCollectionInput,
  BatchDeleteInput,
  BatchRestoreInput,
  BatchUpdateStatusInput,
} from "./batch.schema";

export class BatchController {
  static async tagMemories(req: Request, res: Response) {
    const input = req.body as BatchTagInput;
    const result = await batchTagMemories(req.user!.id, input);
    res.status(200).json(ApiResponse.success(result));
  }

  static async moveToCollection(req: Request, res: Response) {
    const input = req.body as BatchMoveToCollectionInput;
    const result = await batchMoveToCollection(req.user!.id, input);
    res.status(200).json(ApiResponse.success(result));
  }

  static async deleteMemories(req: Request, res: Response) {
    const input = req.body as BatchDeleteInput;
    const result = await batchDeleteMemories(req.user!.id, input);
    res.status(200).json(ApiResponse.success(result));
  }

  static async restoreMemories(req: Request, res: Response) {
    const input = req.body as BatchRestoreInput;
    const result = await batchRestoreMemories(req.user!.id, input);
    res.status(200).json(ApiResponse.success(result));
  }

  static async updateStatus(req: Request, res: Response) {
    const input = req.body as BatchUpdateStatusInput;
    const result = await batchUpdateMemoryStatus(req.user!.id, input);
    res.status(200).json(ApiResponse.success(result));
  }
}
