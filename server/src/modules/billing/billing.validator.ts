import { validate } from "../../shared/middlewares/validate";
import { createCheckoutSessionSchema } from "./billing.schema";

export const validateCreateCheckoutSession = validate(createCheckoutSessionSchema);
