import { validate } from "../../../shared/middlewares/validate";
import { assignPlanSchema, listAssignmentsQuerySchema, listTransactionsQuerySchema, revenueQuerySchema } from "./billing.schema";

export const validateAssignPlan = validate(assignPlanSchema);
export const validateListTransactions = validate(listTransactionsQuerySchema, "query");
export const validateRevenueQuery = validate(revenueQuerySchema, "query");
export const validateListAssignments = validate(listAssignmentsQuerySchema, "query");
