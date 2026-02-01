import cartService from "../../services/cart/cartService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const cartController = {
  async fetchCustomerCart(request, response) {
    const userId = request.session?.user?.id;
    try {
      const result = await cartService.fetchCustomerCart(userId);
      return response.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(`Error in Finding CartBy User Role ${error}`);

      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        code: error.code,
      });
    }
  },
};
export default cartController;
