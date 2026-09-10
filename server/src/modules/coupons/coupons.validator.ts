import { validate } from "../../shared/middlewares/validate";
import { applyCouponSchema } from "./coupons.schema";

export const validateApplyCoupon = validate(applyCouponSchema);
