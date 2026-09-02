import { validate } from "../../shared/middlewares/validate";
import { updateFlagSchema } from "./feature-flags.schema";

export const validateUpdateFlag = validate(updateFlagSchema);
