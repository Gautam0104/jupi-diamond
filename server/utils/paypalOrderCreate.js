import prisma from "../config/prismaClient.js";
import paypal from "@paypal/checkout-server-sdk";
import client from "./paypalClient.js";

export const createPaypalOrder = async (orderId, currency = "USD") => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const request = new paypal.orders.OrdersCreateRequest();
  request.headers["Prefer"] = "return=representation";

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: order?.finalAmount.toString(),
        },
      },
    ],
  });

  const response = await client().execute(request);
  return response.result;
};
