import { Router } from "express";
import { AnnouncementsController } from "./announcements.controller";

const router = Router();

// No auth — read by the marketing site's countdown/announcement banner.
router.get("/active", AnnouncementsController.active);

export default router;
