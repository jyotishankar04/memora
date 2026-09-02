import { validate } from "../../shared/middlewares/validate";
import {
  analyticsRangeQuerySchema,
  auditLogQuerySchema,
  listUsersQuerySchema,
  updateUserRolesSchema,
  updateUserStatusSchema,
} from "./admin.schema";

export const validateListUsers = validate(listUsersQuerySchema, "query");
export const validateUpdateUserRoles = validate(updateUserRolesSchema);
export const validateUpdateUserStatus = validate(updateUserStatusSchema);
export const validateAnalyticsRange = validate(analyticsRangeQuerySchema, "query");
export const validateAuditLogQuery = validate(auditLogQuerySchema, "query");
