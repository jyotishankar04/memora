import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { CollectionController } from "./collection.controller";
import { validateCreateCollection, validateListCollections, validateUpdateCollection } from "./collection.validator";

const router = Router();

router.get("/", authenticate, validateListCollections, CollectionController.list);
router.post("/", authenticate, validateCreateCollection, CollectionController.create);
router.patch("/:id", authenticate, validateUpdateCollection, CollectionController.update);
router.patch("/:id/convert-to-user", authenticate, CollectionController.convertToUser);
router.delete("/:id", authenticate, CollectionController.remove);

export default router;
