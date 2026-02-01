import prisma from "../../config/prismaClient.js";
import { sendEmail } from "../../helper/sendEmail.js";
import { getOrderConfirmationTemplate } from "../../template/orderConfirmation.js";

const paymentService = {
  //razorpay payment verify...............................
  async verifyRazorPayPayment(data) {
    try {
      const {
        status,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignatureId,
        orderId,
      } = data;

      const findOrder = await prisma.order.findFirst({
        where: {
          id: orderId,
        },
        select: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          address: true,
          orderItems: true,
          finalAmount: true,
          createdAt: true,
          orderNumber: true,
          discountAmount: true,
          gstAmount: true,
        },
      });

      await prisma.paymentHistory.update({
        where: {
          orderId: orderId,
        },
        data: {
          razorpayPaymentId: razorpayPaymentId,
          razorpaySignature: razorpaySignatureId,
          razorpayOrderId: razorpayOrderId,
          paymentMethod: "RAZORPAY",
          status,
          paidAt: status === "SUCCESS" ? new Date() : null,
        },
      });

      await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: status === "SUCCESS",
          paymentStatus: status === "SUCCESS" ? status : "FAILED",
          razorpayOrderId: razorpayOrderId,
          paidAt: status === "SUCCESS" ? new Date() : null,
        },
      });

      const emailHtml = getOrderConfirmationTemplate({
        customerName: `${findOrder?.customer?.firstName} ${findOrder?.customer?.lastName}`,
        orderId: findOrder.orderNumber,
        items: findOrder.orderItems,
        totalAmount: findOrder.finalAmount,
        discountAmount: findOrder.discountAmount,
        gstAmount: findOrder.gstAmount,
        orderDate: findOrder.createdAt,
      });

      sendEmail({
        to: findOrder?.customer?.email,
        subject: `Your Order ${findOrder.orderNumber} Confirmation`,
        html: emailHtml,
      });
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  //paypal payment verify...................................
  async capturePayment(orderId) {
    try {
      if (!orderId) {
        throw new Error("Order Id is required");
      }

      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      const response = await client().execute(request);
      return response.result;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },
};
export default paymentService;
