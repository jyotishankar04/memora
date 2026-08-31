import { validate } from "../../shared/middlewares/validate";
import { createCollectionSchema, updateCollectionSchema } from "./collection.schema";

export const validateCreateCollection = validate(createCollectionSchema);
export const validateUpdateCollection = validate(updateCollectionSchema);
