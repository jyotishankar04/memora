import { Readable } from "node:stream";
import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { createThread, getThreadMessages, listThreads, streamAsk } from "./ai.service";
import type { AskInput, CreateThreadInput } from "./ai.schema";

export class AiController {
  static async createThread(req: Request, res: Response) {
    const thread = await createThread(req.user!.id, req.body as CreateThreadInput);
    res.status(201).json(ApiResponse.success(thread));
  }

  static async listThreads(req: Request, res: Response) {
    const items = await listThreads(req.user!.id);
    res.status(200).json(ApiResponse.success(items));
  }

  static async getThreadMessages(req: Request, res: Response) {
    const messages = await getThreadMessages(req.user!.id, req.params.id as string);
    res.status(200).json(ApiResponse.success(messages));
  }

  static async ask(req: Request, res: Response) {
    const { query } = req.body as AskInput;
    const streamResponse = await streamAsk(req.user!.id, req.params.id as string, query);

    res.status(streamResponse.status);
    streamResponse.headers.forEach((value, key) => res.setHeader(key, value));

    if (!streamResponse.body) {
      res.end();
      return;
    }
    Readable.fromWeb(streamResponse.body as never).pipe(res);
  }
}
