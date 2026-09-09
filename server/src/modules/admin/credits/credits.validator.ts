import { validate } from "../../../shared/middlewares/validate";
import { adjustCreditsSchema } from "./credits.schema";

export const validateAdjustCredits = validate(adjustCreditsSchema);
