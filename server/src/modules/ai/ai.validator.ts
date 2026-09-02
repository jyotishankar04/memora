import { validate } from "../../shared/middlewares/validate";
import { askSchema, createThreadSchema, threadIdParamsSchema } from "./ai.schema";

export const validateCreateThread = validate(createThreadSchema);
export const validateAsk = validate(askSchema);
export const validateThreadIdParams = validate(threadIdParamsSchema, "params");
