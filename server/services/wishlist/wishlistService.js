import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const wishlistService = {
  async addToWishlist({ customerId, productVariantId }) {
    try {
      const existingWishlistItem = await prisma.wishlist.findFirst({
        where: {
          customerId,
          productVariantId,
        },
      });

      if (existingWishlistItem) {
        throw new Error("Product already in wishlist");
      }

      return await prisma.wishlist.create({
        data: {
          customerId,
          productVariantId,
        },
        include: {
          productVariant: true,
        },
      });
    } catch (err) {
      throw new Error("Something went to wrong " + err.message);
    }
  },

  async getUserWishlist(customerId) {
    return await prisma.wishlist.findMany({
      where: {
        customerId,
      },
      include: {
        productVariant: {
          include: {
            metalVariant: {
              select: {
                purityLabel: true,
                metalType: true,
                metalVariantSlug: true,
                metalPriceInGram: true,
              },
            },
            gemstoneVariant: {
              select: {
                shape: true,
                color: true,
                clarity: true,
                certification: true,
                depth: true,
                cut: true,
                gemstonePrice: true,
                gemstoneType: true,
                origin: true,
                imageUrl: true,
                gemstoneVariantSlug: true,
              },
            },
            ScrewOption: true,
            productSize: {
              select: {
                label: true,
                unit: true,
                productSizeSlug: true,
              },
            },
            GlobalDiscount: {
              select: {
                title: true,
                discountType: true,
                discountValue: true,
              },
            },
            metalColor: {
              select: {
                name: true,
                metalColorSlug: true,
              },
            },
            MakingChargeWeightRange: {
              select: {
                chargeValue: true,
                chargeType: true,
                discountType: true,
                discountValue: true,
                MakingChargeCategorySet: true,
              },
            },
            productVariantImage: true,
            products: {
              select: {
                id: true,
                productSlug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async removeFromWishlist(id) {
    try {
      if (!id) throw new Error("Wishlist Id is required");
      const existingWishlistItem = await prisma.wishlist.findFirst({
        where: {
          id,
        },
      });
      if (!existingWishlistItem)
        throw new Error("Product not found in wishlist");
      return await prisma.wishlist.delete({
        where: {
          id,
        },
        include: {
          productVariant: true,
        },
      });
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },
};

export default wishlistService;
