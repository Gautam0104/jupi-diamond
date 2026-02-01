import { Router } from "express";
import globalDiscountController from "../../controller/global-discount/globalDiscountController.js";
const router = Router();

router.post("/create", globalDiscountController.createGlobalDiscountController);
router.post(
  "/apply-discount/:discountId",
  globalDiscountController.applyDiscountToMultiple
);
router.post("/remove-discount", globalDiscountController.removeDiscountHandler);
router.get(
  "/fetch/all",
  globalDiscountController.getAllGlobalDiscountsController
);
router.get(
  "/fetch/:id",
  globalDiscountController.getGlobalDiscountByIdController
);
router.patch(
  "/update/:id",
  globalDiscountController.updateGlobalDiscountController
);
router.delete(
  "/delete/:id",
  globalDiscountController.deleteGlobalDiscountController
);

export default router;
