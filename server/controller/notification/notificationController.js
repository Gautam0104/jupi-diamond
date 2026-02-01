import { successResponse } from "../../utils/responseHandler.js";
import notificationService from "../../services/notification/notificationService.js";

const notificationController = {
  // Get all banners (Admin)
  async getAllNotification(request, response) {
    try {
      const result = await notificationService.getAllNotification();
      console.log(result);
      
      return successResponse(
        response,
        200,
        "Notification fetched successfully",
        result
      );
    } catch (error) {
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },
  async deleteNotification(request, response) {
    try {
      const result = await notificationService.deleteNotification(
        request.params.id
      );
      return successResponse(
        response,
        200,
        "Notification deleted successfully",
        result
      );
    } catch (error) {
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },
};

export default notificationController;
