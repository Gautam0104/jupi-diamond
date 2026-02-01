import { Router } from "express";
import makingWeightController from "../../controller/globalMakingCharges/globalMakingChargesWeightRangeController.js";

const router = Router();

router.post("/create", makingWeightController.createMakingChargeWeightRange);
router.get("/fetch", makingWeightController.getAllMakingChargeWeightRanges);
router.get(
  "/fetch/:id",
  makingWeightController.getSingleMakingChargeWeightRange
);
router.get(
  "/fetch/makingweightBy/:categoryId",
  makingWeightController.fetchMakingWeightByCategoryId
);
router.patch(
  "/update/:id",
  makingWeightController.updateMakingChargeWeightRange
);
router.delete(
  "/delete/:id",
  makingWeightController.deleteMakingChargeWeightRange
);
router.patch(
  "/update/status/:id",
  makingWeightController.updateMakingChargeWeightRangeStatus
);

export default router;
