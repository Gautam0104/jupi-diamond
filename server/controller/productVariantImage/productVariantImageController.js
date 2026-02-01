import productVariantImageService from "../../services/productVariantImage/productVariantImageService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const productVariantImage = {
  async getproductVariantImage(request, response) {
    try {
      const result = await productVariantImageService.getproductVariantImage();
      return successResponse(
        response,
        200,
        "ProdductVariantImage Fetched Successfylly",
        result
      );
    } catch (error) {
      console.error(`Error in getting ProductVariantImages: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async getProductVariantImageById(request, response) {
    const { id } = request.params;
    try {
      const result =
        await productVariantImageService.getproductVariantImageById(id);
      return response.status(200).json({
        message: "ProductVariantImage fetched successfully",
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

  async creteProductVariantImage(request, response) {
    const { productVariantId, metalColorVariantId, gemstoneColorVariantId } =
      request.body;

    const imagePaths = request.files.map((file) => file.path);
    try {
      const result = await productVariantImageService.createProductVariantImage(
        {
          imageUrl: imagePaths,
          productVariantId,
          metalColorVariantId,
          gemstoneColorVariantId,
        }
      );
      return response.status(200).json({
        message: "ProductVariantImage created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in creating ProductVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateProductVariantImage(request, response) {
    const { id } = request.params;
    const {
      imageUrl,
      productVariantId,
      metalColorVariantId,
      gemstoneColorVariantId,
    } = request.body;
    try {
      const result = await productVariantImageService.updateProductVariantImage(
        {
          id,
          imageUrl,
          productVariantId,
          metalColorVariantId,
          gemstoneColorVariantId,
        }
      );
      return response.status(200).json({
        message: "ProductVariantImage Updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in updating ProductVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async deleteProductVariantImage(request, response) {
    const { id } = request.params;
    try {
      const result = await productVariantImageService.deleteProductVariantImage(
        id
      );
      return response.status(200).json({
        message: "ProductVariantImage deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting ProductVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
};
export default productVariantImage;
