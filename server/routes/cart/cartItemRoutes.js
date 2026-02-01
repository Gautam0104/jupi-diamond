import { Router } from "express";
import cartItemController from "../../controller/cart/cartItemController.js";

const router = Router();

router.post("/add", cartItemController.addItemToCart);

router.patch(
  "/cart/:cartId/item/:cartItemId",
  cartItemController.updateCartItem
);
router.delete("/delete/:cartItemId", cartItemController.deleteItemFromCart);

export default router;
