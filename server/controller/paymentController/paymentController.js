import prisma from "../../config/prismaClient.js";
import paymentService from "../../services/paymentService/paymentService.js";
import crypto from "crypto";

const paymentController = {
  async verifyRazorpayPayment(req, res) {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        orderId,
      } = req.body;

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      console.log("generatedSignature==", generatedSignature);
      console.log("razorpay_signature==", razorpay_signature);

      // Save payment info and update order
      await paymentService.verifyRazorPayPayment({
        orderId,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignatureId: razorpay_signature,
        status: "SUCCESS",
      });

      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentId: razorpay_payment_id,
        }
      });

      res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
      console.error("Verify Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
export default paymentController;
