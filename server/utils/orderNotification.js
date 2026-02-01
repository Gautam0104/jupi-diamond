import prisma from "../config/prismaClient.js";
import { io } from "../index.js";

export async function createOrderNotification(orderId) {
  const message = `New order has been placed. (Order ID: ${orderId})`;

  const notification = await prisma.notification.create({
    data: {
      title: "New Order",
      message,
      type: "ORDER_PLACED", // you can define this in NotificationType enum
      status: "UNREAD",
      referenceId: orderId,
      referenceType: "ORDER",
      url: "order"
    },
  });

  // Emit real-time to all admins
  io.emit("admin-notification", {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt,
    referenceId: orderId,
    url: "order"
  });
}



export async function cancelOrderNotification(orderId) {
  const message = `An order has been cancelled. (Order ID: ${orderId})`;

  const notification = await prisma.notification.create({
    data: {
      title: "Order Cancelled",
      message,
      type: "ORDER_CANCELLED", // define this in your NotificationType enum
      status: "UNREAD",
      referenceId: orderId,
      referenceType: "ORDER",
      url: "order"
    },
  });

  io.emit("admin-notification", {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    createdAt: notification.createdAt,
    referenceId: orderId,
    url: "order"
  });
}
