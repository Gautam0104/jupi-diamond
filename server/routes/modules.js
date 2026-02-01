import express from "express";

const router = express.Router();

import customerRouter from "./auth/customerRoutes.js";
import retailerRouter from "./auth/retailerRoutes.js";
import adminRouter from "./admin/adminRoutes.js";
import userRouter from "./user/userRoutes.js";
import addressRouter from "./user/userAddress.js";
import productRouter from "./product/productRoutes.js";
import metalTypeRouter from "./metal/metalTypeRotes.js";
import metalColorRouter from "./metal/metalColorRoutes.js";
import metalVariantRouter from "./metal/metalVariantRoutes.js";
import gemstoneTypeRouter from "./gemstone/gemstoneTypeRoutes.js";
import metalColorVariantRouter from "./metalColorVariant/metalColorVariantRoutes.js";
import gemstoneColorRouter from "./gemstone/gemstoneColorRoutes.js";
import gemstoneVariantRouter from "./gemstone/gemstoneVariantRoutes.js";
import gemstoneColorVariantRouter from "./gemstoneColorVariant/gemstoneColorVariantRoutes.js";
import jewelryTypeRouter from "./jewelry/jewelryTypeRoutes.js";
import collectionRouter from "./collection/collectionRoute.js";
import productSizeRouter from "./product/productSizeRoutes.js";
import productStyleRouter from "./productStyle/productStyleRoutes.js";
import occassionRouter from "./occassion/occassionRoute.js";
import productVariantImageRouter from "./productVariantImage/productVariantImageRoutes.js";
import productVariantRouter from "./productVariant/productVariantRoutes.js";
import globalMakingChargesRouter from "./globalMakingCharges/globalMakingChargesCategoryRoutes.js";
import globalMakingWeightRange from "./globalMakingCharges/globalMakingChargesWeightRangeRoutes.js";
import couponRouter from "./coupon/couponRoutes.js";
import cartRouter from "./cart/cartRoutes.js";
import cartItemRouter from "./cart/cartItemRoutes.js";
import globalDiscountRouter from "./global-discount/globalDiscountRoutes.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import bannerRoutes from "./banner/bannerRoute.js";
import orderRoutes from "./order/orderRoute.js";
import productReviewRoutes from "./product-review/productReviewRoute.js";
import permissionRoutes from "./permission/permissionRoutes.js";
import roleRoutes from "./role/roleRoutes.js";
import publicRoutes from "./indexPagePublicAPI/publicAPI.js";
import contactRoutes from "./contact-form/contactFormRoute.js";
import paymentRoutes from "./paymentRoute/paymentRoute.js";
import footerImportantRoute from "./footer-important-cms/footerImportantRoute.js";
import currencyRoutes from "./currency/currencyRoute.js";
import shippingRoutes from "./shipping-charge/shippingRoute.js";
import blogCategoryRoutes from "./blog-category/blogCategoryRoute.js";
import blogRoutes from "./blog/blogRoutes.js";
import notification from "./notification/notification.js";
import delhiveryRoutes from "./one-delivery/deliveryRoute.js";
import giftVoucher from "./gift/giftRoute.js";
import wishlistRoutes from "./wishlist/wishlistRoute.js";

//authentication API's
router.use("/auth/customer", customerRouter);
router.use("/auth/retailer", retailerRouter);
router.use("/", adminRouter);
router.use("/permission", permissionRoutes);
router.use("/role", roleRoutes);
router.use("/auth/password", userRouter);

router.use("/admin/dashboard", adminRouter);
router.use("/address", addressRouter);
// public all api api's
router.use("/public", publicRoutes);
// product api's
router.use("/product", productRouter);

//metalType API
router.use("/metal-type", metalTypeRouter);
//metalColor api
router.use("/metal-color", metalColorRouter);
//metalVariant API
router.use("/metal-variant", metalVariantRouter);

// gemstoneType API
router.use("/gemstone-type", gemstoneTypeRouter);

//gemstoneVariant api
router.use("/gemstone-variant", gemstoneVariantRouter);

//metalColorVariant api
router.use("/metal-color-variant", metalColorVariantRouter);

//gemstone color api
router.use("/gemstone-color", gemstoneColorRouter);

//gemstoneColorVariant api
router.use(
  "/gemstone-color-variant",

  gemstoneColorVariantRouter
);

//jewelrytype api
router.use("/jewelry-type", jewelryTypeRouter);

//collection api like man woman girl api
router.use("/collection", collectionRouter);

//product size api
router.use("/product-size", productSizeRouter);

//product Style api
router.use("/product-style", productStyleRouter);

//occassion api
router.use("/occassion", occassionRouter);

//productvariantimage
router.use("/product-variant-image", productVariantImageRouter);

//productvariant api
router.use("/product-variant", productVariantRouter);
router.use("/banner", bannerRoutes);

//global making charge api
router.use("/global-making-charge", globalMakingChargesRouter);
router.use(
  "/global-making-weight-range",

  globalMakingWeightRange
);

//coupon & discount api
router.use("/coupon", couponRouter);
router.use("/global-discount", globalDiscountRouter);

//cart api
router.use("/cart", cartRouter);
router.use("/wishlist", authMiddleware, wishlistRoutes);

//cartItem API
router.use("/cart-item", cartItemRouter);

//public order api creation...................
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);

//public review rating api creation...................
router.use("/product-review", productReviewRoutes);
//Contact form ...................
router.use("/contact", contactRoutes);
router.use("/footer-cms", footerImportantRoute);
router.use("/currency", currencyRoutes);
router.use("/shipping", shippingRoutes);
//blog module...............................
router.use("/blogs/category", blogCategoryRoutes);
router.use("/blogs", blogRoutes);

router.use("/global/notification", notification);
router.use("/gift/voucher", giftVoucher);

router.use("/delhivery", delhiveryRoutes);

export default router;
