import { validate } from "../../../shared/middlewares/validate";
import { createCouponSchema, listCouponsQuerySchema, updateCouponSchema } from "./coupons.schema";

export const validateCreateCoupon = validate(createCouponSchema);
export const validateUpdateCoupon = validate(updateCouponSchema);
export const validateListCoupons = validate(listCouponsQuerySchema, "query");
