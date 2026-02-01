import { Router } from "express";
import gemstoneConroller from "../../controller/gemstone/gemstoneTypeController.js";

const router = Router();

router.get("/fetch", gemstoneConroller.gemstoneTypeGetController);
router.get("/fetch/:id", gemstoneConroller.gemstoneTypeGetByIdController);
router.post("/create", gemstoneConroller.gemstoneTypePostController);
router.patch("/update/:id", gemstoneConroller.gemstoneTypeUpdateController);
router.delete("/delete/:id", gemstoneConroller.gemstoneTypeDeleteController);

export default router;
