import { validate } from "../../shared/middlewares/validate";
import { createAnnouncementSchema, updateAnnouncementSchema } from "./announcements.schema";

export const validateCreateAnnouncement = validate(createAnnouncementSchema);
export const validateUpdateAnnouncement = validate(updateAnnouncementSchema);
