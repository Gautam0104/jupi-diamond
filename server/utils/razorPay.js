// Razorpay instance
import Razorpay from "razorpay";
import prisma from "../config/prismaClient.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//create razorpay order............................................................
export const createRazorpayOrder = async (payment, orderId) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const options = {
    amount: Math.round(payment.totalAmountPrice * 100), // Amount in paisa
    currency: payment.currency === "INR" ? "INR" : payment.currency,
    receipt: order.orderNumber,
    payment_capture: 1,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  // Save Razorpay order ID in your order DB (optional)
  await prisma.order.update({
    where: { id: orderId },
    data: {
      razorpayOrderId: razorpayOrder.id, // Store Razorpay order_id
    },
  });

  return razorpayOrder;
};



export const refundRazorpayPayment = async ({ paymentId, refundAmount, reason, orderNumber }) => {
  const refund = await razorpay.payments.refund(paymentId, {
    amount: Math.round(refundAmount * 100), // Amount in paisa
    speed: "normal", 
    notes: {
      reason: reason || "Admin initiated refund",
      orderNumber: orderNumber,
    },
  });

  return refund;
};
