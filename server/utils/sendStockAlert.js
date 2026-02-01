import prisma from "../config/prismaClient.js";
import { io } from "../index.js";

export async function sendStockLowAlert(productVariantId) {
  const product = await prisma.productVariant.findUnique({
    where: { id: productVariantId },
    select: {
      id: true,
      productVariantTitle: true,
      stock: true,
    },
  });

  if (!product) return;

  const threshold = product.stockAlertThreshold ?? 5;
  if ((product.stock ?? 0) <= threshold) {
    const message = `Stock low: ${product.productVariantTitle} (Stock: ${product.stock})`;

    const notification = await prisma.notification.create({
      data: {
        title: "Low Stock Alert",
        message,
        type: "STOCK_ALERT",
        status: "UNREAD",
        referenceId: product.id,
        referenceType: "PRODUCT_VARIANT",
      },
    });

    // Broadcast to all connected admins
    io.emit("admin-notification", {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt,
      referenceId: product.id,

    });
  }
}
