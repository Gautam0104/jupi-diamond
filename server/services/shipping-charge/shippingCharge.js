import prisma from "../../config/prismaClient.js";

const shippingChargeService = {
  async createShippingCharge(data) {
    try {
      const existing = await prisma.shippingCharge.findFirst({
        where: { name: data.name },
      });
      if (existing) {
        throw new Error("Shipping charge with this name already exists");
      }

      return await prisma.shippingCharge.create({ data });
    } catch (error) {
      throw new Error("Something went wrong: " + error.message);
    }
  },

  async getAllShippingCharges() {
    try {
      return await prisma.shippingCharge.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error("Something went wrong: " + error.message);
    }
  },

  async getShippingChargeById(id) {
    try {
      return await prisma.shippingCharge.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error("Something went wrong: " + error.message);
    }
  },

  async updateShippingCharge(id, data) {
    try {
      const existing = await prisma.shippingCharge.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new Error("Shipping charge not found");
      }

      if (data.name && data.name !== existing.name) {
        const duplicate = await prisma.shippingCharge.findFirst({
          where: { name: data.name },
        });
        if (duplicate) {
          throw new Error(
            "Another shipping charge with this name already exists"
          );
        }
      }

      return await prisma.shippingCharge.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Something went wrong: " + error.message);
    }
  },

  async deleteShippingCharge(id) {
    try {
      const existing = await prisma.shippingCharge.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new Error("Shipping charge not found");
      }

      return await prisma.shippingCharge.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Something went wrong: " + error.message);
    }
  },
};

export default shippingChargeService;
