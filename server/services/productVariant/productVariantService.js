import prisma from "../../config/prismaClient.js";
import { calculateFinalProductCost } from "../../helper/productPriceCalculation.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import calculateCharge from "../../utils/calculatingMakingPrice.js";
import { generateSku } from "../../utils/generateSKU.js";
import { paginate } from "../../utils/pagination.js";

const productVariantService = {
  //  async createProductVariant({
  //     metalVariantId,
  //     gemstoneVariantId,
  //     globalMakingChargesId,
  //     makingChargeWeightRangeId,
  //     metalWeightInGram,
  //     gemstoneWeightInCarat,
  //     productSizeId,
  //     productId,
  //     globalDiscountId,
  //     karigarId,
  //     stock,
  //     gst = 0,
  //     isFeatured = false,
  //     isNewArrival = false,
  //     newArrivalUntil = null,
  //     returnPolicyText = null,
  //     screwOptions = [],
  //   }) {
  //     if (
  //       !productId ||
  //       !metalVariantId ||
  //       !makingChargeWeightRangeId ||
  //       metalWeightInGram === undefined ||
  //       stock === undefined
  //     ) {
  //       throw { message: "Missing required fields" };
  //     }

  //     const [product, metalVariant, gemstoneVariant, chargeRange, discount] =
  //       await Promise.all([
  //         prisma.product.findUnique({
  //           where: { id: productId },
  //           include: {
  //             jewelryType: {
  //               select: {
  //                 name: true,
  //               },
  //             },
  //           },
  //         }),
  //         prisma.metalVariant.findUnique({ where: { id: metalVariantId } }),
  //         gemstoneVariantId
  //           ? prisma.gemstoneVariant.findUnique({
  //               where: { id: gemstoneVariantId },
  //             })
  //           : null,
  //         prisma.makingChargeWeightRange.findUnique({
  //           where: { id: makingChargeWeightRangeId },
  //         }),
  //         globalDiscountId
  //           ? prisma.globalDiscount.findUnique({
  //               where: { id: globalDiscountId },
  //             })
  //           : null,
  //       ]);

  //     if (!product || !metalVariant || !chargeRange) {
  //       throw {
  //         message: "Invalid references for product, metal, or charge range",
  //       };
  //     }

  //     // SKU generation
  //     const generateSkuCode = generateSku(
  //       product.jewelryType.name,
  //       metalVariant.purityLabel,
  //       gemstoneVariant.clarity
  //     );

  //     // Slug
  //     const variantSlug = generateSlug(
  //       product.name,
  //       metalVariant.purityLabel,
  //       gemstoneVariant?.clarity || "",
  //       Date.now().toString()
  //     );

  //     // Base cost
  //     const metalCost =
  //       (metalWeightInGram || 0) * (metalVariant.metalPriceInGram || 0);
  //     const gemstoneCost =
  //       (gemstoneWeightInCarat || 0) * (gemstoneVariant?.gemstonePrice || 0);
  //     const base = metalCost + gemstoneCost;

  //     // Making charge
  //     const makingCharge = calculateCharge(base, {
  //       type: chargeRange.chargeType,
  //       chargeValue: chargeRange.chargeValue,
  //       discountType: chargeRange.discountType,
  //       discountValue: chargeRange.discountValue,
  //     });

  //     // Final price before GST
  //     let final = base + makingCharge;

  //     // GST
  //     const gstAmount = (final * gst) / 100;
  //     const finalWithGst = final + gstAmount;

  //     const productVariant = await prisma.productVariant.create({
  //       data: {
  //         productVariantSlug: variantSlug,
  //         productVariantTitle: `${product.name} - ${metalVariant.purityLabel}${
  //           gemstoneVariant ? " with " + gemstoneVariant.clarity : ""
  //         }`,
  //         metalVariantId,
  //         gemstoneVariantId,
  //         globalMakingChargesId,
  //         makingChargeWeightRangeId,
  //         karigarId,
  //         globalDiscountId,
  //         metalWeightInGram,
  //         gemstoneWeightInCarat,
  //         productId,
  //         productSizeId,
  //         sellingPrice: Math.round(base + makingCharge),
  //         finalPrice: Math.round(finalWithGst),
  //         stock,
  //         sku: generateSkuCode,
  //         gst,
  //         isFeatured,
  //         isNewArrival,
  //         newArrivalUntil,
  //         returnPolicyText,
  //       },
  //     });

  //     // ✅ Step 6: Create screw options if provided
  //     if (screwOptions?.length > 0) {
  //       const screwData = screwOptions.map((opt) => ({
  //         productVariantId: productVariant.id,
  //         screwType: opt.screwType,
  //         screwMaterial: opt.screwMaterial || null,
  //         isDetachable: opt.isDetachable ?? null,
  //         notes: opt.notes || null,
  //       }));

  //       await prisma.screwOption.createMany({ data: screwData });
  //     }

  //     return {
  //       success: true,
  //       status: 201,
  //       message: "Product variant created successfully",
  //       data: productVariant,
  //     };
  //   },
  async createProductVariant(tx, variant) {
    // console.log(
    //   "data=>",
    //   metalVariantId,
    //   gemstoneVariantId,
    //   globalMakingChargesId,
    //   makingChargeWeightRangeId,
    //   metalWeightInGram,
    //   gemstoneWeightInCarat,
    //   productSizeId, // assumed as JSON stringified array of IDs
    //   productId,
    //   globalDiscountId,
    //   karigarId,
    //   stock,
    //   (gst = 0),
    //   (isFeatured = false),
    //   (isNewArrival = false),
    //   (newArrivalUntil = null),
    //   (returnPolicyText = null),
    //   (screwOptions = []),
    //   (numberOfDiamonds = 0),
    //   (numberOfgemStones = 0),
    //   (numberOfSideDiamonds = 0),
    //   (sideDiamondPriceCarat = 0),
    //   (sideDiamondWeight = 0),
    //   (length = null),
    //   (width = null),
    //   (height = null),
    //   (images = []), // array of strings or { imageUrl, displayOrder }
    //   metalColorId
    // );
    // console.log("inside create variant==>", variant);
    const {
      metalVariantId,
      gemstoneVariantId,
      globalMakingChargesId,
      makingChargeWeightRangeId,
      metalWeightInGram,
      gemstoneWeightInCarat,
      productSizeId, // assumed as JSON stringified array of IDs
      productId,
      globalDiscountId,
      karigarId,
      stock,
      gst = 0,
      isFeatured = false,
      isNewArrival = false,
      newArrivalUntil = null,
      returnPolicyText = null,
      note = null,
      screwOptions = [],
      makingChargePrice = 0,
      numberOfDiamonds = 0,
      numberOfgemStones = 0,
      numberOfSideDiamonds = 0,
      sideDiamondPriceCarat = 0,
      sideDiamondWeight = 0,
      sideDiamondQuality = "Good",
      length = null,
      width = null,
      height = null,
      images = [], // array of strings or { imageUrl, displayOrder }
      metalColorId = null,
    } = variant;

    if (
      !productId ||
      !metalVariantId ||
      !makingChargeWeightRangeId ||
      metalWeightInGram === undefined ||
      stock === undefined
    ) {
      throw { message: "Missing required fields" };
    }

    const [
      product,
      metalVariant,
      gemstoneVariant,
      chargeRange,
      metalColor,
      // discount,
    ] = await Promise.all([
      tx.product.findUnique({
        where: { id: productId },
        include: {
          jewelryType: { select: { name: true } },
        },
      }),
      tx.metalVariant.findUnique({ where: { id: metalVariantId } }),
      gemstoneVariantId
        ? tx.gemstoneVariant.findUnique({
            where: { id: gemstoneVariantId },
          })
        : null,
      tx.makingChargeWeightRange.findUnique({
        where: { id: makingChargeWeightRangeId },
      }),
      metalColorId
        ? tx.metalColor.findUnique({
            where: { id: metalColorId },
          })
        : null,
      // globalDiscountId
      //   ? prisma.globalDiscount.findUnique({
      //       where: { id: globalDiscountId },
      //     })
      //   : null,
    ]);

    if (!product || !metalVariant || !chargeRange) {
      throw {
        message: "Invalid references for product, metal, or charge range",
      };
    }

    // Cost Calculation
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
    console.log("makingCharge:", makingCharge);

    // const metalCost =
    //   Number.parseFloat(metalWeightInGram) *
    //   (metalVariant.metalPriceInGram || 0);
    // const gemstoneCost =
    //   Number.parseFloat(gemstoneWeightInCarat || 0) *
    //   (gemstoneVariant?.gemstonePrice || 0);
    // const sideDiamondCost =
    //   Number.parseFloat(sideDiamondWeight || 0) *
    //   Number.parseFloat(sideDiamondPriceCarat || 0);
    // console.log("sideDiamondCost=", sideDiamondCost);
    // const base = metalCost + gemstoneCost + sideDiamondCost;

    // const makingCharge = calculateCharge(base, {
    //   type: chargeRange.chargeType,
    //   chargeValue: chargeRange.chargeValue,
    //   discountType: chargeRange.discountType,
    //   discountValue: chargeRange.discountValue,
    //   metalWeight: metalWeightInGram,
    // });

    // let final = base + makingCharge;

    // const gstPercentage = parseInt(gst) || 0;
    // const gstAmount = (final * gstPercentage) / 100;
    // const finalWithGst = final + gstAmount;

    const generateSkuCode = generateSku(
      product.jewelryType.name,
      metalVariant.purityLabel,
      gemstoneVariant?.clarity
    );

    const productVariantSlug = generateSlug(
      product.name,
      metalVariant.purityLabel || "",
      `${parseFloat(metalWeightInGram)}`,
      metalColor?.name
    );
    const variantTitle = `${product?.name} - ${metalVariant?.purityLabel} - ${metalColor?.name}${gemstoneVariant ? " with " + gemstoneVariant?.clarity : ""}`;

    const createdVariant = await prisma.productVariant.create({
      data: {
        productVariantSlug,
        productVariantTitle: variantTitle,
        numberOfDiamonds: parseInt(numberOfDiamonds) || 0,
        numberOfgemStones: parseInt(numberOfgemStones) || 0,
        numberOfSideDiamonds: parseInt(numberOfSideDiamonds) || 0,
        sideDiamondPriceCarat: parseFloat(sideDiamondPriceCarat) || 0,
        sideDiamondWeight: parseFloat(sideDiamondWeight) || 0,
        makingChargePrice: Math.round(makingCharge),
        sideDiamondQuality: sideDiamondQuality,
        totalPriceSideDiamond: sideDiamondCost,
        metalVariantId,
        metalColorId,
        gemstoneVariantId:
          gemstoneVariantId && gemstoneVariant ? gemstoneVariantId : undefined,
        globalMakingChargesId,
        makingChargeWeightRangeId,
        karigarId,
        globalDiscountId,
        metalWeightInGram: parseFloat(metalWeightInGram),
        gemstoneWeightInCarat: parseFloat(gemstoneWeightInCarat) || 0,
        productId,
        productSize: {
          connect: productSizeId
            ? JSON.parse(productSizeId).map((id) => ({ id }))
            : [],
        },
        // sellingPrice: Math.round(base + makingCharge),
        // finalPrice: Math.round(finalWithGst),
        metalPrice: metalCost,
        diamondPrice: gemstoneCost + sideDiamondCost,
        sellingPrice: Math.round(base + makingCharge),
        finalPrice: Math.round(finalWithGst),
        grossWeight: grossWeight,

        stock: parseInt(stock) || 0,
        sku: generateSkuCode,
        gst: variant.gst,
        isFeatured: isFeatured === "false" ? false : Boolean(isFeatured),
        isNewArrival: isNewArrival === "false" ? false : Boolean(isNewArrival),
        newArrivalUntil,
        returnPolicyText,
        note,
        length,
        width,
        height,
        // ScrewOption: screwOptions?.length
        //   ? {
        //       create: screwOptions.map((opt) => ({
        //         screwType: opt.screwType,
        //         screwMaterial: opt.screwMaterial,
        //         isDetachable: opt.isDetachable,
        //         notes: opt.notes,
        //       })),
        //     }
        //   : undefined,
        ScrewOption: screwOptions?.length
          ? {
              create: screwOptions
                .filter(
                  (opt) => opt.screwType || opt.screwMaterial || opt.notes
                ) // Filter out empty entries
                .map((opt) => ({
                  screwType: opt.screwType,
                  screwMaterial: opt.screwMaterial,
                  isDetachable: opt.isDetachable,
                  notes: opt.notes,
                })),
            }
          : undefined,

        productVariantImage: {
          createMany: {
            data: (images || []).map((img, index) => ({
              imageUrl: typeof img === "string" ? img : img.imageUrl,
              displayOrder:
                typeof img === "object" && img.displayOrder !== undefined
                  ? img.displayOrder
                  : index,
            })),
          },
        },
      },
      include: {
        metalVariant: { include: { metalType: true } },
        gemstoneVariant: { include: { gemstoneType: true } },
        productVariantImage: true,
        productSize: true,
        MakingChargeWeightRange: true,
        GlobalDiscount: true,
        Karigar: true,
        ScrewOption: true,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Product variant created successfully",
      data: createdVariant,
    };
  },

  async updateProductVariant({
    id,
    metalVariantId,
    gemstoneVariantId,
    globalMakingChargesId,
    makingChargeWeightRangeId,
    metalWeightInGram,
    gemstoneWeightInCarat,
    productSizeId,
    productId,
    globalDiscountId,
    karigarId,
    gst,
    stock,
    isFeatured,
    isNewArrival,
    newArrivalUntil,
    returnPolicyText,
    note,
    screwOptions,
  }) {
    try {
      if (
        !id ||
        !productId ||
        !metalVariantId ||
        !makingChargeWeightRangeId ||
        metalWeightInGram === undefined ||
        stock === undefined
      ) {
        throw { message: "Missing required fields" };
      }

      const [product, metalVariant, gemstoneVariant, chargeRange, discount] =
        await Promise.all([
          prisma.product.findUnique({
            where: { id: productId },
            include: {
              jewelryType: {
                select: { name: true },
              },
            },
          }),
          prisma.metalVariant.findUnique({ where: { id: metalVariantId } }),
          gemstoneVariantId
            ? prisma.gemstoneVariant.findUnique({
                where: { id: gemstoneVariantId },
              })
            : null,
          prisma.makingChargeWeightRange.findUnique({
            where: { id: makingChargeWeightRangeId },
          }),
          globalDiscountId
            ? prisma.globalDiscount.findUnique({
                where: { id: globalDiscountId },
              })
            : null,
        ]);

      if (!product || !metalVariant || !chargeRange) {
        throw {
          message: "Invalid references for product, metal, or charge range",
        };
      }

      // SKU and Slug Regeneration
      const generateSkuCode = generateSku(
        product.jewelryType.name,
        metalVariant.purityLabel,
        gemstoneVariant?.clarity
      );

      const variantSlug = generateSlug(
        product.name,
        metalVariant.purityLabel,
        gemstoneVariant?.clarity || "",
        Date.now().toString()
      );

      // Price Calculations
      const metalCost =
        (metalWeightInGram || 0) * (metalVariant.metalPriceInGram || 0);
      const gemstoneCost =
        (gemstoneWeightInCarat || 0) * (gemstoneVariant?.gemstonePrice || 0);
      const base = metalCost + gemstoneCost;

      const makingCharge = calculateCharge(base, {
        type: chargeRange.chargeType,
        chargeValue: chargeRange.chargeValue,
        discountType: chargeRange.discountType,
        discountValue: chargeRange.discountValue,
      });

      let final = base + makingCharge;
      const gstAmount = (final * gst) / 100;
      const finalWithGst = final + gstAmount;

      const variantTitle = `${product.name} - ${metalVariant.purityLabel} - ${metalColor?.name}${
        gemstoneVariant ? " with " + gemstoneVariant.clarity : ""
      }`;
      console.log("variantTitle==>", variantTitle);

      const updated = await prisma.productVariant.update({
        where: { id },
        data: {
          productVariantSlug: variantSlug,
          productVariantTitle: `${product.name} - ${metalVariant.purityLabel} - ${metalColor?.name}${
            gemstoneVariant ? " with " + gemstoneVariant.clarity : ""
          }`,
          metalVariantId,
          gemstoneVariantId,
          globalMakingChargesId,
          makingChargeWeightRangeId,
          metalWeightInGram,
          gemstoneWeightInCarat,
          productSizeId,
          productId,
          globalDiscountId,
          karigarId,
          sellingPrice: Math.round(base + makingCharge),
          finalPrice: Math.round(finalWithGst),
          gst,
          stock,
          sku: generateSkuCode,
          isFeatured,
          isNewArrival,
          newArrivalUntil,
          returnPolicyText,
          note,
        },
      });

      // ✅ Replace Screw Options
      if (Array.isArray(screwOptions)) {
        await prisma.screwOption.deleteMany({
          where: { productVariantId: id },
        });

        if (screwOptions.length > 0) {
          const screwData = screwOptions.map((opt) => ({
            productVariantId: id,
            screwType: opt.screwType,
            screwMaterial: opt.screwMaterial || null,
            isDetachable: opt.isDetachable ?? null,
            notes: opt.notes || null,
          }));

          await prisma.screwOption.createMany({ data: screwData });
        }
      }

      return {
        success: true,
        status: 200,
        message: "Product variant updated successfully",
        data: updated,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async getProductVariant(query) {
    try {
      const {
        search,
        metalVariantId,
        gemstoneVariantId,
        minWeight,
        maxWeight,
        minPrice,
        maxPrice,
        isActive,
        isFeatured,
        isNewArrival,
        karigarId,
        productSizeId,
        globalDiscountId,
        makingChargeWeightRangeId,
        globalMakingChargesId,
        sortBy = "createdAt",
        sortOrder = "desc",
        occasionId,
        productStyleId,
        collectionId,
        startDate,
        endDate,
        jewelryTypeId,
      } = query;
      let whereFilter = {};

      // Sorting logic (controlled)............................................
      const validSortFields = {
        alphabeticalAsc: { productVariantTitle: "asc" }, //A-Z
        alphabeticalDesc: { productVariantTitle: "desc" }, //Z-A
        priceLowToHigh: { finalPrice: "asc" },
        priceHighToLow: { finalPrice: "desc" },
        newest: { createdAt: "desc" },
        oldest: { createdAt: "asc" },
      };

      // const orderBy =
      //sortBy.............................................
      let orderBy = {};
      if (sortBy !== "" && sortBy !== null && sortBy !== undefined) {
        orderBy = validSortFields[sortBy] || { createdAt: "desc" };
      }

      //product variant searching..............................................
      if (search !== null && search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [
            { productVariantTitle: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        };
      }

      //filter by metal variant...............................................
      if (
        metalVariantId != null &&
        metalVariantId !== undefined &&
        metalVariantId !== ""
      ) {
        whereFilter = { ...whereFilter, metalVariantId };
      }
      //filter by gemstone variant...............................................
      if (
        gemstoneVariantId !== null &&
        gemstoneVariantId !== undefined &&
        gemstoneVariantId !== ""
      ) {
        whereFilter = { ...whereFilter, gemstoneVariantId };
      }

      //filter by weight.......................................................
      if (
        minWeight !== undefined &&
        minWeight !== "" &&
        maxWeight !== undefined &&
        maxWeight !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          metalWeightInGram: {
            gte: Number.parseFloat(minWeight),
            lte: Number.parseFloat(maxWeight),
          },
        };
      } else if (
        minWeight !== null &&
        minWeight !== "" &&
        minWeight !== undefined
      ) {
        whereFilter = {
          ...whereFilter,
          metalWeightInGram: { gte: Number.parseFloat(minWeight) },
        };
      } else if (
        maxWeight !== null &&
        maxWeight !== undefined &&
        maxWeight !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          metalWeightInGram: { lte: Number.parseFloat(maxWeight) },
        };
      }

      //minPrice & maxPrice filter.................................
      if (minPrice !== null && minPrice !== undefined && minPrice !== "") {
        whereFilter = {
          ...whereFilter,
          finalPrice: { gte: Number.parseFloat(minPrice) },
        };
      }
      if (maxPrice !== null && maxPrice !== undefined && maxPrice !== "") {
        whereFilter = {
          ...whereFilter,
          finalPrice: { lte: Number.parseFloat(maxPrice) },
        };
      }

      //filter by isActive.........................................................
      if (isActive !== null && isActive !== undefined && isActive !== "") {
        whereFilter = { ...whereFilter, isActive: isActive === "true" };
      }

      //filter by isFeatured.......................................................
      if (
        isFeatured !== null &&
        isFeatured !== undefined &&
        isFeatured !== ""
      ) {
        whereFilter = { ...whereFilter, isFeatured: isFeatured === "true" };
      }

      //filter by isNewArrival.......................................................
      if (
        isNewArrival !== null &&
        isNewArrival !== undefined &&
        isNewArrival !== ""
      ) {
        whereFilter = { ...whereFilter, isNewArrival: isNewArrival == "true" };
      }

      //filter by karigar.......................................................
      if (karigarId !== null && karigarId !== undefined && karigarId !== "") {
        whereFilter = { ...whereFilter, karigarId };
      }

      //filter by productSize.......................................................
      if (
        productSizeId !== null &&
        productSizeId !== undefined &&
        productSizeId !== ""
      ) {
        whereFilter = {
          ...whereFilter,         
          productSize: {
            some: {
              id: productSizeId,
            },
          },
        };
      }

      //filter by globalDiscount.......................................................
      if (
        globalDiscountId !== null &&
        globalDiscountId !== undefined &&
        globalDiscountId !== ""
      ) {
        whereFilter = { ...whereFilter, globalDiscountId };
      }

      //filter by makingChargeWeightRange.......................................................
      if (
        makingChargeWeightRangeId !== null &&
        makingChargeWeightRangeId !== undefined &&
        makingChargeWeightRangeId !== ""
      ) {
        whereFilter = { ...whereFilter, makingChargeWeightRangeId };
      }

      //filter by globalMakingCharges.......................................................
      if (
        globalMakingChargesId !== null &&
        globalMakingChargesId !== undefined &&
        globalMakingChargesId !== ""
      ) {
        whereFilter = { ...whereFilter, globalMakingChargesId };
      }

      //filter by productStyle.......................................................
      if (
        productStyleId !== null &&
        productStyleId !== undefined &&
        productStyleId !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          products: {
            productStyle: {
              some: {
                id: productStyleId,
              },
            },
          },
        };
      }
      //filter by collection.......................................................
      if (
        collectionId !== null &&
        collectionId !== undefined &&
        collectionId !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          products: {
            collection: {
              some: {
                id: collectionId,
              },
            },
          },
        };
      }

      //filter by productStyle.......................................................
      if (
        jewelryTypeId !== null &&
        jewelryTypeId !== undefined &&
        jewelryTypeId !== ""
      ) {
        whereFilter = { ...whereFilter,   
           products:{
            jewelryTypeId: jewelryTypeId,
          } };
      }

      //filter by occasion.......................................................
      if (
        occasionId !== null &&
        occasionId !== undefined &&
        occasionId !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          products: {
            occasion: {
              some: {
                id: occasionId,
              },
            },
          },
        };
      }

      //filter by date.......................................................
      if (
        startDate !== undefined &&
        startDate !== "" &&
        endDate !== undefined &&
        endDate !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        };
      } else if (startDate !== undefined && startDate !== "") {
        whereFilter = {
          ...whereFilter,
          createdAt: { gte: new Date(startDate) },
        };
      } else if (endDate !== undefined && endDate !== "") {
        whereFilter = {
          ...whereFilter,
          createdAt: { lte: new Date(endDate) },
        };
      }

      const totalCount = await prisma.productVariant.count({
        where: whereFilter,
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const productVariant = await prisma.productVariant.findMany({
        where:whereFilter,
        skip,
        take: limit,
        include: {
          gemstoneVariant: {
            include: {
              gemstoneType: {
                select: {
                  name: true,
                },
              },
            },
          },
          metalVariant: {
            include: {
              metalType: {
                select: {
                  name: true,
                },
              },
            },
          },
          MakingChargeWeightRange: true,
          Karigar: true,
          products: {
            include: {
              jewelryType: {
                select: {
                  name: true,
                },
              },
            },
          },
          GlobalDiscount: true,
          productVariantImage: true,
          productSize: true,
          ScrewOption: true,
          metalColor: {
            select: {
              name: true,
              metalColorSlug: true,
            },
          },
        },
        orderBy,
      });

      if (!productVariant) {
        throw {
          message: "ProductVariant not found",
        };
      }
      return {
        productVariant,
        pagination: { page, limit, skip, totalPages, currentPage },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  //public api..........................................
  async getPublicProductVariant(query) {
    try {
      const {
        search,
        metalVariantSlug,
        gemstoneVariantSlug,
        minWeight,
        maxWeight,
        minPrice,
        maxPrice,
        caratWeight,
        isActive,
        isGift,
        isFeatured,
        isNewArrival,
        karigarId,
        productSizeSlug,
        globalDiscountSlug,
        makingChargeWeightRangeId,
        globalMakingChargeSlug,
        sortBy = "createdAt",
        sortOrder = "desc",
        occasionId,
        occasionSlug,
        productStyleSlug,
        collectionSlug,
        startDate,
        endDate,
        jewelryTypeSlug,
        dailyWear,
        metalColorSlug,
      } = query;
      console.log("query===>", query);

      let whereFilter = { isActive: true };

      //product variant searching..............................................
      if (search !== null && search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [
            { productVariantTitle: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        };
      }

      //filter by metal variant...............................................
      if (
        metalVariantSlug != null &&
        metalVariantSlug !== undefined &&
        metalVariantSlug !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          metalVariant: {
            metalVariantSlug: {
              in: Array.isArray(metalVariantSlug)
                ? metalVariantSlug
                : metalVariantSlug?.split(","),
            },
          },
        };
      }

      //filter by gemstone variant...............................................
      if (
        gemstoneVariantSlug !== null &&
        gemstoneVariantSlug !== undefined &&
        gemstoneVariantSlug !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          gemstoneVariant: {
            gemstoneVariantSlug: {
              in: Array.isArray(gemstoneVariantSlug)
                ? gemstoneVariantSlug
                : gemstoneVariantSlug?.split(","),
            },
          },
        };
      }

      //filter by weight.......................................................
      if (
        minWeight !== undefined &&
        minWeight !== "" &&
        maxWeight !== undefined &&
        maxWeight !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          metalWeightInGram: {
            gte: Number.parseFloat(minWeight),
            lte: Number.parseFloat(maxWeight),
          },
        };
      } else if (
        minWeight !== null &&
        minWeight !== "" &&
        minWeight !== undefined
      ) {
        whereFilter = {
          ...whereFilter,
          metalWeightInGram: { gte: Number.parseFloat(minWeight) },
        };
      } else if (
        maxWeight !== null &&
        maxWeight !== undefined &&
        maxWeight !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          metalWeightInGram: { lte: Number.parseFloat(maxWeight) },
        };
      }

      //Carat weight wise filter...................................
      // if (
      //   caratWeight !== null &&
      //   caratWeight !== undefined &&
      //   caratWeight !== ""
      // ) {
      //   whereFilter = {
      //     ...whereFilter,
      //     gemstoneWeightInCarat: Number.parseFloat(caratWeight),
      //   };
      // }

      // Carat weight wise filter...................................
      // Carat weight wise filter...................................
      // Carat weight wise filter...................................
      if (
        caratWeight !== null &&
        caratWeight !== undefined &&
        caratWeight !== "" &&
        !(Array.isArray(caratWeight) && caratWeight.length === 0)
      ) {
        // Handle both array and single value cases
        const caratRanges = Array.isArray(caratWeight)
          ? caratWeight
          : [caratWeight];

        const rangeConditions = caratRanges
          .map((range) => {
            // Clean up the range string by replacing multiple hyphens with single ones
            const cleanRange = range.replace(/-+/g, "-").replace(/-$/, "");

            switch (cleanRange.toLowerCase()) {
              case "below-1-carat":
                return { gemstoneWeightInCarat: { lt: 1 } };
              case "1-2-carat":
                return { gemstoneWeightInCarat: { gte: 1, lt: 2 } };
              case "2-3-carat":
                return { gemstoneWeightInCarat: { gte: 2, lt: 3 } };
              case "3-4-carat":
                return { gemstoneWeightInCarat: { gte: 3, lt: 4 } };
              case "4-5-carat":
                return { gemstoneWeightInCarat: { gte: 4, lt: 5 } };
              case "plus-5-carat":
                return { gemstoneWeightInCarat: { gte: 5 } };
              default:
                // Handle numeric values (including "4" case)
                const numericValue = Number.parseFloat(range);
                return isNaN(numericValue)
                  ? undefined
                  : { gemstoneWeightInCarat: { equals: numericValue } };
            }
          })
          .filter(Boolean);

        if (rangeConditions.length > 0) {
          whereFilter = {
            ...whereFilter,
            OR: rangeConditions,
          };
        }
      }

      //minPrice & maxPrice filter.................................
      if (minPrice !== null && minPrice !== undefined && minPrice !== "") {
        whereFilter = {
          ...whereFilter,
          finalPrice: { gte: Number.parseFloat(minPrice) },
        };
      }
      if (maxPrice !== null && maxPrice !== undefined && maxPrice !== "") {
        whereFilter = {
          ...whereFilter,
          finalPrice: { lte: Number.parseFloat(maxPrice) },
        };
      }

      //filter by isActive.........................................................
      if (isActive !== null && isActive !== undefined && isActive !== "") {
        whereFilter = { ...whereFilter, isActive: isActive === "true" };
      }

      if (isGift !== null && isGift !== undefined && isGift !== "") {
        whereFilter = { ...whereFilter, isGift: isGift === "true" };
      }

      //filter by isFeatured.......................................................
      if (
        isFeatured !== null &&
        isFeatured !== undefined &&
        isFeatured !== ""
      ) {
        whereFilter = { ...whereFilter, isFeatured: isFeatured === "true" };
      }

      //filter by isNewArrival.......................................................
      if (
        isNewArrival !== null &&
        isNewArrival !== undefined &&
        isNewArrival !== ""
      ) {
        whereFilter = { ...whereFilter, isNewArrival: isNewArrival == "true" };
      }

      //filter by karigar.......................................................
      if (karigarId !== null && karigarId !== undefined && karigarId !== "") {
        whereFilter = { ...whereFilter, karigarId };
      }

      //filter by productSize.......................................................
      if (
        productSizeSlug !== null &&
        productSizeSlug !== undefined &&
        productSizeSlug !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          productSize: {
            some: {
              productSizeSlug: {
                in: Array.isArray(productSizeSlug)
                  ? productSizeSlug
                  : productSizeSlug?.split(","),
              },
            },
          },
        };
      }

      // Add daily wear filter
      if (dailyWear !== null && dailyWear !== undefined && dailyWear !== "") {
        whereFilter = {
          ...whereFilter,
          dailyWear: {
            in: Array.isArray(dailyWear) ? dailyWear : dailyWear?.split(","),
          },
        };
      }

      //filter by globalDiscount.......................................................
      // if (
      //   globalDiscountId !== null &&
      //   globalDiscountId !== undefined &&
      //   globalDiscountId !== ""
      // ) {
      //   whereFilter = { ...whereFilter, globalDiscountId };
      // }

      //filter by makingChargeWeightRange.......................................................
      // if (
      //   globalMakingChargeSlug !== null &&
      //   globalMakingChargeSlug !== undefined &&
      //   globalMakingChargeSlug !== ""
      // ) {
      //   whereFilter = {
      //     ...whereFilter,
      //     MakingChargeWeightRange: {
      //       globalMakingCharges: {
      //         globalMakingChargeSlug,
      //       },
      //     },
      //   };
      // }

      //filter by productStyle.......................................................
      if (
        productStyleSlug !== null &&
        productStyleSlug !== undefined &&
        productStyleSlug !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          products: {
            productStyle: {
              some: {
                productStyleSlug: {
                  in: Array.isArray(productStyleSlug)
                    ? productStyleSlug
                    : productStyleSlug?.split(","),
                },
              },
            },
          },
        };
      }
      //filter by collection.......................................................
      if (
        collectionSlug !== null &&
        collectionSlug !== undefined &&
        collectionSlug !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          products: {
            collection: {
              some: {
                collectionSlug: {
                  in: Array.isArray(collectionSlug)
                    ? collectionSlug
                    : collectionSlug?.split(","),
                },
              },
            },
          },
        };
      }

      //filter by productStyle.......................................................
      if (
        jewelryTypeSlug !== null &&
        jewelryTypeSlug !== undefined &&
        jewelryTypeSlug !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          products: {
            jewelryType: {
              jewelryTypeSlug: {
                in: Array.isArray(jewelryTypeSlug)
                  ? jewelryTypeSlug
                  : jewelryTypeSlug?.split(","),
              },
            },
          },
        };
      }

      //filter by occasion.......................................................
      if (
        occasionSlug !== null &&
        occasionSlug !== undefined &&
        occasionSlug !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          products: {
            occasion: {
              some: {
                occasionSlug: {
                  in: Array.isArray(occasionSlug)
                    ? occasionSlug
                    : occasionSlug?.split(","),
                },
              },
            },
          },
        };
      }

      //filter by date.......................................................
      if (
        startDate !== undefined &&
        startDate !== "" &&
        endDate !== undefined &&
        endDate !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        };
      } else if (startDate !== undefined && startDate !== "") {
        whereFilter = {
          ...whereFilter,
          createdAt: { gte: new Date(startDate) },
        };
      } else if (endDate !== undefined && endDate !== "") {
        whereFilter = {
          ...whereFilter,
          createdAt: { lte: new Date(endDate) },
        };
      }

      if (
        metalColorSlug !== null &&
        metalColorSlug !== undefined &&
        metalColorSlug !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          metalColor: {
            metalColorSlug: {
              in: Array.isArray(metalColorSlug)
                ? metalColorSlug
                : metalColorSlug?.split(","),
            },
          },
        };
      }

      //sortBy.............................................
      let orderBy = {};
      if (sortBy && sortOrder) {
        orderBy[sortBy] = sortOrder;
      }

      const totalCount = await prisma.productVariant.count({
        where: whereFilter,
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const productVariant = await prisma.productVariant.findMany({
        where: whereFilter,
        skip,
        take: limit,
        include: {
          gemstoneVariant: {
            include: {
              gemstoneType: {
                select: {
                  name: true,
                },
              },
            },
          },
          metalVariant: {
            include: {
              metalType: {
                select: {
                  name: true,
                },
              },
            },
          },

          MakingChargeWeightRange: true,
          Karigar: true,
          products: true,
          GlobalDiscount: {
            select: {
              title: true,
              description: true,
              discountType: true,
              discountValue: true,
            },
          },
          productVariantImage: true,
          productSize: true,
          ScrewOption: true,
        },
        orderBy,
      });

      if (!productVariant) {
        throw {
          message: "ProductVariant not found",
        };
      }
      return {
        productVariant,
        pagination: { page, limit, skip, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  //public new arrival api..........................................
  async getPublicNewArrivalProductVariant(query) {
    try {
      const {
        search,
        metalVariantId,
        gemstoneVariantId,
        minWeight,
        maxWeight,
        minPrice,
        maxPrice,
        isActive,
        isFeatured,
        isNewArrival,
        karigarId,
        productSizeId,
        globalDiscountId,
        makingChargeWeightRangeId,
        globalMakingChargesId,
        sortBy = "createdAt",
        sortOrder = "desc",
        occasionId,
        productStyleId,
        collectionId,
        startDate,
        endDate,
        jewelryTypeId,
      } = query;
      let whereFilter = {};

      //product variant searching..............................................
      if (search !== null && search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [
            { productVariantTitle: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        };
      }

      //filter by metal variant...............................................
      if (
        metalVariantId != null &&
        metalVariantId !== undefined &&
        metalVariantId !== ""
      ) {
        whereFilter = { ...whereFilter, metalVariantId };
      }
      //filter by gemstone variant...............................................
      if (
        gemstoneVariantId !== null &&
        gemstoneVariantId !== undefined &&
        gemstoneVariantId !== ""
      ) {
        whereFilter = { ...whereFilter, gemstoneVariantId };
      }

      //filter by weight.......................................................
      if (
        minWeight !== undefined &&
        minWeight !== "" &&
        maxWeight !== undefined &&
        maxWeight !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          metalWeightInGram: {
            gte: Number.parseFloat(minWeight),
            lte: Number.parseFloat(maxWeight),
          },
        };
      } else if (
        minWeight !== null &&
        minWeight !== "" &&
        minWeight !== undefined
      ) {
        whereFilter = {
          ...whereFilter,
          metalWeightInGram: { gte: Number.parseFloat(minWeight) },
        };
      } else if (
        maxWeight !== null &&
        maxWeight !== undefined &&
        maxWeight !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          metalWeightInGram: { lte: Number.parseFloat(maxWeight) },
        };
      }

      //minPrice & maxPrice filter.................................
      if (minPrice !== null && minPrice !== undefined && minPrice !== "") {
        whereFilter = {
          ...whereFilter,
          finalPrice: { gte: Number.parseFloat(minPrice) },
        };
      }
      if (maxPrice !== null && maxPrice !== undefined && maxPrice !== "") {
        whereFilter = {
          ...whereFilter,
          finalPrice: { lte: Number.parseFloat(maxPrice) },
        };
      }

      //filter by isActive.........................................................
      if (isActive !== null && isActive !== undefined && isActive !== "") {
        whereFilter = { ...whereFilter, isActive: isActive === "true" };
      }

      //filter by isFeatured.......................................................
      if (
        isFeatured !== null &&
        isFeatured !== undefined &&
        isFeatured !== ""
      ) {
        whereFilter = { ...whereFilter, isFeatured: isFeatured === "true" };
      }

      //filter by isNewArrival.......................................................
      if (
        isNewArrival !== null &&
        isNewArrival !== undefined &&
        isNewArrival !== ""
      ) {
        whereFilter = { ...whereFilter, isNewArrival: isNewArrival == "true" };
      }

      //filter by karigar.......................................................
      if (karigarId !== null && karigarId !== undefined && karigarId !== "") {
        whereFilter = { ...whereFilter, karigarId };
      }

      //filter by productSize.......................................................
      if (
        productSizeId !== null &&
        productSizeId !== undefined &&
        productSizeId !== ""
      ) {
        whereFilter = { ...whereFilter, productSizeId };
      }

      //filter by globalDiscount.......................................................
      if (
        globalDiscountId !== null &&
        globalDiscountId !== undefined &&
        globalDiscountId !== ""
      ) {
        whereFilter = { ...whereFilter, globalDiscountId };
      }

      //filter by makingChargeWeightRange.......................................................
      if (
        makingChargeWeightRangeId !== null &&
        makingChargeWeightRangeId !== undefined &&
        makingChargeWeightRangeId !== ""
      ) {
        whereFilter = { ...whereFilter, makingChargeWeightRangeId };
      }

      //filter by globalMakingCharges.......................................................
      if (
        globalMakingChargesId !== null &&
        globalMakingChargesId !== undefined &&
        globalMakingChargesId !== ""
      ) {
        whereFilter = { ...whereFilter, globalMakingChargesId };
      }

      //filter by productStyle.......................................................
      if (
        productStyleId !== null &&
        productStyleId !== undefined &&
        productStyleId !== ""
      ) {
        whereFilter = { ...whereFilter, products: { productStyleId } };
      }
      //filter by collection.......................................................
      if (
        collectionId !== null &&
        collectionId !== undefined &&
        collectionId !== ""
      ) {
        whereFilter = { ...whereFilter, products: { collectionId } };
      }

      //filter by productStyle.......................................................
      if (
        jewelryTypeId !== null &&
        jewelryTypeId !== undefined &&
        jewelryTypeId !== ""
      ) {
        whereFilter = { ...whereFilter, jewelryTypeId };
      }

      //filter by occasion.......................................................
      if (
        occasionId !== null &&
        occasionId !== undefined &&
        occasionId !== ""
      ) {
        whereFilter = { ...whereFilter, products: { occasionId } };
      }

      //filter by date.......................................................
      if (
        startDate !== undefined &&
        startDate !== "" &&
        endDate !== undefined &&
        endDate !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        };
      } else if (startDate !== undefined && startDate !== "") {
        whereFilter = {
          ...whereFilter,
          createdAt: { gte: new Date(startDate) },
        };
      } else if (endDate !== undefined && endDate !== "") {
        whereFilter = {
          ...whereFilter,
          createdAt: { lte: new Date(endDate) },
        };
      }

      //sortBy.............................................
      let orderBy = {};
      if (sortBy && sortOrder) {
        orderBy[sortBy] = sortOrder;
      }

      const totalCount = await prisma.productVariant.count({
        where: { ...whereFilter, isNewArrival: true },
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const productVariant = await prisma.productVariant.findMany({
        where: { ...whereFilter, isNewArrival: true },
        skip,
        take: limit,
        include: {
          gemstoneVariant: {
            include: {
              gemstoneType: {
                select: {
                  name: true,
                },
              },
            },
          },
          metalVariant: {
            include: {
              metalType: {
                select: {
                  name: true,
                },
              },
            },
          },
          MakingChargeWeightRange: true,
          Karigar: true,
          products: true,
          GlobalDiscount: true,
          productVariantImage: true,
          productSize: true,
          ScrewOption: true,
        },
        orderBy,
      });

      if (!productVariant) {
        throw {
          message: "ProductVariant not found",
        };
      }
      return {
        productVariant,
        pagination: { page, limit, skip, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async getProductVariantById(id) {
    try {
      if (!id) {
        throw {
          message: "ProductVariant id not exist",
          statusCode: 400,
        };
      }

      const productVariant = await prisma.productVariant.findFirst({
        where: { id },
        include: {
          gemstoneVariant: {
            include: {
              gemstoneType: {
                select: {
                  name: true,
                },
              },
            },
          },
          metalVariant: {
            include: {
              metalType: {
                select: {
                  name: true,
                },
              },
            },
          },
          GlobalDiscount: true,
          Karigar: true,
          products: {
            include: {
              collection: true,
              occasion: true,
              productStyle: true,
              jewelryType: true,
            },
          },
          productVariantImage: {
            orderBy: {
              displayOrder: "asc",
            },
          },
          productSize: true,
          metalColor: {
            select: {
              name: true,
              metalColorSlug: true,
            },
          },
          MakingChargeWeightRange: {
            include: {
              metalVariant: {
                include: {
                  metalType: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              gemstoneVariant: {
                include: {
                  gemstoneType: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              MakingChargeCategorySet: true,
            },
          },
          ScrewOption: true,
        },
      });

      if (!productVariant) {
        throw {
          message: "ProductVariant not found",
          statusCode: 404,
        };
      }

      return productVariant;
    } catch (error) {
      throw error;
    }
  },

  // async deleteProductVariant(id) {
  //   try {
  //     if (!id) {
  //       throw {
  //         success: false,
  //         statusCode: 400,
  //         message: "ProductVariant ID is required",
  //       };
  //     }

  //     const existing = await prisma.productVariant.findFirst({
  //       where: { id },
  //     });

  //     if (!existing) {
  //       throw {
  //         success: false,
  //         statusCode: 404,
  //         message: "ProductVariant not found",
  //       };
  //     }

  //     const result = await prisma.productVariant.delete({
  //       where: { id },
  //     });

  //     return {
  //       success: true,
  //       statusCode: 200,
  //       message: "Product variant deleted successfully",
  //       data: result,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  async deleteProductVariant(id) {
    try {
      if (!id) {
        throw {
          success: false,
          statusCode: 400,
          message: "ProductVariant ID is required",
        };
      }

      const existingProductVariant = await prisma.productVariant.findFirst({
        where: { id },
      });

      if (!existingProductVariant) {
        throw {
          success: false,
          statusCode: 404,
          message: "ProductVariant not found",
        };
      }

      const deletedProductVariant = await prisma.productVariant.delete({
        where: { id },
      });

      const productWithVariants = await prisma.product.findUnique({
        where: { id: existingProductVariant.productId },
        include: { productVariant: true },
      });

      if (productWithVariants.productVariant.length === 0) {
        await prisma.product.delete({
          where: { id: existingProductVariant.productId },
        });
      }

      return {
        success: true,
        statusCode: 200,
        message: "Product variant deleted successfully",
        data: deletedProductVariant,
      };
    } catch (error) {
      throw error;
    }
  },

  async activeInactiveProductVariant(id, status) {
    try {
      if (!id) {
        throw {
          success: false,
          statusCode: 400,
          message: "ProductVariant ID is required",
        };
      }

      const existing = await prisma.productVariant.findFirst({
        where: { id },
      });

      if (!existing) {
        throw {
          success: false,
          statusCode: 404,
          message: "Product not found",
        };
      }
      let result;
      if (status === "isActive") {
        result = await prisma.productVariant.update({
          where: { id },
          data: { isActive: !existing.isActive },
        });
      } else if (status === "isFeatured") {
        result = await prisma.productVariant.update({
          where: { id },
          data: { isFeatured: !existing.isFeatured },
        });
      } else if (status === "isNewArrival") {
        result = await prisma.productVariant.update({
          where: { id },
          data: { isNewArrival: !existing.isNewArrival },
        });
      } else if (status === "isGift") {
        result = await prisma.productVariant.update({
          where: { id },
          data: { isGift: !existing.isGift },
        });
      }

      return {
        success: true,
        statusCode: 200,
        message: "Product variant updated successfully",
        data: result,
      };
    } catch (error) {
      throw error;
    }
  },

  async updateProductVariantStock(id, stock) {
    try {
      if (!id || stock === undefined) {
        throw {
          message: "Product variant ID and stock value are required",
          statusCode: 400,
        };
      }

      // Validate stock is a number
      const stockValue = Number(stock);
      if (isNaN(stockValue)) {
        throw {
          message: "Stock must be a valid number",
          statusCode: 400,
        };
      }

      const existingVariant = await prisma.productVariant.findUnique({
        where: { id },
      });

      if (!existingVariant) {
        throw {
          message: "Product variant not found",
          statusCode: 404,
        };
      }

      const updatedVariant = await prisma.productVariant.update({
        where: { id },
        data: { stock: stockValue },
        include: {
          products: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        statusCode: 200,
        message: "Product variant stock updated successfully",
        data: updatedVariant,
      };
    } catch (error) {
      console.error("Error updating product variant stock:", error);
      throw error;
    }
  },

  async getTrendingProducts() {
    // Adjust these weights as per your business logic
    const ORDER_WEIGHT = 5;
    const WISHLIST_WEIGHT = 2;
    const CART_WEIGHT = 1;

    // Time window for trending products (e.g., last 30 days)
    const trendingWindowDays = 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - trendingWindowDays);

    // Get aggregated order counts per variant (last 30 days)
    const orderItems = await prisma.orderItem.groupBy({
      by: ["productVariantId"],
      where: {
        createdAt: { gte: startDate },
        productVariantId: { not: null },
      },
      _sum: { quantity: true },
    });

    // Get wishlist counts (last 30 days)
    const wishlistItems = await prisma.wishlist.groupBy({
      by: ["productVariantId"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: { productVariantId: true },
    });

    // Get cart counts (last 30 days)
    const cartItems = await prisma.cartItem.groupBy({
      by: ["productVariantId"],
      where: {
        createdAt: { gte: startDate },
      },
      _sum: { quantity: true },
    });

    // Convert to maps for O(1) lookups
    const orderCountMap = new Map(
      orderItems.map((item) => [item.productVariantId, item._sum.quantity || 0])
    );

    const wishlistCountMap = new Map(
      wishlistItems.map((item) => [
        item.productVariantId,
        item._count.productVariantId || 0,
      ])
    );

    const cartCountMap = new Map(
      cartItems.map((item) => [item.productVariantId, item._sum.quantity || 0])
    );

    // Fetch active variants with necessary relations
    const trendingVariants = await prisma.productVariant.findMany({
      where: {
        isActive: true,
      },
      include: {
        products: true,
        productVariantImage: true,
      },
    });

    // Calculate scores for each variant and sort them
    const scoredVariants = trendingVariants
      .map((variant) => {
        const orderCount = orderCountMap.get(variant.id) || 0;
        const wishlistCount = wishlistCountMap.get(variant.id) || 0;
        const cartCount = cartCountMap.get(variant.id) || 0;

        const score =
          orderCount * ORDER_WEIGHT +
          wishlistCount * WISHLIST_WEIGHT +
          cartCount * CART_WEIGHT;

        return {
          ...variant,
          trendingScore: score,
          orderCount,
          wishlistCount,
          cartCount,
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore) // Sort by descending score
      .slice(0, 10); // Get only the top 10

    return scoredVariants;
  },
  //product comparison...........................................
  async productComparison(data) {
    try {
      const { productSlugs } = data;
      console.log("data=>", productSlugs);

      const compare = await prisma.productVariant.findMany({
        where: {
          productVariantSlug: {
            in: productSlugs,
          },
        },
        include: {
          gemstoneVariant: true,
          metalVariant: {
            include: {
              metalType: {
                select: {
                  name: true,
                },
              },
            },
          },
          GlobalDiscount: true,
          Karigar: true,
          products: true,
          productVariantImage: true,
          productSize: true,
          ScrewOption: true,
          ProductReview: true,
          metalColor: {
            select: {
              name: true,
              metalColorSlug: true,
            },
          },
        },
      });

      return compare;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  //remove product variant image......................
  async removeProductVariantImage(id) {
    try {
      if (!id) {
        throw {
          success: false,
          statusCode: 400,
          message: "Product Variant ID is required",
        };
      }

      const existing = await prisma.productVariantImage.findFirst({
        where: { id },
      });

      if (!existing) {
        throw {
          success: false,
          statusCode: 404,
          message: "Product not found",
        };
      }

      const result = await prisma.productVariantImage.delete({
        where: { id },
      });

      return {
        success: true,
        statusCode: 200,
        message: "Product variant image deleted successfully",
        data: result,
      };
    } catch (error) {
      throw error;
    }
  },

  //add new  product variant image.........................
  async addProductVariantImage(id, images) {
    try {
      if (!id) {
        throw {
          success: false,
          statusCode: 400,
          message: "Product Variant ID is required",
        };
      }

      const existing = await prisma.productVariant.findFirst({
        where: { id },
      });

      if (!existing) {
        throw {
          success: false,
          statusCode: 404,
          message: "Product not found",
        };
      }

      let result;
      if (Array.isArray(images)) {
        // Handle multiple images
        result = await prisma.productVariantImage.createMany({
          data: images.map((image) => ({
            productVariantId: id,
            imageUrl: image,
          })),
        });
      } else {
        // Handle single image
        result = await prisma.productVariantImage.create({
          data: {
            productVariantId: id,
            imageUrl: images,
          },
          include: {
            productVariant: {
              include: {
                productVariantImage: true,
              },
            },
          },
        });
      }
      return {
        success: true,
        statusCode: 200,
        message: "Product variant image(s) added successfully",
        data: result,
      };
    } catch (error) {
      throw new Error("Something went wrong uploading image: ", error.message);
    }
  },

  async updateProductVariantImageOrder(id, images) {
    try {
      if (!id || !Array.isArray(images)) {
        throw { message: "Variant ID and images array are required" };
      }

      const variantImages = await prisma.productVariantImage.findMany({
        where: { productVariantId: id },
      });

      const imageIds = variantImages.map((img) => img.id);
      const invalidImages = images.filter((img) => !imageIds.includes(img.id));

      if (invalidImages.length > 0) {
        throw { message: "Some images don't belong to this variant" };
      }

      // Update display orders in a transaction
      const result = await prisma.$transaction(
        images.map((img) =>
          prisma.productVariantImage.update({
            where: { id: img.id },
            data: { displayOrder: img.displayOrder },
          })
        )
      );

      return {
        success: true,
        status: 200,
        message: "Image order updated successfully",
        data: result,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //add screw..................................................
  async addScrew(data) {
    const { productVariantId, screwType, screwMaterial, notes } = data;
    try {
      if (!productVariantId) {
        throw {
          success: false,
          statusCode: 400,
          message: "Product Variant ID is required",
        };
      }

      const existing = await prisma.productVariant.findFirst({
        where: { id: productVariantId },
      });

      if (!existing) {
        throw {
          success: false,
          statusCode: 404,
          message: "Product not found",
        };
      }

      const result = await prisma.productVariant.update({
        where: { id: productVariantId },
        data: {
          ScrewOption: {
            create: {
              screwType: screwType,
              screwMaterial: screwMaterial || null,
              notes: notes || null,
            },
          },
        },
        include: {
          ScrewOption: true,
        },
      });

      return {
        success: true,
        statusCode: 200,
        message: "Screw option added successfully",
        data: result,
      };
    } catch (error) {
      throw error;
    }
  },

  //remove screw..................................................
  async removeScrew(data) {
    const { variantId, screwId } = data;
    console.log("data=>", data);
    try {
      if (!variantId || !screwId) {
        throw {
          success: false,
          statusCode: 400,
          message: "Product Variant ID and Screw ID are required",
        };
      }

      const existing = await prisma.productVariant.findFirst({
        where: { id: variantId },
        include: {
          ScrewOption: true,
        },
      });

      if (!existing) {
        throw {
          success: false,
          statusCode: 404,
          message: "Product variant not found",
        };
      }

      const existingScrew = existing.ScrewOption.find(
        (screw) => screw.id === screwId
      );

      if (!existingScrew) {
        throw {
          success: false,
          statusCode: 404,
          message: "Screw option not found for this variant",
        };
      }

      const result = await prisma.screwOption.delete({
        where: { id: screwId },
      });

      return {
        success: true,
        statusCode: 200,
        message: "Screw option removed successfully",
        data: result,
      };
    } catch (error) {
      throw error;
    }
  },

  async updateDailyWearStatus(id, status) {
    return await prisma.productVariant.update({
      where: { id },
      data: { dailyWear: status },
    });
  },
};

export default productVariantService;
