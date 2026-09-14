import { Router } from "express";
import { authenticate } from "../../shared/middlewares/authenticate";
import { CollectionController } from "./collection.controller";
import { requireUnlockToUnvault, requireVaultUnlockedForQuery } from "../vault";
import { validateCreateCollection, validateListCollections, validateUpdateCollection } from "./collection.validator";

const router = Router();

// Public + unauthenticated — must be registered before the /:id routes so
// "public" is never swallowed as an :id param.
router.get("/public/:slug", CollectionController.getPublic);

router.get("/", authenticate, validateListCollections, requireVaultUnlockedForQuery, CollectionController.list);
router.post("/", authenticate, validateCreateCollection, CollectionController.create);
router.patch("/:id", authenticate, validateUpdateCollection, requireUnlockToUnvault, CollectionController.update);
router.patch("/:id/convert-to-user", authenticate, CollectionController.convertToUser);
router.patch("/:id/share", authenticate, CollectionController.share);
router.patch("/:id/unshare", authenticate, CollectionController.unshare);
router.delete("/:id", authenticate, CollectionController.remove);

export default router;
