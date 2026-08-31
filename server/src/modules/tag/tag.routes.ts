import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { TagController } from "./tag.controller";

const router = Router();

router.get("/", authenticate, TagController.list);

export default router;
