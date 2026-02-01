import productVariantService from "../../services/productVariant/productVariantService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";

function normalizeQuery(query) {
  const normalized = {};
  const arrayPattern = /\[\]$/; // Matches keys ending with []

  for (const key in query) {
    if (Object.prototype.hasOwnProperty.call(query, key)) {
      // Remove [] from array keys
      const normalizedKey = key.replace(arrayPattern, "");

      // If the key already exists in the normalized object, merge the values
      if (normalized.hasOwnProperty(normalizedKey)) {
        if (!Array.isArray(normalized[normalizedKey])) {
          normalized[normalizedKey] = [normalized[normalizedKey]];
        }
        normalized[normalizedKey].push(query[key]);
      } else {
        normalized[normalizedKey] = query[key];
      }
    }
  }

  return normalized;
}

const productVariantController = {
  async getProductVariant(request, response) {
    try {
      const result = await productVariantService.getProductVariant(
        request.query
      );
      return response.status(200).json({
        success: true,
        message: "ProductVariant fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting ProductVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //fetch product variant public.........................................
  async getPublicProductVariant(request, response) {
    try {
      const query = normalizeQuery(request.query);
      const result = await productVariantService.getPublicProductVariant(query);

      return response.status(200).json({
        success: true,
        message: "ProductVariant fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting ProductVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
  //fetch product variant new arrival public.........................................
  async getPublicNewArrivalProductVariant(request, response) {
    try {
      const result =
        await productVariantService.getPublicNewArrivalProductVariant(
          request.query
        );
      return response.status(200).json({
        success: true,
        message: "ProductVariant fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting ProductVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async getProductVariantById(request, response) {
    const { id } = request.params;
    try {
      const result = await productVariantService.getProductVariantById(id);
      response.status(200).json({
        success: true,
        message: "Product variant by id fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting ProductVariant: ${error}`);

      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async createProductVariant(req, res) {
    try {
      const {
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
        stock,
        gst,
        isFeatured,
        isNewArrival,
        newArrivalUntil,
        returnPolicyText,
        screwOptions,
        numberOfDiamonds,
        numberOfgemStones,
        numberOfSideDiamonds,
        sideDiamondPriceCarat,
        sideDiamondWeight,
        sideDiamondQuality,
        length,
        width,
        height,
        images,
        metalColorId,
      } = req.body;

      const result = await productVariantService.createProductVariant({
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
        stock,
        gst,
        isFeatured,
        isNewArrival,
        newArrivalUntil,
        returnPolicyText,
        screwOptions,
        numberOfDiamonds,
        numberOfgemStones,
        numberOfSideDiamonds,
        sideDiamondPriceCarat,
        sideDiamondWeight,
        sideDiamondQuality,
        length,
        width,
        height,
        images,
        metalColorId,
      });

      return res.status(result.status).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("Error creating product variant:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Something went wrong while creating variant",
      });
    }
  },

  async updateProductVariant(request, response) {
    const { id } = request.params;
    const {
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
      stock,
      gst,
      returnPolicyText,
      isFeatured,
      isNewArrival,
      newArrivalUntil,
      screwOptions,
    } = request.body;
    console.log("body=>", request.body);
    try {
      const result = await productVariantService.updateProductVariant({
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
        stock,
        gst,
        isFeatured,
        isNewArrival,
        newArrivalUntil,
        returnPolicyText,
        screwOptions,
      });

      return successResponse(response, 200, "Product Variant updated", result);
    } catch (error) {
      console.error(`Error in Updating ProductVariant: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Something went wrong while creating variant",
      });
    }
  },

  async deleteProductVariant(request, response) {
    const { id } = request.params;

    try {
      const result = await productVariantService.deleteProductVariant(id);

      return response.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error(`Error in deleting ProductVariant:`, error);

      return response.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        statusCode: error.statusCode || 500,
      });
    }
  },

  async toggleProductVariant(request, response) {
    const { id, status } = request.params;

    try {
      const result = await productVariantService.activeInactiveProductVariant(
        id,
        status
      );

      return response.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error(`Error in deleting ProductVariant:`, error);

      return response.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        statusCode: error.statusCode || 500,
      });
    }
  },

  async updateProductVariantStock(request, response) {
    const { id } = request.params;
    const { stock } = request.body;

    try {
      if (!id || stock === undefined) {
        return response.status(400).json({
          success: false,
          message: "Product variant ID and stock value are required",
        });
      }

      const result = await productVariantService.updateProductVariantStock(
        id,
        stock
      );

      return response.status(200).json({
        success: true,
        message: "Product variant stock updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error updating product variant stock: ${error}`);
      return response.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update product variant stock",
      });
    }
  },

  async getTrendingProducts(request, response) {
    try {
      const products = await productVariantService.getTrendingProducts();
      return response.status(200).json({
        success: true,
        message: "Trending products fetched successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error fetching trending products:", error);
      const prismaError = handlePrismaError(error);
      return response.status(500).json({
        success: false,
        message: prismaError.message,
        code: prismaError.code,
      });
    }
  },

  //product compare......................................................
  async productComparison(request, response) {
    try {
      const products = await productVariantService.productComparison(
        request.body
      );
      return response.status(200).json({
        success: true,
        message: "Trending products fetched successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error fetching trending products:", error);
      const prismaError = handlePrismaError(error);
      return response.status(500).json({
        success: false,
        message: prismaError.message,
        code: prismaError.code,
      });
    }
  },

  //remove product variant image.........................
  async removeProductVariantImage(request, response) {
    const { id } = request.params;

    try {
      const result = await productVariantService.removeProductVariantImage(id);

      return response.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error(`Error in deleting ProductVariant:`, error);

      return response.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        statusCode: error.statusCode || 500,
      });
    }
  },

  //add product variant image..................................
  async addProductVariantImage(request, response) {
    const { id } = request.params;
    try {
      const uploaded = request.files
        ? await uploadFilesToS3(request.files)
        : [];

      console.log("uploaded=", uploaded);

      const images = uploaded.map((f) => f.url);

      const result = await productVariantService.addProductVariantImage(
        id,
        images
      );

      return response.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error(`Error in deleting ProductVariant:`, error);

      return response.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        statusCode: error.statusCode || 500,
      });
    }
  },

  async updateProductVariantImageOrder(request, response) {
    try {
      const { id } = request.params;
      const { images } = request.body;

      if (!id) {
        return response.status(400).json({
          success: false,
          message: "Product variant ID is required",
        });
      }

      if (!Array.isArray(images)) {
        return response.status(400).json({
          success: false,
          message: "Images must be provided as an array",
        });
      }

      const result = await productVariantService.updateProductVariantImageOrder(
        id,
        images
      );

      return response.status(200).json({
        success: true,
        message: "Image display order updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error updating image order:`, error);
      return response.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update image order",
      });
    }
  },

  //add screw..............................................
  async addScrew(request, response) {
    try {
      const result = await productVariantService.addScrew(request.body);

      return response.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error(`Error in deleting ProductVariant:`, error);

      return response.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        statusCode: error.statusCode || 500,
      });
    }
  },

  //remove screw..............................................
  async removeScrew(request, response) {
    try {
      const result = await productVariantService.removeScrew(request.params);

      return response.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error(`Error in removing screw:`, error);

      return response.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        statusCode: error.statusCode || 500,
      });
    }
  },

  async updateDailyWear(req, res) {
    try {
      const { status } = req.body;
      if (
        ![
          "WORK_WEAR",
          "EVERYDAY_WEAR",
          "PARTY_WEAR",
          "STATEMENT_WEAR",
        ].includes(status)
      ) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const data = await productVariantService.updateDailyWearStatus(
        req.params.id,
        status
      );
      res.status(200).json({ message: "Daily wear updated", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update daily wear", error: error.message });
    }
  },
};
export default productVariantController;
