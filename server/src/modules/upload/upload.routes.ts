import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { handleUpload } from "./upload.multer";
import { UploadController } from "./upload.controller";

const router = Router();

router.post("/", authenticate, handleUpload, UploadController.create);

export default router;
