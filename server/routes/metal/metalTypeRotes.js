import { Router } from "express";
import metalConroller from "../../controller/metal/metalTypeController.js";

const router = Router();

router.get("/fetch", metalConroller.metalTypeGetController);
router.get("/fetch/ById/:id", metalConroller.metalTypeGetByIdController);
router.post("/create", metalConroller.metalTypePostController);
router.patch("/update/:id", metalConroller.metalTypeUpdateController);
router.delete("/delete/:id", metalConroller.metalTypeDeleteController);

export default router;
