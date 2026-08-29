import { validate } from "../../shared/middlewares/validate";
import { createMemorySchema, listMemoriesQuerySchema, updateMemorySchema } from "./memory.schema";

export const validateListMemories = validate(listMemoriesQuerySchema, "query");
export const validateCreateMemory = validate(createMemorySchema);
export const validateUpdateMemory = validate(updateMemorySchema);
