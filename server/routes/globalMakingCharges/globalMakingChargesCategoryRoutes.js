import { Router } from "express";
import globalMakingChargesController from "../../controller/globalMakingCharges/globalMakingChargesController.js";
const router = Router();

router.get("/fetch", globalMakingChargesController.getGlobalMakingCharges);
router.get(
  "/fetch/:id",
  globalMakingChargesController.getGlobalMakingChargesById
);
router.post("/create", globalMakingChargesController.createGlobalMakingCharges);
router.patch(
  "/update/:id",
  globalMakingChargesController.updateGlobalMakingCharges
);
router.delete(
  "/delete/:id",
  globalMakingChargesController.deleteGlobalMakingCharges
);

export default router;
