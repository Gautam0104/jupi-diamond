import prisma from "../../config/prismaClient.js";
import adminService from "../../services/admin/adminService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const adminController = {
  async adminRegister(request, response) {
    try {
      const result = await adminService.adminRegisteration(request.body);
      return response.status(201).json({
        message: "Admin registration successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in adminRegister:", error);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        code: prismaError.code,
      });
    }
  },
  async fetchStaff(request, response) {
    try {
      const result = await adminService.fetchStaff(request.query);
      return response.status(201).json({
        message: "Admin registration successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in adminRegister:", error);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        code: prismaError.code,
      });
    }
  },


  async fetchDashboardCount(request, response) {
    try {
      const result = await adminService.fetchDashboardCount(request.query);
      return response.status(201).json({
        message: "Admin registration successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in adminRegister:", error);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        code: error.code,
      });
    }
  },


  async fetchOutOfStockProducts(request, response) {
    try {
      const result = await adminService.fetchLowStock(request.query);
      return response.status(201).json({
        message: "Fetched Out of Stock successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in fetched out of stock:", error);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        code: error.code,
      });
    }
  },



  
  //fetch by id...............................................
  async fetchStaffById(request, response) {
    try {
      const result = await adminService.fetchStaffById(request.params.id);
      return response.status(201).json({
        message: "Admin registration successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in adminRegister:", error);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        code: error.code,
      });
    }
  },
  async updateAdminStaff(request, response) {
    try {
      const result = await adminService.updateAdminStaff(request.body);
      return response.status(201).json({
        message: "Admin registration successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in adminRegister:", error);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        code: prismaError.code,
      });
    }
  },

  async adminLogin(request, response) {
    try {
      const result = await adminService.adminLoginFunction(
        request.body,
        request.session
      );

      return response.status(200).json(result);
    } catch (error) {
      console.error("Error in adminLogin:", error);

      // const prismaError = handlePrismaError(error);
      return response.status(error.statusCode || 500).json({
        message: error.message,
        code: error.code,
      });
    }
  },

  async checkSession(req, res) {
    try {
      console.log("admin=", req.session);
      console.log("admin=", req.session?.admin);
      console.log("user=", req.session?.user);
      const adminId = req.session?.admin?.id;
      const session = await adminService.checkAdminSession(adminId);
      // console.log("session=>", session);
      return res.status(200).json({
        message: "Active session found",
        isLoggedIn: true,
        data: session,
      });
    } catch (error) {
      console.error(`Error checking session: ${error}`);
      return res.status(500).json({
        message: "Error checking session status",
        error: error.message,
      });
    }
  },
  async isActiveController(requsest, response) {
    const { id } = requsest.params;

    try {
      const result = await adminService.isActiveUserService(id);
      response.status(201).json({
        message: "is active toggle successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in adminLogin:", error);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        code: prismaError.code,
      });
    }
  },

  async kycUpdate(request, response) {
    const { retailerId } = request.params;
    const { status } = request.body;

    console.log("retailerId", retailerId);
    console.log("status", status);

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return response.status(400).json({
        message: "Invalid status",
      });
    }

    try {
      const retailer = await prisma.retailer.update({
        where: { id: retailerId },
        data: { retailerStatus: status },
      });

      return response.status(200).json({
        message: `Retailer KYC ${status.toLowerCase()} successfully`,
        data: retailer,
      });
    } catch (error) {
      console.log("Error updating retialer KYC :", error);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        code: prismaError.code,
      });
    }
  },
};

export default adminController;
