import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import {
  createMemory,
  deleteMemory,
  exportAllMemories,
  getMemoryById,
  getMemoryGraph,
  getProcessingStatus,
  listMemories,
  refreshPreview,
  submitBrowserCapture,
  updateMemory,
} from "./memory.service";
import type { ListMemoriesQuery } from "./memory.schema";

export class MemoryController {
  static async list(req: Request, res: Response) {
    const result = await listMemories(req.user!.id, req.query as unknown as ListMemoriesQuery);
    res.status(200).json(
      ApiResponse.success(result.items, {
        page: result.page,
        limit: result.limit,
        total: result.total,
      }),
    );
  }

  static async get(req: Request, res: Response) {
    const memory = await getMemoryById(req.user!.id, req.params.id as string);
    res.status(200).json(ApiResponse.success(memory));
  }

  static async create(req: Request, res: Response) {
    const memory = await createMemory(req.user!.id, req.body);
    res.status(201).json(ApiResponse.success(memory));
  }

  static async update(req: Request, res: Response) {
    const memory = await updateMemory(req.user!.id, req.params.id as string, req.body);
    res.status(200).json(ApiResponse.success(memory));
  }

  static async remove(req: Request, res: Response) {
    await deleteMemory(req.user!.id, req.params.id as string);
    res.status(204).send();
  }

  static async browserCapture(req: Request, res: Response) {
    const memory = await submitBrowserCapture(req.user!.id, req.params.id as string, req.body);
    res.status(200).json(ApiResponse.success(memory));
  }

  static async refreshPreview(req: Request, res: Response) {
    const memory = await refreshPreview(req.user!.id, req.params.id as string);
    res.status(200).json(ApiResponse.success(memory));
  }

  static async processingStatus(req: Request, res: Response) {
    const status = await getProcessingStatus(req.user!.id, req.params.id as string);
    res.status(200).json(ApiResponse.success(status));
  }

  static async graph(req: Request, res: Response) {
    const graph = await getMemoryGraph(req.user!.id);
    res.status(200).json(ApiResponse.success(graph));
  }

  // The one non-JSON-envelope response in this codebase — a file download,
  // not an ApiResponse-wrapped result. exportAllMemories throws the
  // FEATURE_NOT_AVAILABLE AppError itself (same pattern as
  // collection.service.ts's shareCollection) before any of this runs.
  static async exportAll(req: Request, res: Response) {
    const items = await exportAllMemories(req.user!.id);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="saveforlatter-export-${Date.now()}.json"`);
    res.send(JSON.stringify(items, null, 2));
  }
}
