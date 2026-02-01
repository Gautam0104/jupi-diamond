import prisma from "../../config/prismaClient.js";
import { paginate } from "../../utils/pagination.js";

export const contactSupport = {
  async submitContactForm({ name, email, phone, subject, message }) {
    return await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });
  },

  async getAllMessages(query) {
    let whereFilter = {};
  
    const { search } = query;

    if (search !== "" && search !== undefined && search !== null) {
      whereFilter = {
        ...whereFilter,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { subject: { contains: search, mode: "insensitive" } },
          { message: { contains: search, mode: "insensitive" } },
        ],
      };
    }
    const totalCount = await prisma.contactMessage.count({
      where: { ...whereFilter },
    });

    const { page, limit, skip, totalPages, currentPage } = paginate(
      query,
      totalCount
    );
    const contactData = await prisma.contactMessage.findMany({
      where: whereFilter,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return {
      contactData,
      pagination: { page, limit, skip, totalPages, currentPage, totalCount },
    };
  },

  async getMessageById(id) {
    return await prisma.contactMessage.findUnique({
      where: { id },
    });
  },

  async updateMessageStatus(id, status) {
    return await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
  },

  async deleteMessage(id) {
    return await prisma.contactMessage.delete({
      where: { id },
    });
  },
};
