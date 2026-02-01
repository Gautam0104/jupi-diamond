import { Router } from "express";
import cartController from "../../controller/cart/cartController.js";

const router = Router();

// router.post("/create", cartController.createCart);
router.get("/fetch/customer", cartController.fetchCustomerCart);

export default router;
