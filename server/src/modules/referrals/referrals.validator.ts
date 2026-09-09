import { validate } from "../../shared/middlewares/validate";
import { trackClickSchema } from "./referrals.schema";

export const validateTrackClick = validate(trackClickSchema);
