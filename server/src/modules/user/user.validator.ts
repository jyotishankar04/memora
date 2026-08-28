import { validate } from "../../shared/middlewares/validate";
import { completeOnboardingSchema } from "./user.schema";

export const validateCompleteOnboarding = validate(completeOnboardingSchema);
