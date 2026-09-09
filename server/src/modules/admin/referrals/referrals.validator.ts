import { validate } from "../../../shared/middlewares/validate";
import { createReferralCodeSchema, listReferralCodesQuerySchema, updateReferralCodeSchema } from "./referrals.schema";

export const validateCreateReferralCode = validate(createReferralCodeSchema);
export const validateUpdateReferralCode = validate(updateReferralCodeSchema);
export const validateListReferralCodes = validate(listReferralCodesQuerySchema, "query");
