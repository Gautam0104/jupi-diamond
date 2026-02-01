import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";
import occassionService from "../../services/occassion/occassionService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const occassionController = {
  async getOccassion(request, response) {
    try {
      const result = await occassionService.getOccassion(request.query);
      return response.status(200).json({
        message: "Occassion fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting Occassion: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async getOccassionById(request, response) {
    const { id } = request.params;
    try {
      const result = await occassionService.getOccassionById(id);
      return response.status(200).json({
        message: "Occassion fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting Occassion: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async createOccassion(request, response) {
    const { name, description } = request.body;
    const image = request.files && (await uploadFilesToS3(request.files));

    try {
      const result = await occassionService.createOccassion({
        name,
        description,
        image,
      });
      return response.status(200).json({
        message: "Occassion created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in creating Occassion: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateOccassion(request, response) {
    const { id } = request.params;
    const { name, description } = request.body;
    const image = request.files && (await uploadFilesToS3(request.files));

    try {
      const result = await occassionService.updateOccassion({
        id,
        name,
        description,
        image,
      });
      return response.status(200).json({
        message: "Occassion updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in updating Occassion: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async deleteOccassion(request, response) {
    const { id } = request.params;
    try {
      const result = await occassionService.deleteOccassion(id);
      return response.status(200).json({
        message: "Occassion deleted successfully",
        data: result,
      });
    } catch (error) {
      console.log(error);
      console.error(`Error in deleting Occassion: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
  //active/inactive.................
  async toggleOccassion(request, response) {
    const { id } = request.params;
    try {
      const result = await occassionService.toggleOccassion(id);
      return response.status(200).json({
        message: "Occassion status updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in updating Occassion status: ${error}`);
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

export default occassionController;
