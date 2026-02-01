import prisma from "../../config/prismaClient.js";
import { calculateCartSummery } from "../../utils/calculateCartSummery.js";

const cartService = {
  async getOrCreateCart({ customerId, sessionId }) {
    try {
      const query = customerId
        ? { customerId }
        : sessionId
          ? { sessionId }
          : null;

      console.log("query=", query);

      if (!query)
        throw { statusCode: 400, message: "No user or session provided" };

      let cart = await prisma.cart.findUnique({ where: query });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            customer: {
              connect: {
                id: customerId,
              },
            },
            sessionId,
            cartSlug: `cart-${Date.now()}`,
          },
        });
      }

      return cart;
    } catch (error) {
      console.log("error=", error);
      throw new Error("Something went wrong " + error.message);
    }
  },

  //fetch user cart.....................................
  async fetchCustomerCart(userId) {
    try {
      if (!userId) throw { statusCode: 400, message: "No user provided" };

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
                  labelSize: true,
                  unit: true,
                  circumference: true,
                },
              },

              screwOption: {
                select: {
                  id: true,
                  screwType: true,
                  screwMaterial: true,
                  isDetachable: true,
                  notes: true,
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
                  products: {
                    select: {
                      id: true,
                      productSlug: true,
                      name: true,
                      jewelryType: {
                        select: {
                          id: true,
                          jewelryTypeSlug: true,
                          name: true, 
                        },
                      },
                    },
                  },
                  ScrewOption: true,
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

      return {
        cart,
        cartSummery,
      };
    } catch (error) {
      throw new Error("Something went wrong: " + error.message);
    }
  },

  async getProductVariant(productVariantId) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
      select: {
        finalPrice: true,
        stock: true,
        gst: true,
        GlobalDiscount: true,
      },
    });

    if (!variant)
      throw { statusCode: 404, message: "Product variant not found" };
    if (variant.finalPrice == null)
      throw { statusCode: 400, message: "Product has no price set" };

    return variant;
  },
  async updateCartTotals(cartId) {
    console.log("cartId==>", cartId);
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        cartItems: {
          select: { priceAtAddition: true },
        },
        appliedCoupon: true,
      },
    });

    if (!cart) throw new Error("Cart not found");

    // 1. Calculate totalAmount from cartItems
    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + (item.priceAtAddition || 0),
      0
    );
    console.log("totalAmount=", totalAmount);
    let discountAmount = 0;

    // 2. Validate coupon and calculate discount
    const coupon = cart.appliedCoupon;
    const now = new Date();

    if (
      coupon?.isActive &&
      (!coupon.validFrom || now >= coupon.validFrom) &&
      (!coupon.validTo || now <= coupon.validTo) &&
      (!coupon.minCartValue || totalAmount >= coupon.minCartValue)
    ) {
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (totalAmount * coupon.discountValue) / 100;
      } else if (coupon.discountType === "FIXED") {
        discountAmount = coupon.discountValue;
      }
    }

    // 3. Final amount after applying discount
    const finalAmount = Math.max(totalAmount - discountAmount, 0);

    // 4. Update cart with totals
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        totalAmount,
        discountAmount,
        finalAmount,
      },
    });
  },
};
export default cartService;
