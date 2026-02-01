import twilio from "twilio";
import { configDotenv } from "dotenv";
configDotenv();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Cleaned SMS types enum
const SmsTypes = {
  OTP: "OTP",
  WELCOME: "WELCOME",
  ORDER_CONFIRM: "ORDER_CONFIRM",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  APPOINTMENT: "APPOINTMENT",
  PROMOTIONAL: "PROMOTIONAL",
  CUSTOM: "CUSTOM",
  ORDER_SHIPPED: "ORDER_SHIPPED",
  ORDER_DELIVERED: "ORDER_DELIVERED",
  RETURN_REQUESTED: "RETURN_REQUESTED",
  RETURN_APPROVED: "RETURN_APPROVED",
  ORDER_RETURNED: "ORDER_RETURNED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  ORDER_REFUNDED: "ORDER_REFUNDED",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  NEW_PRODUCT: "NEW_PRODUCT",
  FEATURED_PRODUCT: "FEATURED_PRODUCT",
  ORDER_STATUS: "ORDER_STATUS",
  ORDER_TRACKING: "ORDER_TRACKING",
   VERIFICATION: "VERIFICATION",
};

// Standard message templates
const smsTemplates = {
  OTP: ({ code, validity = 10 }) =>
    `Your one-time password (OTP) is ${code}. This code will expire in ${validity} minutes. Please do not share it. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  WELCOME: ({ name }) =>
    `Dear ${name}, welcome to our community! Your account has been successfully registered. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  ORDER_CONFIRM: ({ orderId, trackingUrl }) =>
    `Thank you for your order! #${orderId} confirmed. Track: ${trackingUrl} – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  ORDER_SHIPPED: ({ orderId, trackingUrl }) =>
    `Your order #${orderId} has been shipped! Track: ${trackingUrl} – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  ORDER_DELIVERED: ({ orderId }) =>
    `Your order #${orderId} has been delivered. Thank you! – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  RETURN_REQUESTED: ({ orderId }) =>
    `Return request received for order #${orderId}. We’ll process it soon. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  RETURN_APPROVED: ({ orderId }) =>
    `Your return request for order #${orderId} is approved. Prepare for pickup. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  ORDER_RETURNED: ({ orderId }) =>
    `Return for order #${orderId} received. Refund in 3–5 business days. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  ORDER_CANCELLED: ({ orderId }) =>
    `Order #${orderId} has been cancelled. Refund will be initiated if paid. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  ORDER_REFUNDED: ({ orderId, amount }) =>
    `Refund of ₹${amount} for order #${orderId} has been processed. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  PAYMENT_SUCCESS: ({ amount, orderId }) =>
    `Payment of ₹${amount} received for order #${orderId}. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  APPOINTMENT: ({ date, time, contact }) =>
    `Reminder: Appointment on ${date} at ${time}. Contact: ${contact}. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  PROMOTIONAL: ({ offer, link }) =>
    `${offer}. Shop now: ${link}. T&C apply. Reply STOP to opt out. – ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  VERIFICATION: ({ verifyLink }) => 
    `Please verify your account by visiting: ${verifyLink} - ${process.env.SMS_BRAND_NAME || "YourCompany"}`,

  CUSTOM: ({ message }) => message,
};

// Send SMS via Twilio
const sendTwilioSMS = async (to, type = SmsTypes.CUSTOM, data = {}) => {
  try {
    if (!smsTemplates[type]) {
      throw new Error(`Unsupported SMS type: ${type}`);
    }

    const body = smsTemplates[type](data);

    const message = await client.messages.create({
      body,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to,
    });

    console.log(`✅ SMS sent to ${to}: SID = ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`❌ SMS failed: ${error.message}`);
    throw error;
  }
};

export { sendTwilioSMS, SmsTypes };
