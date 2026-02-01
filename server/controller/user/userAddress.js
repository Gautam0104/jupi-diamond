import userAddressService from "../../services/user/userAddress.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const userAddressController = {
  async getUserAddress(request, response) {
    const customerId = request.session?.user?.id;
    try {
      const result = await userAddressService.getUserAddress(customerId);
      return response.status(200).json({
        message: "address fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting userAddress: ${error}`);

      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async addAddress(request, response) {
    const {
      houseNo,
      landMark,
      street,
      city,
      state,
      country,
      postalCode,
      isBilling,
      addressType,
      panNumber,
      gstNumber,
      phone,
    } = request.body;

    try {
      const result = await userAddressService.addAddress({
        customerId: request.session?.user?.id,
        houseNo,
        landMark,
        state,
        street,
        city,
        country,
        postalCode,
        isBilling,
        addressType,
        panNumber,
        gstNumber,
        phone,
      });

      return response.status(201).json({
        message: "address fetched successfully",
        data: result,
      });
    } catch (error) {
      // console.error(`Error in Creating ProductVariant: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async getAddressById(request, response) {
    const { id } = request.params;
    const customerId = request.session?.user?.id;
    try {
      const result = await userAddressService.getUserAddressById(
        id,
        customerId
      );
      return response.status(200).json(result);
    } catch (error) {
      console.error(`Error in getting ProductVariant: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async deleteUserAddress(request, response) {
    const { id } = request.params;
    const customerId = request.session?.user?.id;

    try {
      const result = await userAddressService.deleteUserAddress(id, customerId);
      return response.status(200).json({
        message: "address deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting ProductVariant: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async updateUserAddress(request, response) {
    const { id } = request.params;
    const customerId = request.session?.user?.id;
    const {
      houseNo,
      landMark,
      street,
      city,
      state,
      country,
      postalCode,
      panNumber,
      gstNumber,
      addressType,
    } = request.body;

    try {
      const result = await userAddressService.updateUserAddress({
        id,
        customerId,
        houseNo,
        landMark,
        state,
        street,
        city,
        country,
        postalCode,
        panNumber,
        gstNumber,
        addressType,
      });

      return response.status(200).json({
        message: "address updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in updating address: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
      });
    }
  },
};

export default userAddressController;
