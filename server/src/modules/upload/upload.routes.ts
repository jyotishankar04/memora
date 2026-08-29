import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { UploadController } from "./upload.controller";
import { validatePresignUpload } from "./upload.validator";

const router = Router();

router.post("/presign", authenticate, validatePresignUpload, UploadController.presign);

export default router;
