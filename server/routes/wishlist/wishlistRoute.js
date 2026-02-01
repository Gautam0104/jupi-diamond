import { Router } from "express";
import wishlistController from "../../controller/wishlist/wishlistController.js";

const router = Router();

router.post("/create", wishlistController.addToWishlist);
router.get("/customer/fetch", wishlistController.getUserWishlist);
router.delete("/customer/delete/:id", wishlistController.removeFromWishlist);

export default router;
