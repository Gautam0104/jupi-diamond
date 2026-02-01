import prisma from "../config/prismaClient.js";
import cartService from "../services/cart/cartService.js";
import { calculateCartSummery } from "./calculateCartSummery.js";

async function applyCouponUtil({ userId, code, cartId }) {
  console.log("cartId=", cartId);
  if (!userId || !code || !cartId) {
    throw new Error("userId, code, and cartId are required");
  }

  const findCart = await prisma.cart.findUnique({
    where: { id: cartId },
  });

  const cart = await prisma.cart.findUnique({
    where: { customerId: userId },
    select: {
      id: true,
      cartSlug: true,
      customerId: true,
      cartItems: {
        select: {
          id: true,
          cartItemSlug: true,
          quantity: true,
          priceAtAddition: true,
          productSize: {
            select: {
              id: true,
              label: true,
              unit: true,
            },
          },
          productVariant: {
            select: {
              id: true,
              productVariantSlug: true,
              productVariantTitle: true,
              finalPrice: true,
              stock: true,
              gst: true,
              GlobalDiscount: true,
              metalWeightInGram: true,
              gemstoneWeightInCarat: true,
              returnPolicyText: true,
              metalVariant: {
                select: {
                  id: true,
                  metalTypeId: true,
                  purityLabel: true,
                  metalPriceInGram: true,
                  byBackPrice: true,
                },
              },
              gemstoneVariant: {
                select: {
                  id: true,
                  origin: true,
                  clarity: true,
                  color: true,
                  cut: true,
                  gemstonePrice: true,
                  certification: true,
                  certificateNumber: true,
                  shape: true,
                  imageUrl: true,
                },
              },
              productVariantImage: {
                select: {
                  imageUrl: true,
                  displayOrder: true,
                },
                orderBy: {
                  displayOrder: "asc",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    throw { statusCode: 404, message: "Cart not found" };
  }

  const cartSummery = calculateCartSummery(cart.cartItems);

  if (!findCart) {
    throw new Error("Cart not found");
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code },
  });

  if (!coupon || !coupon.isActive) {
    throw new Error("Invalid or inactive coupon");
  }

  const now = new Date();
  if (
    (coupon.validFrom && now < coupon.validFrom) ||
    (coupon.validTo && now > coupon.validTo)
  ) {
    throw new Error("Coupon is not valid at this time");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  const alreadyUsed = await prisma.couponUsage.findUnique({
    where: {
      couponId_userId: {
        couponId: coupon.id,
        userId,
      },
    },
  });

  if (alreadyUsed) {
    throw new Error("You have already used this coupon");
  }


  const total = Number.parseFloat(findCart.totalAmount);
  if (coupon.minCartValue && total < coupon.minCartValue) {
    throw new Error(
      `Minimum cart value for this coupon is ₹${coupon.minCartValue}`
    );
  }

  let discountAmount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = (total * coupon.discountValue) / 100;
  } else if (coupon.discountType === "FIXED") {
    discountAmount = coupon.discountValue;
  } else {
    throw new Error("Invalid discount type. Allowed: FIXED, PERCENTAGE");
  }
   
  


  await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      appliedCoupon: {
        connect: {
          id: coupon.id,
        },
      },
    },
  });

  await cartService.updateCartTotals(cartId, coupon.id);

  return {
    success: true,
    message: "Coupon applied successfully",
    discountAmount,
    finalAmount: cartSummery.grandTotal - discountAmount,
    couponId: coupon.id,
  };
}

export default applyCouponUtil;
