import { Router } from "express";
import collectionController from "../../controller/collection/collectionController.js";
import { upload } from "../../middleware/aws.file.stream.js";

const router = Router();

router.get("/fetch", collectionController.getCollection);
router.get("/fetch/:id", collectionController.getCollectionById);
router.post("/create", upload.any(), collectionController.createCollection);
router.patch(
  "/update/:id",
  upload.any(),
  collectionController.updateCollection
);
router.delete("/delete/:id", collectionController.deleteCollection);
router.patch("/toggle/:id", collectionController.toggleCollection);

// public api......................................................
router.get("/public/fetch", collectionController.getPublicCollection);

export default router;
