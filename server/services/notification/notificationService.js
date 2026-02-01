import prisma from "../../config/prismaClient.js";

const notificationService = {
  async getAllNotification() {
    try {
      const notifications = await prisma.notification.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 30,
      });

      return notifications;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },
  async deleteNotification(id) {
    try {
      if (!id) {
        throw new Error("Notification id is required");
      }

      const notifications = await prisma.notification.delete({
        where: { id: id },
      });

      return notifications;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },
};

export default notificationService;
