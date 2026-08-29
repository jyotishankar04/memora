import { validate } from "../../shared/middlewares/validate";
import { presignUploadSchema } from "./upload.schema";

export const validatePresignUpload = validate(presignUploadSchema);
