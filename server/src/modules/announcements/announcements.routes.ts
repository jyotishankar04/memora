import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { requireAdmin } from "../../shared/middlewares/require-admin";
import { AnnouncementsController } from "./announcements.controller";
import { validateCreateAnnouncement, validateUpdateAnnouncement } from "./announcements.validator";

const router = Router();

router.get("/", authenticate, requireAdmin, AnnouncementsController.list);
router.post("/", authenticate, requireAdmin, validateCreateAnnouncement, AnnouncementsController.create);
router.patch("/:id", authenticate, requireAdmin, validateUpdateAnnouncement, AnnouncementsController.update);
router.delete("/:id", authenticate, requireAdmin, AnnouncementsController.remove);

export default router;
