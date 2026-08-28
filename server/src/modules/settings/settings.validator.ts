import { validate } from "../../shared/middlewares/validate";
import { updateSettingsSchema } from "./settings.schema";

export const validateUpdateSettings = validate(updateSettingsSchema);
