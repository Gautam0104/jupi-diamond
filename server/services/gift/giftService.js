import prisma from "../../config/prismaClient.js";
import { generateGiftCardCode } from "../../utils/giftCodeGenerator.js";

export const giftCardService = {
  // CREATE
  async createGiftCard({ assignedToId, value, expiresAt, createdById }) {
    // Get customer name from assignedToId
    const customer = await prisma.customer.findUnique({
      where: { id: assignedToId },
      select: { firstName: true },
    });

    // Check if customer already has an active gift card
    const existingGiftCard = await prisma.giftCard.findFirst({
      where: {
        assignedToId,
        isRedeemed: false,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    if (existingGiftCard) {
      throw new Error("Customer already has an active gift card");
    }

    const code = generateGiftCardCode(customer?.firstName); // Pass customer name to code generator
    return await prisma.giftCard.create({
      data: {
        code,
        value,
        assignedToId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdById,
      },
    });
  },

  // READ ALL
  async getAllGiftCards({ search, isRedeemed }) {
    const where = {};
    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { assignedTo: { email: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (isRedeemed !== undefined && isRedeemed !== "") {
      where.isRedeemed =
        typeof isRedeemed === "string"
          ? isRedeemed.toLowerCase() === "true"
          : Boolean(isRedeemed);
    }
    return await prisma.giftCard.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        redeemedBy: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // READ SINGLE
  async getGiftCardById(id) {
    return await prisma.giftCard.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        redeemedBy: true,
      },
    });
  },

  // UPDATE
  async updateGiftCard(id, data) {
    try {
      if (!id) {
        throw new Error("Gift card id is required");
      }
      return await prisma.giftCard.update({
        where: { id },
        data,
      });
    } catch (error) {}
  },

  // DELETE
  async deleteGiftCard(id) {
    try {
      if (!id) {
        throw new Error("Gift id is required!");
      }
      return await prisma.giftCard.delete({ where: { id } });
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  // CUSTOMER: Get My Gift Cards
  async getGiftCardsByCustomer(customerId) {
    return await prisma.giftCard.findMany({
      where: { assignedToId: customerId },
      orderBy: { createdAt: "desc" },
    });
  },

  // CUSTOMER: Redeem
  async redeemGiftCard({ code, customerId, orderValue }) {
    const giftCard = await prisma.giftCard.findUnique({ where: { code } });

    if (!giftCard) throw new Error("Invalid gift card code");
    if (giftCard.isRedeemed) throw new Error("Gift card already redeemed");
    if (giftCard.expiresAt && giftCard.expiresAt < new Date())
      throw new Error("Gift card expired");
    if (giftCard.assignedToId !== customerId)
      throw new Error("Gift card not assigned to this user");

    if (giftCard.value > orderValue) {
      throw new Error("Gift Card value is Invalid");
    }

    return {
      value: giftCard.value,
      currency: giftCard.currency,
      giftId: giftCard.id,
    };
  },
};
