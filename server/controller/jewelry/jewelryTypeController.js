import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";
import jewelryTypeService from "../../services/jewelry/jewelryTypeService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const jewelryTypeController = {
  //controller for fetching metal type.........................
  async jewelryTypeGetController(request, response) {
    try {
      const result = await jewelryTypeService.getJewelryTypeService(
        request.query
      );
      return response.json({
        success: true,
        status: 200,
        message: "JewelryType fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting JewelaryType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //jewelry type public controller..................................
  async jewelryTypeGetPublicController(request, response) {
    try {
      const result = await jewelryTypeService.getJewelryTypePublicService();
      return response.json({
        success: true,
        status: 200,
        message: "Jewelry Type fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting JewelaryType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async jewelryTypeGetByIdController(request, response) {
    const { id } = request.params;
    try {
      const result = await jewelryTypeService.jewelryTypeGetByIdService(id);
      return response.json({
        success: true,
        status: 200,
        message: "jewelryType fetched by Id successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting JewelaryType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //controller for creating metal Type
  async jewelryTypePostController(request, response) {
    const { name, jewelryTypeSlug } = request.body;
    const image = request.files && (await uploadFilesToS3(request.files));

    try {
      const result = await jewelryTypeService.createJewelry({
        name,
        jewelryTypeSlug,
        image,
      });
      return response.status(201).json({
        message: "jewelryType created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in creating JewelaryType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //controller for updating metal Type
  async jewelryTypeUpdateController(request, response) {
    const { id } = request.params;
    const { name } = request.body;
    const image = request.files && (await uploadFilesToS3(request.files));
    console.log("image=", image);
    try {
      const result = await jewelryTypeService.jewlryTypeUpdateService({
        id,
        name,
        image,
      });
      return response.status(201).json({
        success: true,
        message: "JewlryType Updated Successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in updating JewelaryType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //controller for deleting metal type
  async JewelryTypeDeleteController(request, response) {
    console.log(request);
    console.log(response);
    const { id } = request.params;

    try {
      const result = await jewelryTypeService.jewelryTypeDeleteService({ id });

      return response.status(200).json({
        success: true,
        status: 200,
        message: "JewelryType deleted Successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting JewelaryType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
  async jewelryTypeToggleController(request, response) {
    const { id } = request.params;
    try {
      const result = await jewelryTypeService.jewelryTypeToggleService({ id });
      return response.status(200).json({
        success: true,
        status: 200,
        message: "JewelryType toggled Successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in toggling JewelaryType: ${error}`);

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

export default jewelryTypeController;
