import publicService from "../../services/indexPagePublicAPI/publicService.js";
import { successResponse } from "../../utils/responseHandler.js";

const publicController = {
  async fetchIndexPageData(request, response) {
    try {
      const result = await publicService.getPublicIndexData(request.query);
      return successResponse(
        response,
        200,
        "Data fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in FetchingCollection ${error}`);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },
  //product page data filter jewellery type, style, shape, gold color, shape diamond color...................
  async fetchFilterData(request, response) {
    try {
      const result = await publicService.fetchFilterData(request.query);

      return successResponse(response, 200, "fetched successfully", result);
    } catch (error) {
      console.error(`Error in FetchingCollection ${error}`);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async fetchProductStylesByJewelryType(request, response) {
    try {
      const { jewelryTypeSlug } = request.params;
      const result =
        await publicService.fetchProductStylesByJewelryType(jewelryTypeSlug);
      return successResponse(response, 200, "fetched successfully", result);
    } catch (error) {
      console.error(`Error in fetchProductStylesByJewelryType ${error}`);
      return errorResponse(response, error.statusCode || 500, error.message);
    }
  },
};

export default publicController;
