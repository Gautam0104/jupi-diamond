import prisma from "../../config/prismaClient.js";
import { paginate } from "../../utils/pagination.js";
import productVariantService from "../../services/productVariant/productVariantService.js";

const publicService = {
  async getPublicIndexData(query) {
    try {
      let whereFilter = {};

      const [
        banner,
        newArrival,
        collection,
        shpByDiamondShape,
        shopByRingStyle,
        menCollection,
        reviewFeedBack,
        occasions,
        trendingProduct,
      ] = await Promise.all([
        prisma.banner
          .findMany({
            where: { ...whereFilter, isActive: true },
            select: {
              id: true,
              title: true,
              subtitle: true,
              buttonName: true,
              imageUrl: true,
              mobileFiles: true,
              redirectUrl: true,
            },
            orderBy: { createdAt: "desc" },
          })
          .catch((error) => {
            throw new Error("Error fetching banner: " + error.message);
          }),
        prisma.productVariant
          .findMany({
            where: { ...whereFilter, isNewArrival: true },
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              finalPrice: true,
              productVariantImage: {
                select: {
                  id: true,
                  imageUrl: true,
                },
              },
              // product: {
              //   select: {
              //     name: true,
              //     slug: true,
              //   },
              // },
            },
          })
          .catch((error) => {
            throw new Error("Error fetching new arrivals: " + error.message);
          }),
        prisma.collection
          .findMany({
            where: whereFilter,
            orderBy: { createdAt: "desc" },
          })
          .catch((error) => {
            throw new Error("Error fetching review: " + error.message);
          }),
        prisma.gemstoneVariant
          .findMany({
            where: whereFilter,
            select: {
              shape: true,
              gemstoneVariantSlug: true,
              clarity: true,
              imageUrl: true,
            },
            orderBy: { createdAt: "desc" },
          })
          .catch((error) => {
            throw new Error("Error fetching diamond Shape: " + error.message);
          }),

        prisma.productStyle
          .findMany({
            select: {
              name: true,
              productStyleSlug: true,
              imageUrl: true,
              jewelryType: {
                select: {
                  jewelryTypeSlug: true,
                },
              },
            },
            where: {
              jewelryType: {
                jewelryTypeSlug: {
                  equals: "rings",
                  mode: "insensitive",
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          })
          .catch((error) => {
            throw new Error("Error fetching Ring Style: " + error.message);
          }),

        prisma.collection
          .findMany({
            where: {
              gender: "MEN",
            },
            select: {
              collectionSlug: true,
              name: true,
              gender: true,
              description: true,
              thumbnailImage: true,
            },
            orderBy: { createdAt: "desc" },
          })
          .catch((error) => {
            throw new Error("Error fetching Men Collection: " + error.message);
          }),

        prisma.productReview
          .findMany({
            where: { ...whereFilter, isApproved: true ,isFeatured: true},
            select: {
              customer: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              rating: true,
              reviewTitle: true,
              reviewBody: true,
              images: true,
            },
            orderBy: { createdAt: "desc" },
          })
          .catch((error) => {
            throw new Error("Error fetching review: " + error.message);
          }),

        prisma.occasion
          .findMany({
            where: { ...whereFilter, isActive: true },
            orderBy: { createdAt: "desc" },
          })
          .catch((error) => {
            throw new Error("Error fetching occasion: " + error.message);
          }),

        productVariantService.getTrendingProducts().catch((error) => {
          throw new Error("Error fetching trending products: " + error.message);
        }),
      ]);

      return {
        banner,
        newArrivals: newArrival,
        collections: collection,
        trendingProduct,
        shpByDiamondShape,
        shopByRingStyle,
        menCollection,
        reviewFeedBack,
        occasions,
      };
    } catch (error) {
      throw new Error("Error fetching index page data: " + error.message);
    }
  },
  //product page data filter jewellery type, style, shape, gold color, shape diamond color...................
  async fetchFilterData(query) {
    try {
      const jewelryTypeSlug =
        query["jewelryTypeSlug[]"] || query.jewelryTypeSlug;

      // Execute all queries in parallel using Promise.all
      const [
        jewelleryType,
        style,
        shape,
        metalVariant,
        diamondColor,
        diamondGemstone,
        collection,
        occasion,
        color,
        caratWeightRanges,
      ] = await Promise.all([
        // Jewelry type query
        prisma.jewelryType.findMany({
          where: { isActive: true },
          select: {
            name: true,
            jewelryTypeSlug: true,
            products: {
              select: {
                _count: {
                  select: {
                    productVariant: {
                      where: { isActive: true },
                    },
                  },
                },
              },
            },
          },
        }),

        // Style query
        prisma.productStyle.findMany({
          where: jewelryTypeSlug
            ? {
                jewelryType: {
                  jewelryTypeSlug: {
                    in: Array.isArray(jewelryTypeSlug)
                      ? jewelryTypeSlug
                      : [jewelryTypeSlug],
                  },
                },
              }
            : {},
          select: {
            name: true,
            productStyleSlug: true,
            jewelryType: {
              select: {
                jewelryTypeSlug: true,
              },
            },
            products: {
              select: {
                _count: {
                  select: {
                    productVariant: {
                      where: { isActive: true },
                    },
                  },
                },
              },
            },
          },
        }),

        // Shape query
        prisma.gemstoneVariant.findMany({
          select: {
            shape: true,
            clarity: true,
            gemstoneVariantSlug: true,
            _count: {
              select: {
                productVariant: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        // Metal variant query
        prisma.metalVariant.findMany({
          select: {
            metalType: {
              select: {
                name: true,
              },
            },
            purityLabel: true,
            metalVariantSlug: true,
            _count: {
              select: {
                productVariants: true,
              },
            },
          },
        }),

        // Diamond color query
        prisma.gemstoneVariant.findMany({
          select: {
            color: true,
            gemstoneVariantSlug: true,
            _count: {
              select: {
                productVariant: true,
              },
            },
          },
        }),

        // Diamond gemstone query
        prisma.gemstoneVariant.findMany({
          select: {
            gemstoneType: {
              select: {
                name: true,
              },
            },
            clarity: true,
            gemstoneVariantSlug: true,
            _count: {
              select: {
                productVariant: true,
              },
            },
          },
        }),

        // Collection query
        prisma.collection.findMany({
          select: {
            name: true,
            collectionSlug: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
        }),

        // Occasion query
        prisma.occasion.findMany({
          select: {
            name: true,
            occasionSlug: true,
            _count: {
              select: {
                product: {
                  where: {
                    productVariant: {
                      some: {},
                    },
                  },
                },
              },
            },
          },
        }),

        // Color query
        prisma.metalColor.findMany({
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            metalColorSlug: true,
            _count: {
              select: {
                productVariant: true,
              },
            },
          },
        }),

        prisma.$queryRaw`
  WITH all_ranges AS (
    SELECT 'Below 1 carat' as range_name, 1 as sort_order UNION ALL
    SELECT '1 - 2 carat', 2 UNION ALL
    SELECT '2 - 3 carat', 3 UNION ALL
    SELECT '3 - 4 carat', 4 UNION ALL
    SELECT '4 - 5 carat', 5 UNION ALL
    SELECT 'Plus 5 carat', 6
  ),
  actual_ranges AS (
    SELECT 
      CASE 
        WHEN "gemstoneWeightInCarat" < 1 THEN 'Below 1 carat'
        WHEN "gemstoneWeightInCarat" >= 1 AND "gemstoneWeightInCarat" < 2 THEN '1 - 2 carat'
        WHEN "gemstoneWeightInCarat" >= 2 AND "gemstoneWeightInCarat" < 3 THEN '2 - 3 carat'
        WHEN "gemstoneWeightInCarat" >= 3 AND "gemstoneWeightInCarat" < 4 THEN '3 - 4 carat'
        WHEN "gemstoneWeightInCarat" >= 4 AND "gemstoneWeightInCarat" < 5 THEN '4 - 5 carat'
        WHEN "gemstoneWeightInCarat" >= 5 THEN 'Plus 5 carat'
      END as range_name,
      COUNT(*) as count
    FROM "ProductVariant"
    WHERE "gemstoneWeightInCarat" IS NOT NULL
    GROUP BY 1
  )
  SELECT 
    ar.range_name as range,
    COALESCE(actual.count, 0) as count
  FROM all_ranges ar
  LEFT JOIN actual_ranges actual ON ar.range_name = actual.range_name
  ORDER BY ar.sort_order
`,
      ]);

      const formattedCaratRanges = caratWeightRanges.map((range) => ({
        name: range.range,
        count: Number(range.count),
        slug: range.range.toLowerCase().replace(/\s+/g, "-"),
      }));

      return {
        jewelleryType,
        style,
        shape,
        metalVariant,
        diamondColor,
        diamondGemstone,
        collection,
        occasion,
        color,
        caratWeightRanges: formattedCaratRanges,
      };
    } catch (error) {
      throw new Error("Error fetching filter data: " + error.message);
    }
  },

  async fetchProductStylesByJewelryType(jewelryTypeSlug) {
    try {
      const productStyles = await prisma.productStyle.findMany({
        where: {
          jewelryType: {
            jewelryTypeSlug: jewelryTypeSlug,
          },
        },
        select: {
          name: true,
          productStyleSlug: true,
          _count: {
            select: {
              products: {
                where: {
                  productVariant: {
                    some: {},
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return productStyles;
    } catch (error) {
      throw new Error(
        "Error fetching product styles by jewelry type: " + error.message
      );
    }
  },
};

export default publicService;
