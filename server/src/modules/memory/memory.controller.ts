import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { createMemory, deleteMemory, getMemoryById, listMemories, updateMemory } from "./memory.service";
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
}
