import { Router } from "express";
import userAddressController from "../../controller/user/userAddress.js";

const router = Router();

router.get("/fetch", userAddressController.getUserAddress);
router.get("/fetch/:id", userAddressController.getAddressById);
router.post("/create", userAddressController.addAddress);
router.patch("/update/:id", userAddressController.updateUserAddress);
router.delete("/delete/:id", userAddressController.deleteUserAddress);

export default router;
