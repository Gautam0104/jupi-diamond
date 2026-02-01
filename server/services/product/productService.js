import prisma from "../../config/prismaClient.js";
import calculateCharge from "../../utils/calculatingMakingPrice.js";
import {
  generateSlug,
  generateUniqueSlug,
} from "../../utils/autogenerateSlug.js";
import { generateSku } from "../../utils/generateSKU.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import { paginate } from "../../utils/pagination.js";
import productVariantService from "../productVariant/productVariantService.js";
import { calculateFinalProductCost } from "../../helper/productPriceCalculation.js";

const productService = {
  async createProduct(data) {
    try {
      const {
        name,
        description,
        jewelryTypeId,
        collectionId,
        productStyleId,
        occasionId,
        tags,
        metaTitle,
        metaDescription,
        metaKeywords,
        productVariantData = [],
      } = data;

      console.log("data=>", data);

      if (
        !name ||
        !jewelryTypeId ||
        !productStyleId ||
        !productVariantData.length
      ) {
        throw {
          statusCode: 400,
          message: "Missing required fields or no variants provided.",
        };
      }

      const [jewelryType, productStyle] = await Promise.all([
        prisma.jewelryType.findUnique({ where: { id: jewelryTypeId } }),
        prisma.productStyle.findMany({
          where: {
            id: {
              in: Array.isArray(productStyleId)
                ? productStyleId
                : [productStyleId],
            },
          },
        }),
      ]);
      // prisma.collection.findUnique({ where: { id: collectionId } }),
      if (!jewelryType) {
        throw { statusCode: 404, message: "Jewelry type not found" };
      }

      // if (!collection) {
      //   throw { statusCode: 404, message: "Collection not found" };
      // }

      // if (!productStyle) {
      //   throw { statusCode: 404, message: "Product style not found" };
      // }

      const productSlug = generateSlug(name);
      const existingProduct = await prisma.product.findUnique({
        where: { productSlug },
      });

      // if (existing)
      //   throw { statusCode: 409, message: "Product already exists." };
      // console.log("jewelryTypeId=====>", jewelryTypeId);
      return await prisma.$transaction(async (tx) => {
        const product = existingProduct
          ? existingProduct
          : await tx.product.create({
              data: {
                name,
                productSlug,
                description,
                jewelryTypeId,
                collection: {
                  connect: Array.isArray(collectionId)
                    ? collectionId.map((id) => ({ id }))
                    : [{ id: collectionId }],
                },
                productStyle: {
                  connect: Array.isArray(productStyleId)
                    ? productStyleId.map((id) => ({ id }))
                    : [{ id: productStyleId }],
                },
                occasion: {
                  connect: Array.isArray(occasionId)
                    ? occasionId.map((id) => ({ id }))
                    : [{ id: occasionId }],
                },
                tags,
                metaTitle,
                metaDescription,
                metaKeywords,
              },
            });

        console.log("product===>", product);

        const variants = await Promise.all(
          productVariantData.map(async (variant, index) => {
            if (!variant.makingChargeWeightRangeId) {
              throw new Error("Making charge is required for each variant.");
            }

            const [
              metalVariant,
              gemstoneVariant,
              chargeRange,
              discount,
              metalColor,
            ] = await Promise.all([
              tx.metalVariant.findUnique({
                where: { id: variant.metalVariantId },
              }),
              variant.gemstoneVariantId
                ? tx.gemstoneVariant.findUnique({
                    where: { id: variant.gemstoneVariantId },
                  })
                : null,
              tx.makingChargeWeightRange.findUnique({
                where: { id: variant.makingChargeWeightRangeId },
              }),
              variant.globalDiscountId
                ? tx.globalDiscount.findUnique({
                    where: { id: variant.globalDiscountId },
                  })
                : null,
              variant.metalColorId
                ? tx.MetalColor.findUnique({
                    where: { id: variant.metalColorId },
                  })
                : null,
            ]);
            console.log("metalColor==", metalColor);
            //if not found unique please return error.......................
            if (!metalVariant) {
              throw {
                statusCode: 404,
                message: "Metal variant not found",
              };
            }

            if (variant.gemstoneVariantId && !gemstoneVariant) {
              throw {
                statusCode: 404,
                message: "Gemstone variant not found",
              };
            }

            if (!chargeRange) {
              throw {
                statusCode: 404,
                message: "Making charge weight range not found",
              };
            }

            if (!metalVariant)
              throw {
                message: "Invalid metalVariant not found!",
              };

            const generateSkuCode = generateSku(
              jewelryType,
              metalVariant.purityLabel,
              gemstoneVariant ? gemstoneVariant.clarity : null
            );

            //Here start price calculation.............................................
            const {
              metalCost,
              gemstoneCost,
              sideDiamondCost,
              base,
              makingCharge,
              gstAmount,
              final,
              finalWithGst,
              grossWeight,
            } = calculateFinalProductCost(
              variant,
              metalVariant,
              gemstoneVariant,
              chargeRange
            );

            const productVariantSlug = generateSlug(
              name,
              metalVariant.purityLabel || "",
              `${Number.parseFloat(variant.metalWeightInGram)}`,
              metalColor?.name
            );

            const variantTitle = `${product.name} - ${metalVariant.purityLabel} - ${metalColor?.name}${
              gemstoneVariant ? " with " + gemstoneVariant.clarity : ""
            }`;
            console.log("variantTitle==>", variantTitle);

            return tx.productVariant.create({
              data: {
                productVariantSlug,
                productVariantTitle: variantTitle,
                numberOfDiamonds: Number.parseInt(variant.numberOfDiamonds),
                numberOfgemStones: Number.parseInt(variant.numberOfgemStones),
                numberOfSideDiamonds: Number.parseInt(
                  variant.numberOfSideDiamonds
                ),
                sideDiamondPriceCarat: Number.parseFloat(
                  variant.sideDiamondPriceCarat
                ),
                sideDiamondWeight: Number.parseFloat(variant.sideDiamondWeight),
                sideDiamondQuality: variant.sideDiamondQuality || "Good",
                totalPriceSideDiamond: sideDiamondCost,
                makingChargePrice: Math.round(makingCharge),
                metalVariantId: variant.metalVariantId,
                metalColorId: variant.metalColorId,
                gemstoneVariantId: variant.gemstoneVariantId,
                globalMakingChargesId: variant.globalMakingChargesId,
                makingChargeWeightRangeId: variant.makingChargeWeightRangeId,
                karigarId: variant.karigarId || null,
                globalDiscountId: variant.globalDiscountId || null,
                metalWeightInGram: Number.parseFloat(variant.metalWeightInGram),
                gemstoneWeightInCarat: Number.parseFloat(
                  variant.gemstoneWeightInCarat
                ),
                productId: existingProduct ? existingProduct.id : product.id,
                productSize: {
                  connect: variant?.productSizeId
                    ? JSON.parse(variant.productSizeId)?.map((sizeId) => ({
                        id: sizeId,
                      }))
                    : [],
                },
                metalPrice: metalCost,
                diamondPrice: gemstoneCost + sideDiamondCost,
                sellingPrice: Math.round(base + makingCharge),
                finalPrice: Math.round(finalWithGst),
                grossWeight: grossWeight,
                stock: Number.parseInt(variant.stock) ?? 0,
                sku: generateSkuCode,
                length: variant.length,
                width: variant.width,
                height: variant.height,
                gst: Number.parseInt(variant.gst) ?? 0,
                // isFeatured: variant.isFeatured === "false" ? false : true,
                // isNewArrival: variant.isNewArrival === "false" ? false : true,
                // newArrivalUntil: variant.newArrivalUntil || null,
                returnPolicyText: variant.returnPolicyText || null,
                note: variant.note || null,
                // ScrewOption: {
                //   create: JSON.parse(variant.screwOption)?.map((screw) => ({
                //     productVariantId: variant.id,
                //     screwMaterial: screw.screwMaterial,
                //     screwType: screw.screwType,
                //     notes: screw.notes,
                //   })),
                // },
                ScrewOption: variant.screwOption
                  ? {
                      create: (() => {
                        try {
                          const parsed = JSON.parse(variant.screwOption);
                          if (!Array.isArray(parsed)) return [];
                          return parsed.map((screw) => ({
                            productVariantId: variant.id,
                            screwMaterial: screw.screwMaterial,
                            screwType: screw.screwType,
                            notes: screw.notes,
                          }));
                        } catch (err) {
                          console.warn(
                            "Invalid screwOption JSON",
                            variant.screwOption
                          );
                          return [];
                        }
                      })(),
                    }
                  : undefined,

                // productVariantImage: {
                //   createMany: {
                //     data: (variant.images || []).map((url) => ({
                //       imageUrl: url,
                //     })),
                //   },
                // },
                productVariantImage: {
                  createMany: {
                    data: (variant.images || []).map((img, index) => ({
                      imageUrl: typeof img === "string" ? img : img.imageUrl,
                      displayOrder:
                        typeof img === "object" &&
                        img.displayOrder !== undefined
                          ? img.displayOrder
                          : index,
                    })),
                  },
                },
              },
              include: {
                metalVariant: {
                  include: {
                    metalType: true,
                  },
                },
                gemstoneVariant: {
                  include: {
                    gemstoneType: true,
                  },
                },
                productVariantImage: true,
                productSize: true,
                MakingChargeWeightRange: true,
                GlobalDiscount: true,
                Karigar: true,
                ScrewOption: true,
              },
            });
          })
        );

        return { product, variants };
      });
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(
        "Something went wrong while creating product: " + error.message
      );
    }
  },

  async getProduct(query) {
    try {
      const { page, limit, skip } = paginate(query);
      const { search } = query;
      let whereFilter = {};
      if (search !== null && search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [{ clarity: { contains: search, mode: "insensitive" } }],
        };
      }

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where: whereFilter,
          skip,
          take: limit,
          include: {
            jewelryType: true,
            collection: true,
            productStyle: true,
            productVariant: {
              include: {
                metalVariant: {
                  include: {
                    MetalColorVariant: { include: { metalColor: true } },
                    metalType: true,
                  },
                },
                gemstoneVariant: {
                  include: {
                    // GemstoneColorVariant: { include: { gemstoneColor: true } },
                    gemstoneType: true,
                  },
                },
                ScrewOption: true,
                MakingChargeWeightRange: true,
                productVariantImage: true,
                productSize: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.product.count({
          where: whereFilter,
        }),
      ]);
      console.log("products=", products);
      if (!products) {
        throw {
          message: "Products not found",
        };
      }
      return { products, pagination: { page, limit, skip, totalCount } };
    } catch (error) {
      throw new Error("Something went wrong while fetching ", error.message);
    }
  },

  async getProductById(id) {
    try {
      if (!id) {
        throw {
          message: "Provide all the required fields",
        };
      }
      const existing = await prisma.product.findUnique({
        where: { id },
        include: {
          jewelryType: {
            select: {
              id: true,
              name: true,
            },
          },
          occasion: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          collection: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          productStyle: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
          productVariant: {
            include: {
              metalVariant: {
                include: {
                  MetalColorVariant: { include: { metalColor: true } },
                  metalType: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              ScrewOption: true,
              gemstoneVariant: {
                include: {
                  // GemstoneColorVariant: { include: { gemstoneColor: true } },
                  gemstoneType: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              MakingChargeWeightRange: true,
              productVariantImage: true,
              productSize: true,
            },
          },
        },
      });

      if (!existing) {
        throw {
          message: "Product not found",
        };
      }
      return existing;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong while fetching ", error.message);
    }
  },

  //fetch public product by slug name.......................
  // async getProductBySlug(productSlug) {
  //   if (!productSlug) {
  //     throw {
  //       message: "Product slug is required",
  //     };
  //   }
  //   const product = await prisma.product.findUnique({
  //     where: { productSlug },
  //     include: {
  //       jewelryType: {
  //         select: {
  //           name: true,
  //         },
  //       },
  //       occasion: {
  //         select: {
  //           name: true,
  //           description: true,
  //         },
  //       },
  //       collection: {
  //         select: {
  //           name: true,
  //           description: true,
  //         },
  //       },
  //       productStyle: {
  //         select: {
  //           name: true,
  //           description: true,
  //         },
  //       },
  //       productVariant: {
  //         include: {
  //           metalColor: {
  //             select: {
  //               id: true,
  //               metalColorSlug: true,
  //               name: true,
  //             },
  //           },
  //           metalVariant: {
  //             include: {
  //               // MetalColorVariant: { include: { metalColor: true } },
  //               metalType: {
  //                 select: {
  //                   id: true,
  //                   name: true,
  //                 },
  //               },
  //             },
  //           },
  //           gemstoneVariant: {
  //             include: {
  //               // GemstoneColorVariant: { include: { gemstoneColor: true } },
  //               gemstoneType: {
  //                 select: {
  //                   id: true,
  //                   name: true,
  //                 },
  //               },
  //             },
  //           },
  //           MakingChargeWeightRange: true,
  //           productVariantImage: true,
  //           productSize: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!product) {
  //     throw {
  //       message: "Product not found",
  //     };
  //   }
  //   return product;
  // },

  async getProductBySlug(productVariantSlug) {
    if (!productVariantSlug) {
      throw { message: "Product variant slug is required" };
    }

    // First find the specific variant to get its details
    const currentVariant = await prisma.productVariant.findUnique({
      where: { productVariantSlug },
      include: {
        metalVariant: {
          select: {
            id: true,
            purityLabel: true,
            metalPriceInGram: true,
            byBackPrice: true,
            metalVariantSlug: true,
            metalType: { select: { id: true, name: true } },
          },
        },
        metalColor: {
          select: { id: true, name: true, metalColorSlug: true },
        },
        gemstoneVariant: {
          include: {
            gemstoneType: { select: { id: true, name: true } },
          },
        },
        GlobalDiscount: true,
        MakingChargeWeightRange: true,
        productVariantImage: true,
        productSize: true,
        ScrewOption: true,
        products: {
          include: {
            jewelryType: { select: { name: true } },
            occasion: { select: { name: true, description: true } },
            collection: { select: { name: true, description: true } },
            productStyle: { select: { name: true, description: true } },
          },
        },
      },
    });

    if (!currentVariant) {
      throw { message: "Product variant not found" };
    }

    // Now get all variants for this product to build the grouped variants
    const allVariants = await prisma.productVariant.findMany({
      where: {
        productId: currentVariant.productId,
      },
      include: {
        metalVariant: {
          select: {
            id: true,
            purityLabel: true,
            metalPriceInGram: true,
            byBackPrice: true,
            metalVariantSlug: true,
            metalType: { select: { id: true, name: true } },
          },
        },
        metalColor: {
          select: { id: true, name: true, metalColorSlug: true },
        },
        gemstoneVariant: {
          include: {
            gemstoneType: { select: { id: true, name: true } },
          },
        },
        GlobalDiscount: true,
        MakingChargeWeightRange: true,
        productVariantImage: true,
        productSize: true,
        ScrewOption: true,
      },
    });

    // Get related suggestions
    const relatedSuggestion = await prisma.productVariant.findMany({
      where: {
        products: {
          jewelryTypeId: currentVariant.products.jewelryTypeId,
          id: { not: currentVariant.productId }, // Exclude current product
        },
      },
      select: {
        productVariantTitle: true,
        productVariantSlug: true,
        finalPrice: true,
        productVariantImage: {
          select: {
            imageUrl: true,
          },
        },
        products: {
          select: {
            productSlug: true,
          },
        },
      },
      take: 10,
    });

    // Group variants by metal variant and color
    const grouped = new Map();

    for (const variant of allVariants) {
      const metalVariantId = variant?.metalVariant?.id;
      const metalColorName = variant?.metalColor?.name;

      if (!metalVariantId || !metalColorName) continue;

      if (!grouped.has(metalVariantId)) {
        grouped.set(metalVariantId, {
          metalVariant: variant.metalVariant,
          colors: new Map(),
        });
      }

      const group = grouped.get(metalVariantId);

      if (!group.colors.has(metalColorName)) {
        group.colors.set(metalColorName, variant);
      }
    }

    // Convert to array format
    const groupedVariants = Array.from(grouped.values()).map((group) => ({
      metalVariant: group.metalVariant,
      colors: Array.from(group.colors.entries()).map(([color, variant]) => ({
        color,
        variant,
      })),
    }));

    // Prepare the product object to return
    const product = {
      ...currentVariant.products,
      productVariant: allVariants,
      groupedVariants,
      relatedSuggestion,
    };

    // Ensure the current variant is first in the productVariant array
    product.productVariant = [
      currentVariant,
      ...allVariants.filter((v) => v.id !== currentVariant.id),
    ];

    return product;
  },

  async deleteProduct(id) {
    if (!id) {
      throw {
        message: "Provide all the required fields",
      };
    }
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw {
        message: "Product not found",
      };
    }
    const result = await prisma.product.delete({
      where: { id },
    });

    return result;
  },
  async updateProduct(data) {
    try {
      const {
        id,
        name,
        description,
        jewelryTypeId,
        collectionId,
        productStyleId,
        occasionId,
        tags,
        metaTitle,
        metaDescription,
        metaKeywords,
        productVariantData = [],
      } = data;

      if (
        !id ||
        !name ||
        !jewelryTypeId ||
        !productStyleId ||
        !productVariantData.length
      ) {
        throw {
          statusCode: 400,
          message: "Missing required fields or no variants provided.",
        };
      }

      const [jewelryType, productStyle] = await Promise.all([
        prisma.jewelryType.findUnique({ where: { id: jewelryTypeId } }),
        prisma.productStyle.findMany({ where: { id: { in: productStyleId } } }),
      ]);

      if (!jewelryType)
        throw { statusCode: 404, message: "Jewelry type not found" };
      // if (!productStyle)
      //   throw { statusCode: 404, message: "Product style not found" };

      const productSlug = generateSlug(name);

      return await prisma.$transaction(
        async (tx) => {
          const product = await tx.product.update({
            where: { id },
            data: {
              name,
              productSlug,
              description,
              jewelryTypeId,
              collection: {
                set: [],
                connect: Array.isArray(collectionId)
                  ? collectionId.map((id) => ({ id }))
                  : [{ id: collectionId }],
              },
              productStyle: {
                set: [],
                connect: Array.isArray(productStyleId)
                  ? productStyleId.map((id) => ({ id }))
                  : [{ id: productStyleId }],
              },
              occasion: {
                set: [],
                connect: Array.isArray(occasionId)
                  ? occasionId.map((id) => ({ id }))
                  : [{ id: occasionId }],
              },
              tags,
              metaTitle,
              metaDescription,
              metaKeywords,
            },
          });

          const variants = [];

          for (let index = 0; index < productVariantData.length; index++) {
            const variant = productVariantData[index];

            if (!variant.metalVariantId) {
              throw {
                statusCode: 400,
                message: `Missing metalVariantId at index ${index}`,
              };
            }

            const sizeIds =
              typeof variant.productSizeId === "string"
                ? JSON.parse(variant.productSizeId)
                : variant.productSizeId || [];

            const screwOptions = (() => {
              try {
                const parsed = JSON.parse(variant.screwOption);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            })();

            const [metalVariant, gemstoneVariant, metalColor, chargeRange] =
              await Promise.all([
                tx.metalVariant.findUnique({
                  where: { id: variant.metalVariantId },
                }),
                variant.gemstoneVariantId
                  ? tx.gemstoneVariant.findUnique({
                      where: { id: variant.gemstoneVariantId },
                    })
                  : null,
                variant.metalColorId
                  ? tx.metalColor.findUnique({
                      where: { id: variant.metalColorId },
                    })
                  : null,
                variant.makingChargeWeightRangeId
                  ? tx.makingChargeWeightRange.findUnique({
                      where: { id: variant.makingChargeWeightRangeId },
                    })
                  : null,
              ]);

            const {
              metalCost,
              gemstoneCost,
              sideDiamondCost,
              base,
              makingCharge,
              gstAmount,
              final,
              finalWithGst,
              grossWeight,
            } = calculateFinalProductCost(
              variant,
              metalVariant,
              gemstoneVariant,
              chargeRange
            );

            const sku = generateSku(
              jewelryType,
              metalVariant?.purityLabel,
              gemstoneVariant?.clarity || null
            );

            let updatedVariant;

            if (!variant.productVariantId) {
              // Create new variant
              const createResult =
                await productVariantService.createProductVariant(tx, {
                  metalVariantId: variant.metalVariantId,
                  gemstoneVariantId: variant.gemstoneVariantId,
                  globalMakingChargesId: variant.globalMakingChargesId,
                  makingChargeWeightRangeId: variant.makingChargeWeightRangeId,
                  metalWeightInGram: variant.metalWeightInGram,
                  gemstoneWeightInCarat: variant.gemstoneWeightInCarat,
                  productSizeId: JSON.stringify(sizeIds),
                  productId: id,
                  globalDiscountId: variant.globalDiscountId,
                  karigarId: variant.karigarId,
                  stock: variant.stock,
                  gst: variant.gst,
                  // isFeatured: variant.isFeatured,
                  // isNewArrival: variant.isNewArrival,
                  // newArrivalUntil: variant.newArrivalUntil,
                  returnPolicyText: variant.returnPolicyText,
                  note: variant.note,
                  screwOptions,
                  numberOfDiamonds: variant.numberOfDiamonds,
                  numberOfgemStones: variant.numberOfgemStones,
                  numberOfSideDiamonds: variant.numberOfSideDiamonds,
                  sideDiamondPriceCarat: variant.sideDiamondPriceCarat,
                  sideDiamondWeight: variant.sideDiamondWeight,
                  sideDiamondQuality: variant.sideDiamondQuality,
                  length: variant.length,
                  width: variant.width,
                  height: variant.height,
                  images: variant.images || [],
                  metalColorId: variant.metalColorId,
                });

              const productVariantId = createResult?.data?.id;
              if (!productVariantId) {
                throw {
                  statusCode: 500,
                  message: `Failed to create product variant at index ${index}`,
                };
              }

              updatedVariant = await tx.productVariant.findUnique({
                where: { id: productVariantId },
                include: {
                  metalVariant: { include: { metalType: true } },
                  gemstoneVariant: { include: { gemstoneType: true } },
                  productSize: true,
                  MakingChargeWeightRange: true,
                  GlobalDiscount: true,
                  Karigar: true,
                  ScrewOption: true,
                },
              });
            } else {
              // Update existing variant
              const variantTitle = `${name} - ${metalVariant?.purityLabel} - ${metalColor.name}${gemstoneVariant ? " with " + gemstoneVariant.clarity : ""}`;
              const productVariantSlug = generateSlug(
                name,
                metalVariant.purityLabel || "",
                `${Number.parseFloat(variant.metalWeightInGram)}`,
                metalColor?.name
              );

              updatedVariant = await tx.productVariant.update({
                where: { id: variant.productVariantId },
                data: {
                  productVariantSlug: productVariantSlug,
                  productVariantTitle: variantTitle,
                  numberOfDiamonds: parseInt(variant.numberOfDiamonds) || 0,
                  numberOfgemStones: parseInt(variant.numberOfgemStones) || 0,
                  numberOfSideDiamonds:
                    parseInt(variant.numberOfSideDiamonds) || 0,
                  sideDiamondPriceCarat:
                    parseFloat(variant.sideDiamondPriceCarat) || 0,
                  sideDiamondWeight: parseFloat(variant.sideDiamondWeight) || 0,
                  sideDiamondQuality: variant.sideDiamondQuality,
                  makingChargePrice: Math.round(makingCharge),
                  totalPriceSideDiamond: sideDiamondCost,
                  metalVariant: { connect: { id: variant.metalVariantId } },
                  metalColor: variant.metalColorId
                    ? { connect: { id: variant.metalColorId } }
                    : undefined,
                  gemstoneVariant: variant.gemstoneVariantId
                    ? { connect: { id: variant.gemstoneVariantId } }
                    : undefined,
                  globalMakingCharges: variant.globalMakingChargesId
                    ? { connect: { id: variant.globalMakingChargesId } }
                    : undefined,
                  MakingChargeWeightRange: variant.makingChargeWeightRangeId
                    ? { connect: { id: variant.makingChargeWeightRangeId } }
                    : undefined,
                  Karigar: variant.karigarId
                    ? { connect: { id: variant.karigarId } }
                    : undefined,
                  GlobalDiscount: variant.globalDiscountId
                    ? { connect: { id: variant.globalDiscountId } }
                    : undefined,
                  productSize: {
                    set: [],
                    connect: sizeIds.map((id) => ({ id })),
                  },
                  metalWeightInGram: parseFloat(variant.metalWeightInGram),
                  gemstoneWeightInCarat: parseFloat(
                    variant.gemstoneWeightInCarat
                  ),
                  // sellingPrice: Math.round(finalPrice),
                  // finalPrice: Math.round(finalWithGst),

                  metalPrice: metalCost,
                  diamondPrice: gemstoneCost + sideDiamondCost,
                  sellingPrice: Math.round(base + makingCharge),
                  finalPrice: Math.round(finalWithGst),
                  grossWeight: grossWeight,

                  stock: parseInt(variant.stock) || 0,
                  sku,
                  length: variant.length,
                  width: variant.width,
                  height: variant.height,
                  gst: variant.gst,
                  // isFeatured: !!variant.isFeatured,
                  // isNewArrival: !!variant.isNewArrival,
                  // newArrivalUntil: variant.newArrivalUntil || null,
                  returnPolicyText: variant.returnPolicyText || null,
                  note: variant.note || null,
                  ScrewOption: {
                    deleteMany: {},
                    create: screwOptions.map((s) => ({
                      screwMaterial: s.screwMaterial,
                      screwType: s.screwType,
                      notes: s.notes,
                    })),
                  },
                  updatedAt: new Date(),
                },
                include: {
                  metalVariant: { include: { metalType: true } },
                  gemstoneVariant: { include: { gemstoneType: true } },
                  productSize: true,
                  MakingChargeWeightRange: true,
                  GlobalDiscount: true,
                  Karigar: true,
                  ScrewOption: true,
                },
              });
            }

            variants.push(updatedVariant);
          }

          return { product, variants };
        },
        { timeout: 20000 }
      );
    } catch (error) {
      console.error("Update Product Error:", error);
      throw new Error(
        "Something went wrong while updating the product: " +
          (error.message || error)
      );
    }
  },

  // async updateProduct(data) {
  //   try {
  //     const {
  //       id,
  //       name,
  //       description,
  //       jewelryTypeId,
  //       collectionId,
  //       productStyleId,
  //       occasionId,
  //       tags,
  //       metaTitle,
  //       metaDescription,
  //       metaKeywords,
  //       productVariantData = [],
  //     } = data;

  //     if (
  //       !id ||
  //       !name ||
  //       !jewelryTypeId ||
  //       !productStyleId ||
  //       !productVariantData.length
  //     ) {
  //       throw {
  //         statusCode: 400,
  //         message: "Missing required fields or no variants provided.",
  //       };
  //     }

  //     const [jewelryType, productStyle] = await Promise.all([
  //       prisma.jewelryType.findUnique({ where: { id: jewelryTypeId } }),
  //       prisma.productStyle.findUnique({ where: { id: productStyleId } }),
  //     ]);

  //     if (!jewelryType)
  //       throw { statusCode: 404, message: "Jewelry type not found" };
  //     if (!productStyle)
  //       throw { statusCode: 404, message: "Product style not found" };

  //     const productSlug = generateSlug(name);

  //     return await prisma.$transaction(async (tx) => {
  //       const product = await tx.product.update({
  //         where: { id },
  //         data: {
  //           name,
  //           productSlug,
  //           description,
  //           jewelryTypeId,
  //           collectionId,
  //           productStyleId,
  //           occasionId,
  //           tags,
  //           metaTitle,
  //           metaDescription,
  //           metaKeywords,
  //         },
  //       });

  //       const variants = await Promise.all(
  //         productVariantData.map(async (variant, index) => {
  //           if (!variant.productVariantId) {
  //             throw {
  //               statusCode: 400,
  //               message: `Missing productVariantId at index ${index}`,
  //             };
  //           }

  //           const [
  //             metalVariant,
  //             gemstoneVariant,
  //             chargeRange,
  //             discount,
  //             metalColor,
  //           ] = await Promise.all([
  //             tx.metalVariant.findUnique({
  //               where: { id: variant.metalVariantId },
  //             }),
  //             variant.gemstoneVariantId
  //               ? tx.gemstoneVariant.findUnique({
  //                   where: { id: variant.gemstoneVariantId },
  //                 })
  //               : null,
  //             tx.makingChargeWeightRange.findUnique({
  //               where: { id: variant.makingChargeWeightRangeId },
  //             }),
  //             variant.globalDiscountId
  //               ? tx.globalDiscount.findUnique({
  //                   where: { id: variant.globalDiscountId },
  //                 })
  //               : null,
  //             variant.metalColorId
  //               ? tx.metalColor.findUnique({
  //                   where: { id: variant.metalColorId },
  //                 })
  //               : null,
  //           ]);

  //           if (!metalVariant)
  //             throw { statusCode: 404, message: "Metal variant not found" };
  //           if (variant.gemstoneVariantId && !gemstoneVariant)
  //             throw { statusCode: 404, message: "Gemstone variant not found" };

  //           const generateSkuCode = generateSku(
  //             jewelryType,
  //             metalVariant.purityLabel,
  //             gemstoneVariant?.clarity || null
  //           );

  //           const metalCost =
  //             (parseFloat(variant.metalWeightInGram) || 0) *
  //             (metalVariant.metalPriceInGram || 0);
  //           const gemstoneCost =
  //             (parseFloat(variant.gemstoneWeightInCarat) || 0) *
  //             (gemstoneVariant?.gemstonePrice || 0);
  //           const sideDiamondCost =
  //             (parseFloat(variant.sideDiamondWeight) || 0) *
  //             (parseFloat(variant.sideDiamondPriceCarat) || 0);
  //           const base = metalCost + gemstoneCost + sideDiamondCost;

  //           const makingCharge = calculateCharge(base, {
  //             type: chargeRange?.chargeType,
  //             chargeValue: chargeRange?.chargeValue,
  //             discountType: chargeRange?.discountType,
  //             discountValue: chargeRange?.discountValue,
  //             metalWeight: variant.metalWeightInGram,
  //           });

  //           let final = base + makingCharge;

  //           const gstPercentage = parseInt(variant.gst) || 0;
  //           const gstAmount = (final * gstPercentage) / 100;
  //           const finalWithGst = final + gstAmount;
  //           console.log("variant?.productSizeId==>", variant?.productSizeId);
  //           return tx.productVariant.update({
  //             where: { id: variant.productVariantId },
  //             data: {
  //               productVariantSlug: generateSlug(
  //                 name,
  //                 metalVariant.purityLabel || "",
  //                 `${parseFloat(variant.metalWeightInGram)}`,
  //                 metalColor?.name
  //               ),
  //               productVariantTitle: `${name} - ${metalVariant.purityLabel}${
  //                 gemstoneVariant ? " with " + gemstoneVariant.clarity : ""
  //               }`,
  //               numberOfDiamonds: parseInt(variant.numberOfDiamonds) || 0,
  //               numberOfgemStones: parseInt(variant.numberOfgemStones) || 0,
  //               numberOfSideDiamonds:
  //                 parseInt(variant.numberOfSideDiamonds) || 0,
  //               sideDiamondPriceCarat:
  //                 parseFloat(variant.sideDiamondPriceCarat) || 0,
  //               sideDiamondWeight: parseFloat(variant.sideDiamondWeight) || 0,
  //               totalPriceSideDiamond: sideDiamondCost,
  //               metalVariant: { connect: { id: variant.metalVariantId } },
  //               metalColor: variant.metalColorId
  //                 ? { connect: { id: variant.metalColorId } }
  //                 : undefined,
  //               gemstoneVariant: variant.gemstoneVariantId
  //                 ? { connect: { id: variant.gemstoneVariantId } }
  //                 : undefined,
  //               globalMakingCharges: variant.globalMakingChargesId
  //                 ? { connect: { id: variant.globalMakingChargesId } }
  //                 : undefined,
  //               MakingChargeWeightRange: variant.makingChargeWeightRangeId
  //                 ? { connect: { id: variant.makingChargeWeightRangeId } }
  //                 : undefined,
  //               Karigar: variant.karigarId
  //                 ? { connect: { id: variant.karigarId } }
  //                 : undefined,
  //               GlobalDiscount: variant.globalDiscountId
  //                 ? { connect: { id: variant.globalDiscountId } }
  //                 : undefined,
  //               productSize: {
  //                 set: [],
  //                 connect: variant?.productSizeId
  //                   ? variant.productSizeId?.map((sizeId) => ({
  //                       id: sizeId,
  //                     }))
  //                   : [],
  //               },
  //               metalWeightInGram: parseFloat(variant.metalWeightInGram),
  //               gemstoneWeightInCarat: parseFloat(
  //                 variant.gemstoneWeightInCarat
  //               ),
  //               sellingPrice: Math.round(final - gstAmount),
  //               finalPrice: Math.round(finalWithGst),
  //               stock: parseInt(variant.stock) || 0,
  //               sku: generateSkuCode,
  //               length: variant.length,
  //               width: variant.width,
  //               height: variant.height,
  //               gst: gstPercentage,
  //               isFeatured: variant.isFeatured === "false" ? false : true,
  //               isNewArrival: variant.isNewArrival === "false" ? false : true,
  //               newArrivalUntil: variant.newArrivalUntil || null,
  //               returnPolicyText: variant.returnPolicyText || null,
  //               ScrewOption: variant.screwOption
  //                 ? {
  //                     deleteMany: {},
  //                     create: (() => {
  //                       try {
  //                         const parsed = JSON.parse(variant.screwOption);
  //                         if (!Array.isArray(parsed)) return [];
  //                         return parsed.map((screw) => ({
  //                           screwMaterial: screw.screwMaterial,
  //                           screwType: screw.screwType,
  //                           notes: screw.notes,
  //                         }));
  //                       } catch (err) {
  //                         console.warn(
  //                           "Invalid screwOption JSON",
  //                           variant.screwOption
  //                         );
  //                         return [];
  //                       }
  //                     })(),
  //                   }
  //                 : undefined,
  //             },
  //             include: {
  //               metalVariant: { include: { metalType: true } },
  //               gemstoneVariant: { include: { gemstoneType: true } },
  //               productSize: true,
  //               MakingChargeWeightRange: true,
  //               GlobalDiscount: true,
  //               Karigar: true,
  //               ScrewOption: true,
  //             },
  //           });
  //         })
  //       );

  //       return { product, variants };
  //     });
  //   } catch (error) {
  //     console.error("Update Product Error:", error);
  //     throw new Error(
  //       "Something went wrong while updating the product: " + error.message
  //     );
  //   }
  // },
  async addProductVariant(productId, variantData) {
    if (!productId || !variantData) {
      throw {
        message: "Provide a valid product ID and product variant data",
      };
    }

    console.log("Id", productId);
    console.log("addProductVariant", variantData);

    // 1. Fetch and validate the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw {
        message:
          "Product not found. Cannot add a variant to a non-existent product.",
      };
    }

    // 2. Validate product size
    if (!variantData.productSizeId) {
      throw { message: "Product size ID is required" };
    }

    const productSize = await prisma.productVariantSize.findUnique({
      where: { id: variantData.productSizeId },
    });

    if (!productSize) {
      throw {
        message: `Product size with ID ${variantData.productSizeId} not found.`,
      };
    }

    // 3. Fetch related entities
    const [metalVariant, gemstoneVariant, charge, coupon] = await Promise.all([
      prisma.metalVariant.findUnique({
        where: { id: variantData.metalVariantId },
      }),
      variantData.gemstoneVariantId
        ? prisma.gemstoneVariant.findUnique({
            where: { id: variantData.gemstoneVariantId },
          })
        : null,
      prisma.globalMakingCharge.findUnique({
        where: { id: variantData.globalMakingChargesId },
      }),
      variantData.couponId
        ? prisma.coupon.findUnique({
            where: { id: variantData.couponId },
          })
        : null,
    ]);

    if (!metalVariant || !charge) {
      throw {
        message: "Invalid metalVariantId or globalMakingChargesId",
      };
    }

    // Step 7: Check for existing duplicate variant before proceeding
    const existingVariant = await prisma.productVariant.findFirst({
      where: {
        productId,
        metalVariantId: variantData.metalVariantId,
        gemstoneVariantId: variantData.gemstoneVariantId ?? null,
        globalMakingChargesId: variantData.globalMakingChargesId,
        productSizeId: variantData.productSizeId,
        metalWeightInGram: variantData.metalWeightInGram ?? 0,
        gemstoneWeightInCarat: variantData.gemstoneWeightInCarat ?? 0,
      },
    });

    if (existingVariant) {
      throw {
        statusCode: 409,
        message: `A product variant with the same combination already exists (Variant ID: ${existingVariant.id}).`,
        code: "DUPLICATE_PRODUCT_VARIANT",
        suggestion:
          "Try updating the existing variant instead of creating a new one.",
      };
    }

    // 4. Count existing variants with the same productId and purityLabel
    const existingCount = await prisma.productVariant.count({
      where: {
        productId,
        metalVariant: {
          purityLabel: metalVariant.purityLabel,
        },
      },
    });

    // 5. Generate unique slug
    const baseSlug = `${product.name}-${metalVariant.purityLabel}-${
      existingCount + 1
    }`;
    const uniqueSlug = await generateUniqueSlug(baseSlug, prisma);

    // 6. Calculate pricing
    const metalCost =
      (variantData.metalWeightInGram || 0) *
      (metalVariant.metalPriceInGram || 0);
    const gemstoneCost =
      (variantData.gemstoneWeightInCarat || 0) *
      (gemstoneVariant?.gemstonePrice || 0);

    const baseAmount = metalCost + gemstoneCost;

    const makingCharge = calculateCharge(
      baseAmount,
      charge,
      variantData.metalWeightInGram,
      variantData.gemstoneWeightInCarat
    );

    let sellingPrice = baseAmount + makingCharge;
    let finalPrice = sellingPrice;

    // 7. Apply coupon
    const isCouponValid =
      coupon?.isActive &&
      (!coupon.validTo || new Date(coupon.validTo) > new Date());

    if (coupon && isCouponValid) {
      if (coupon.discountType === "PERCENTAGE") {
        finalPrice -= (sellingPrice * coupon.discountValue) / 100;
      } else if (coupon.discountType === "FIXED") {
        finalPrice -= coupon.discountValue;
      }

      finalPrice = Math.max(finalPrice, 0); // Prevent negative price
    }

    finalPrice = Math.round(finalPrice);
    sellingPrice = Math.round(sellingPrice);

    // 8. Create the product variant
    const newVariant = await prisma.productVariant.create({
      data: {
        productVariantSlug: uniqueSlug,
        metalVariantId: variantData.metalVariantId,
        gemstoneVariantId: variantData.gemstoneVariantId,
        globalMakingChargesId: variantData.globalMakingChargesId,
        metalWeightInGram: variantData.metalWeightInGram,
        gemstoneWeightInCarat: variantData.gemstoneWeightInCarat,
        productId,
        productSizeId: variantData.productSizeId,
        occasionId: variantData.occasionId,
        sellingPrice,
        finalPrice,
        couponId: variantData.couponId ?? null,
        stock: variantData.stock ?? 0,
      },
    });

    console.log("newVariant", newVariant);
    return newVariant;
  },
  async bulkCreateProductAndProductVariant(products) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const createdProducts = [];

          for (const product of products) {
            const {
              name,
              description,
              jewelryTypeSlug,
              collectionSlug,
              productStyleSlug,
              occasionSlug,
              tags,
              metaTitle,
              metaDescription,
              metaKeywords,
              productVariants,
            } = product;


            if (
              !name ||
              !jewelryTypeSlug ||
              !productStyleSlug ||
              !Array.isArray(productVariants) ||
              productVariants.length === 0
            ) {
              throw new Error("Missing required product fields or variants");
            }

            const [jewelryType, collections, productStyles, occasions] =
              await Promise.all([
                tx.jewelryType.findUnique({ where: { jewelryTypeSlug } }),
                collectionSlug
                  ? tx.collection.findMany({
                      where: { collectionSlug: { in: collectionSlug } },
                    })
                  : [],
                Promise.all(
                  productStyleSlug.map((slug) =>
                    tx.productStyle.findUnique({
                      where: { productStyleSlug: slug },
                    })
                  )
                ).then((styles) => styles.filter(Boolean)),
                occasionSlug
                  ? tx.occasion.findMany({
                      where: { occasionSlug: { in: occasionSlug } },
                    })
                  : [],
              ]);

            if (!jewelryType || !productStyles.length === 0) {
              throw new Error("Invalid jewelryTypeSlug or productStyleSlug");
            }

            const productSlug = generateSlug(name);
            const existingProduct = await tx.product.findUnique({
              where: { productSlug },
            });

            let newProduct;

            if (existingProduct) {
              newProduct = await tx.product.update({
                where: { productSlug },
                data: {
                  description,
                  jewelryType: {
                    connect: { id: jewelryType.id },
                  },

                  collection: {
                    set: collections.map((c) => ({ id: c.id })),
                  },
                  occasion: {
                    set: occasions.map((o) => ({ id: o.id })),
                  },
                  productStyle: {
                    set: productStyles.map((style) => ({ id: style.id })), // re-link styles
                  },
                  tags: tags || [],
                  metaTitle: metaTitle || null,
                  metaDescription: metaDescription || null,
                  metaKeywords: metaKeywords ? metaKeywords.split(",") : [],
                },
              });
            } else {
              newProduct = await tx.product.create({
                data: {
                  name,
                  productSlug,
                  description,
                  jewelryType: {
                    connect: { id: jewelryType.id },
                  },

                  collection: {
                    connect: collections.map((c) => ({ id: c.id })),
                  },
                  occasion: {
                    connect: occasions.map((o) => ({ id: o.id })),
                  },
                  productStyle: {
                    connect: productStyles.map((style) => ({ id: style.id })),
                  },
                  tags: tags || [],
                  metaTitle: metaTitle || null,
                  metaDescription: metaDescription || null,
                  metaKeywords: metaKeywords ? metaKeywords.split(",") : [],
                },
              });
            }

            const createdVariants = [];

            for (const variant of productVariants) {
              const {
                metalVariantSlug,
                gemstoneVariantSlug,
                globalMakingChargeSlug,
                metalColorSlug,
                globalDiscountSlug,
                metalWeightInGram: rawMetalWeight,
                 diamondInWeightCarat,
                stock,
                gst,
                productSizeSlug,
                // isFeatured,
                // isNewArrival,
                // newArrivalUntil,
                returnPolicyText,
                note,
                screwOption = "[]",
                images = [],
              } = variant;
              // console.log("Processing variant:", variant.productSizeSlug);             


              const metalWeightInGram = parseFloat(rawMetalWeight) || 0;
              const gemstoneWeightInCarat = parseFloat(variant.diamondInWeightCarat) || 0;

              // console.log("gemstoneWeightInCarat==>", gemstoneWeightInCarat);
              

              const [
                metalVariant,
                gemstoneVariant,
                chargeRange,
                metalColor,
                discount,
                productSizeData,
              ] = await Promise.all([
                tx.metalVariant.findUnique({ where: { metalVariantSlug } }),
                gemstoneVariantSlug
                  ? tx.gemstoneVariant.findUnique({
                      where: { gemstoneVariantSlug },
                    })
                  : null,
                tx.makingChargeWeightRange.findUnique({
                  where: { globalMakingChargeSlug },
                }),
                metalColorSlug
                  ? tx.metalColor.findFirst({
                      where: { metalColorSlug },
                    })
                  : null,
                globalDiscountSlug
                  ? tx.globalDiscount.findUnique({
                      where: { globalDiscountSlug },
                    })
                  : null,
                Array.isArray(productSizeSlug)
                  ? tx.productVariantSize.findMany({
                      where: {
                        productSizeSlug: {
                          in: productSizeSlug,
                        },
                      },
                    })
                  : [],
              ]);

              // console.log("productSizeData==>", productSizeData);

              if (!metalVariant || !chargeRange) continue;

              const existingVariant = await tx.productVariant.findFirst({
                where: {
                  productId: newProduct.id,
                  metalVariantId: metalVariant.id,
                  gemstoneVariantId: gemstoneVariant?.id || null,
                  metalWeightInGram,
                  gemstoneWeightInCarat,
                },
              });

              if (existingVariant) {
                console.log(`SKIPPED: Variant already exists for ${name}`);
                continue;
              }

              // const metalCost =
              //   metalWeightInGram * (metalVariant.metalPriceInGram || 0);
              // const gemstoneCost =
              //   gemstoneWeightInCarat * (gemstoneVariant?.gemstonePrice || 0);
              // const base = metalCost + gemstoneCost;

              // const makingCharge = calculateCharge(base, {
              //   type: chargeRange.chargeType,
              //   chargeValue: chargeRange.chargeValue,
              //   discountType: chargeRange.discountType,
              //   discountValue: chargeRange.discountValue,
              //   metalWeight: metalWeightInGram,
              // });

              // let final = base + makingCharge;

              const {
                metalCost,
                gemstoneCost,
                sideDiamondCost,
                base,
                makingCharge,
                gstAmount,
                final,
                finalWithGst,
                grossWeight,
              } = calculateFinalProductCost(
                variant,
                metalVariant,
                gemstoneVariant,
                chargeRange
              );

              if (
                discount?.isActive &&
                (!discount.validTo || new Date(discount.validTo) > new Date())
              ) {
                final -=
                  discount.discountType === "PERCENTAGE"
                    ? (final * discount.discountValue) / 100
                    : discount.discountValue;
                final = Math.max(final, 0);
              }

              const gstPercentage = parseInt(gst) || 0;
              // const gstAmount = (final * gstPercentage) / 100;
              // const finalWithGst = final + gstAmount;

              const sku = generateSku(
                jewelryType,
                metalVariant.purityLabel,
                gemstoneVariant?.clarity
              );
              const baseSlug = generateSlug(
                `${name}-${metalVariant.purityLabel}-${metalWeightInGram}-${gemstoneWeightInCarat}`
              );
              let productVariantSlug = baseSlug;
              let suffix = 1;
              while (
                await tx.productVariant.findUnique({
                  where: { productVariantSlug },
                })
              ) {
                productVariantSlug = `${baseSlug}-${suffix++}`;
              }

              const createdVariant = await tx.productVariant.create({
                data: {
                  productVariantSlug,
                  productVariantTitle: `${name} - ${metalVariant.purityLabel}${gemstoneVariant ? " with " + gemstoneVariant.clarity : ""}`,
                  numberOfDiamonds: parseInt(variant.numberOfDiamonds) || 0,
                  numberOfgemStones: parseInt(variant.numberOfgemStones) || 0,
                  metalPrice: metalCost,
                  diamondPrice: gemstoneCost,
                  gemstoneWeightInCarat:
                    parseFloat(variant.diamondInWeightCarat) || 0,
                  makingChargePrice: Math.round(makingCharge),
                  grossWeight,
                  numberOfSideDiamonds:
                    parseInt(variant.numberOfSideDiamonds) || 0,
                  sideDiamondPriceCarat:
                    parseFloat(variant.sideDiamondPriceCarat) || 0,
                  sideDiamondWeight: parseFloat(variant.sideDiamondWeight) || 0,
                  sideDiamondQuality: variant.sideDiamondQuality || null,
                  totalPriceSideDiamond:
                    parseFloat(variant.totalPriceSideDiamond) || 0,
                  metalVariantId: metalVariant.id,
                  metalColorId: metalColor.id,
                  gemstoneVariantId: gemstoneVariant?.id || null,
                  makingChargeWeightRangeId: chargeRange.id,
                  globalDiscountId: discount?.id || null,
                  metalWeightInGram,
                  gemstoneWeightInCarat,
                  productId: newProduct.id,
                  productSize: {
                    connect: productSizeData.map((size) => ({ id: size.id })),
                  },
                  sellingPrice: Math.round(base + makingCharge),
                  finalPrice: Math.round(finalWithGst),
                  stock: parseInt(stock) || 0,
                  gst: gstPercentage,
                  height: variant.height ? String(variant.height) : null,
                  width: variant.width ? String(variant.width) : null,
                  length: variant.length ? String(variant.length) : null,
                  note: variant.note,
                  sku,
                  // isFeatured: isFeatured ?? false,
                  // isNewArrival: isNewArrival ?? false,
                  // newArrivalUntil: newArrivalUntil || null,
                  returnPolicyText: returnPolicyText || null,
                  ScrewOption: {
                    create: (() => {
                      try {
                        // Handle all possible screwOption formats
                        if (typeof screwOption === "string") {
                          return JSON.parse(screwOption).map((s) => ({
                            screwMaterial: s.screwMaterial,
                            screwType: s.screwType,
                            notes: s.notes,
                          }));
                        } else if (Array.isArray(screwOption)) {
                          return screwOption.map((s) => ({
                            screwMaterial: s.screwMaterial,
                            screwType: s.screwType,
                            notes: s.notes,
                          }));
                        } else if (
                          screwOption &&
                          typeof screwOption === "object"
                        ) {
                          return [
                            {
                              screwMaterial: screwOption.screwMaterial,
                              screwType: screwOption.screwType,
                              notes: screwOption.notes,
                            },
                          ];
                        }
                        return [];
                      } catch (e) {
                        console.error("Error parsing screwOption:", e);
                        return [];
                      }
                    })(),
                  },
                  // productVariantImage: {
                  //   createMany: {
                  //     data: images.map((imgUrl, index) => ({
                  //       imageUrl:
                  //         typeof imgUrl === "string" ? imgUrl : imgUrl.imageUrl,
                  //       displayOrder:
                  //         typeof imgUrl === "object" &&
                  //         imgUrl.displayOrder !== undefined
                  //           ? imgUrl.displayOrder
                  //           : index,
                  //     })),
                  //   },
                  // },
                },
                include: {
                  metalVariant: { include: { metalType: true } },
                  gemstoneVariant: { include: { gemstoneType: true } },
                  productSize: true,
                  // productVariantImage: true,
                  ScrewOption: true,
                },
              });

              createdVariants.push(createdVariant);
            }

            createdProducts.push({
              product: newProduct,
              variants: createdVariants,
            });
          }

          return createdProducts;
        },
        {
          maxWait: 10000,
          timeout: 30000,
        }
      );
    } catch (error) {
      console.error("Bulk product creation failed:", error);
      throw new Error("Bulk product creation failed: " + error.message);
    }
  },
  // async bulkCreateProductAndProductVariant(products) {
  //   try {
  //     return await prisma.$transaction(async (tx) => {
  //       const createdProducts = [];

  //       for (const product of products) {
  //         const {
  //           name,
  //           description,
  //           jewelryTypeSlug,
  //           collectionSlug,
  //           productStyleSlug,
  //           occasionSlug,
  //           tags,
  //           metaTitle,
  //           metaDescription,
  //           metaKeywords,
  //           productVariants,
  //         } = product;

  //         if (
  //           !name ||
  //           !jewelryTypeSlug ||
  //           !productStyleSlug ||
  //           !Array.isArray(productVariants) ||
  //           productVariants.length === 0
  //         ) {
  //           throw new Error("Missing required product fields or variants");
  //         }

  //         const [jewelryType, collection, productStyle, occasion] =
  //           await Promise.all([
  //             tx.jewelryType.findUnique({ where: { jewelryTypeSlug } }),
  //             collectionSlug
  //               ? tx.collection.findUnique({ where: { collectionSlug } })
  //               : null,
  //             tx.productStyle.findUnique({ where: { productStyleSlug } }),
  //             occasionSlug
  //               ? tx.occasion.findUnique({ where: { occasionSlug } })
  //               : null,
  //           ]);

  //         if (!jewelryType || !productStyle) {
  //           throw new Error("Invalid jewelryTypeSlug or productStyleSlug");
  //         }

  //         const productSlug = generateSlug(name);
  //         const existingProduct = await tx.product.findUnique({
  //           where: { productSlug },
  //         });

  //         const newProduct =
  //           existingProduct ||
  //           (await tx.product.create({
  //             data: {
  //               name,
  //               productSlug,
  //               description,
  //               jewelryTypeId: jewelryType.id,
  //               collectionId: collection?.id || null,
  //               productStyleId: productStyle.id,
  //               occasionId: occasion?.id || null,
  //               tags: tags || [],
  //               metaTitle,
  //               metaDescription,
  //               metaKeywords,
  //             },
  //           }));

  //         const createdVariants = [];

  //         for (const variant of productVariants) {
  //           const {
  //             metalVariantSlug,
  //             gemstoneVariantSlug,
  //             productSizeSlug,
  //             globalMakingChargeSlug,
  //             globalDiscountSlug,
  //             metalWeightInGram: rawMetalWeight,
  //             gemstoneWeightInCarat: rawGemstoneWeight,
  //             stock,
  //             gst,
  //             isFeatured,
  //             isNewArrival,
  //             newArrivalUntil,
  //             returnPolicyText,
  //             screwOption = "[]",
  //             images = [],
  //           } = variant;

  //           const metalWeightInGram = parseFloat(rawMetalWeight) || 0;
  //           const gemstoneWeightInCarat = parseFloat(rawGemstoneWeight) || 0;

  //           const [
  //             metalVariant,
  //             gemstoneVariant,
  //             chargeRange,
  //             discount,
  //             productSize,
  //           ] = await Promise.all([
  //             tx.metalVariant.findUnique({ where: { metalVariantSlug } }),
  //             gemstoneVariantSlug
  //               ? tx.gemstoneVariant.findUnique({
  //                   where: { gemstoneVariantSlug },
  //                 })
  //               : null,
  //             tx.makingChargeWeightRange.findUnique({
  //               where: { globalMakingChargeSlug },
  //             }),
  //             globalDiscountSlug
  //               ? tx.globalDiscount.findUnique({
  //                   where: { globalDiscountSlug },
  //                 })
  //               : null,
  //             productSizeSlug
  //               ? tx.productVariantSize.findUnique({
  //                   where: { productSizeSlug },
  //                 })
  //               : null,
  //           ]);

  //           if (!metalVariant || !chargeRange) continue;

  //           const existingVariant = await tx.productVariant.findFirst({
  //             where: {
  //               productId: newProduct.id,
  //               metalVariantId: metalVariant.id,
  //               gemstoneVariantId: gemstoneVariant?.id || null,
  //               metalWeightInGram: metalWeightInGram,
  //               gemstoneWeightInCarat: gemstoneWeightInCarat,
  //             },
  //           });

  //           if (existingVariant) {
  //             console.log(`SKIPPED: Variant already exists for ${name}`);
  //             continue;
  //           }

  //           const metalCost =
  //             metalWeightInGram * (metalVariant.metalPriceInGram || 0);
  //           const gemstoneCost =
  //             gemstoneWeightInCarat * (gemstoneVariant?.gemstonePrice || 0);
  //           const base = metalCost + gemstoneCost;

  //           const makingCharge = calculateCharge(base, {
  //             type: chargeRange.chargeType,
  //             chargeValue: chargeRange.chargeValue,
  //             discountType: chargeRange.discountType,
  //             discountValue: chargeRange.discountValue,
  //             metalWeight: metalWeightInGram,
  //           });

  //           let final = base + makingCharge;

  //           if (
  //             discount?.isActive &&
  //             (!discount.validTo || new Date(discount.validTo) > new Date())
  //           ) {
  //             final -=
  //               discount.discountType === "PERCENTAGE"
  //                 ? (final * discount.discountValue) / 100
  //                 : discount.discountValue;
  //             final = Math.max(final, 0);
  //           }

  //           const gstPercentage = parseInt(gst) || 0;
  //           const gstAmount = (final * gstPercentage) / 100;
  //           const finalWithGst = final + gstAmount;

  //           const sku = generateSku(
  //             jewelryType,
  //             metalVariant.purityLabel,
  //             gemstoneVariant?.clarity
  //           );
  //           const baseSlug = generateSlug(
  //             `${name}-${metalVariant.purityLabel}-${metalWeightInGram}-${gemstoneWeightInCarat}`
  //           );
  //           let productVariantSlug = baseSlug;
  //           let suffix = 1;
  //           while (
  //             await tx.productVariant.findUnique({
  //               where: { productVariantSlug },
  //             })
  //           ) {
  //             productVariantSlug = `${baseSlug}-${suffix++}`;
  //           }

  //           const createdVariant = await tx.productVariant.create({
  //             data: {
  //               productVariantSlug,
  //               productVariantTitle: `${name} - ${metalVariant.purityLabel}${gemstoneVariant ? " with " + gemstoneVariant.clarity : ""}`,
  //               numberOfDiamonds: parseInt(variant.numberOfDiamonds) || 0,
  //               numberOfgemStones: parseInt(variant.numberOfgemStones) || 0,
  //               metalVariantId: metalVariant.id,
  //               gemstoneVariantId: gemstoneVariant?.id || null,
  //               makingChargeWeightRangeId: chargeRange.id,
  //               globalDiscountId: discount?.id || null,
  //               metalWeightInGram,
  //               gemstoneWeightInCarat,
  //               productId: newProduct.id,
  //               // productSizeId: productSize?.id || null,
  //               sellingPrice: Math.round(base + makingCharge),
  //               finalPrice: Math.round(finalWithGst),
  //               stock: parseInt(stock) || 0,
  //               gst: gstPercentage,
  //               sku,
  //               isFeatured: isFeatured ?? false,
  //               isNewArrival: isNewArrival ?? false,
  //               newArrivalUntil: newArrivalUntil || null,
  //               returnPolicyText: returnPolicyText || null,
  //               ScrewOption: {
  //                 create: JSON.parse(screwOption).map((s) => ({
  //                   screwMaterial: s.screwMaterial,
  //                   screwType: s.screwType,
  //                   notes: s.notes,
  //                 })),
  //               },
  //               productVariantImage: {
  //                 createMany: {
  //                   data: images.map((imgUrl) => ({ imageUrl: imgUrl })),
  //                 },
  //               },
  //             },
  //             include: {
  //               metalVariant: { include: { metalType: true } },
  //               gemstoneVariant: { include: { gemstoneType: true } },
  //               productSize: true,
  //               productVariantImage: true,
  //               ScrewOption: true,
  //             },
  //           });

  //           createdVariants.push(createdVariant);
  //         }

  //         createdProducts.push({
  //           product: newProduct,
  //           variants: createdVariants,
  //         });
  //       }

  //       return createdProducts;
  //     });
  //   } catch (error) {
  //     console.error("Bulk product creation failed:", error);
  //     throw new Error("Bulk product creation failed ", error.message);
  //   }
  // },

  async fetchKarigar() {
    try {
      const result = await prisma.KarigarDetails.findMany();
      return result;
    } catch (error) {
      console.error(`Error in fetching Karigar: ${error}`);
      throw error;
    }
  },
};
export default productService;
