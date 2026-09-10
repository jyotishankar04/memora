import { validate } from "../../../shared/middlewares/validate";
import { listUsersQuerySchema, updateUserRolesSchema, updateUserStatusSchema } from "./users.schema";

export const validateListUsers = validate(listUsersQuerySchema, "query");
export const validateUpdateUserRoles = validate(updateUserRolesSchema);
export const validateUpdateUserStatus = validate(updateUserStatusSchema);
