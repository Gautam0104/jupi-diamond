import collectionService from "../../services/collection/collectionService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";

const collectionController = {
  async getCollection(request, response) {
    try {
      const result = await collectionService.getCollection(request.query);
      return successResponse(
        response,
        200,
        "collection fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in FetchingCollection ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async createCollection(request, response) {
    const { name, gender, description } = request.body;
    const thumbnailImage =
      request.files && (await uploadFilesToS3(request.files));
    try {
      const result = await collectionService.createCollectionService({
        name,
        gender,
        description,
        thumbnailImage,
      });

      return successResponse(
        response,
        201,
        "Collection created successfully",
        result
      );
    } catch (error) {
      console.error(`Error in Creating Collection: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async getCollectionById(request, response) {
    const { id } = request.params;
    try {
      const result = await collectionService.getCollectionById(id);
      return successResponse(
        response,
        200,
        "Collection fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in fetching collection ById : ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateCollection(request, response) {
    const { id } = request.params;
    const { name, gender, description } = request.body;
    const thumbnailImage =
      request.files && (await uploadFilesToS3(request.files));
    try {
      const result = await collectionService.updateCollection({
        id,
        name,
        gender,
        description,
        thumbnailImage,
      });
      return successResponse(
        response,
        201,
        "Collection updated successfully",
        result
      );
    } catch (error) {
      console.error(`Error in Updating collection: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async deleteCollection(request, response) {
    const { id } = request.params;
    try {
      const result = await collectionService.collectionDeleteService({ id });
      return successResponse(
        response,
        200,
        "collection deleted successfully",
        result
      );
    } catch (error) {
      console.error(`Error in Deleting collection: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  // toggle collection...................
  async toggleCollection(request, response) {
    const { id } = request.params;
    try {
      const result = await collectionService.toggleCollectionStatusService(id);
      return successResponse(
        response,
        200,
        "collection toggled successfully",
        result
      );
    } catch (error) {
      console.error(`Error in toggling collection: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //public api collection....................................
  async getPublicCollection(request, response) {
    try {
      const result = await collectionService.getPublicCollection(request.query);
      return successResponse(
        response,
        200,
        "collection fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in FetchingCollection ${error}`);

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

export default collectionController;
