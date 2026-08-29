import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { CollectionController } from "./collection.controller";
import { validateCreateCollection, validateUpdateCollection } from "./collection.validator";

const router = Router();

router.get("/", authenticate, CollectionController.list);
router.post("/", authenticate, validateCreateCollection, CollectionController.create);
router.patch("/:id", authenticate, validateUpdateCollection, CollectionController.update);
router.delete("/:id", authenticate, CollectionController.remove);

export default router;
