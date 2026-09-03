import { validate } from "../../shared/middlewares/validate";
import { usageByUserQuerySchema, usageRangeQuerySchema } from "./ai-usage.schema";

export const validateUsageRange = validate(usageRangeQuerySchema, "query");
export const validateUsageByUser = validate(usageByUserQuerySchema, "query");
