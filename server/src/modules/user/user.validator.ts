import { validate } from "../../shared/middlewares/validate";
import { completeOnboardingSchema, updateProfileSchema } from "./user.schema";

export const validateUpdateProfile = validate(updateProfileSchema);
export const validateCompleteOnboarding = validate(completeOnboardingSchema);
