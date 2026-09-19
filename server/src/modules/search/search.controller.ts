import type { Request, Response } from "express";
import { ApiResponse } from "../../shared/response/api-response";
import { advancedSearch } from "./search.service";
import type { AdvancedSearchInput } from "./search.schema";

export class SearchController {
  static async advancedSearch(req: Request, res: Response) {
    const input = req.query as unknown as AdvancedSearchInput;
    const result = await advancedSearch(req.user!.id, input);
    res.status(200).json(ApiResponse.success(result));
  }
}
