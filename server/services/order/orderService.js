import Razorpay from "razorpay";
import prisma from "../../config/prismaClient.js";
import convertCurrency from "../../utils/currency.js";
import { getEndOfDayUTCDate, getTodayUTCDate } from "../../utils/dateUtil.js";
import { generateReadableOrderNumber } from "../../utils/generateOrder.js";
import { calculateOrderPricing } from "../../utils/orderPaymentVerify.js";
import { paginate } from "../../utils/pagination.js";
import { createPaypalOrder } from "../../utils/paypalOrderCreate.js";
import {
  createRazorpayOrder,
  refundRazorpayPayment,
} from "../../utils/razorPay.js";
import { sendStockLowAlert } from "../../utils/sendStockAlert.js";
import { sendTwilioSMS, SmsTypes } from "../../utils/twilioSendSMS.js";
import { cancelOrderNotification, createOrderNotification } from "../../utils/orderNotification.js";

const orderService = {
  async createOrder(data) {
    try {
      const {
        customerId,
        addressId,
        paymentMethod,
        totalAmount,
        finalAmount,
        currency,
        orderItems = [],
        gstAmount = 0,
        discountAmount = 0,
        couponId = null,
        giftCardId = null,
      } = data;

      const orderResult = await prisma.$transaction(async (tx) => {
        const enrichedOrderItems = await Promise.all(
          orderItems.map(async (item) => {
            console.log("item==>", item);
            const variant = await tx.productVariant.findUnique({
              where: { id: item.productVariantId },
              include: {
                products: {
                  include: {
                    jewelryType: { select: { name: true, id: true } },
                    productStyle: { select: { name: true, id: true } },
                    collection: { select: { name: true, id: true } },
                    occasion: { select: { name: true, id: true } },
                  },
                },
                metalVariant: { include: { metalType: true } },
                metalColor: true,
                gemstoneVariant: { include: { gemstoneType: true } },
                productVariantImage: {
                  take: 1,
                  orderBy: { displayOrder: "asc" },
                },
                productSize: {
                  take: 1,
                },
                GlobalDiscount: true,
              },
            });

            // Stock validation
            if (!variant) {
              throw new Error(
                `Product variant not found: ${item.productVariantId}`
              );
            }

            if (variant.stock < item.quantity) {
              throw new Error(
                `Product ${variant.productVariantTitle} is out of stock or does not have enough quantity.`
              );
            }

            if (variant.stock <= 5) {
              await sendStockLowAlert(item.productVariantId);
            }

            // Stock decrement inside transaction
            const res = await tx.productVariant.update({
              where: { id: item.productVariantId },
              data: {
                stock: { decrement: item.quantity },
              },
            });

            return {
              productVariantId: variant.id,
              quantity: Number(item.quantity),
              priceAtPurchase: Number(variant.finalPrice),
              discountValue:
                Number(variant?.GlobalDiscount?.discountValue) || 0,
              gst: Number(variant.gst),
              total: Number(variant.finalPrice * item.quantity),

              // Snapshot fields
              jewelryType: variant?.products?.jewelryType?.name,
              jewelryTypeId: variant?.products?.jewelryType?.id,
              styleName: variant?.products?.productStyle?.name,
              styleTypeId: variant?.products?.productStyle?.id,
              collection: variant?.products?.collection?.name,
              collectionId: variant?.products?.collection?.id,
              occasion: variant?.products?.occasion?.name,
              occasionId: variant?.products?.occasion?.id,

              productName: variant?.productVariantTitle || null,
              metalType: variant.metalVariant?.metalType?.name || null,
              purityLabel: variant.metalVariant?.purityLabel || null,
              metalColorName: variant.metalColor?.name || null,
              metalPrice: variant.metalVariant?.metalPriceInGram || null,
              metalWeight: variant.metalWeightInGram || null,

              origin: variant.gemstoneVariant?.origin || null,
              gemstoneShape: variant.gemstoneVariant?.shape || null,
              gemstoneType: variant.gemstoneVariant?.gemstoneType?.name || null,
              gemstoneClarity: variant.gemstoneVariant?.clarity || null,
              gemstoneCut: variant.gemstoneVariant?.cut || null,
              gemstoneColor: variant.gemstoneVariant?.color || null,
              gemstoneCenterCaratWeight: variant.gemstoneWeightInCarat || null,
              gemstoneSideCaratWeight: variant.sideDiamondWeight || null,
              sideStonePrice: variant.sideDiamondPriceCarat || null,
              gemstonePrice: variant.gemstoneVariant?.gemstonePrice || null,
              certification: variant.gemstoneVariant?.certification || null,

              imageUrl: variant.productVariantImage[0]?.imageUrl || null,
              size: variant.productSize[0]?.label?.toString() || null,

              discountName: variant.GlobalDiscount?.title || null,
              grossWeight: variant.grossWeight || null,
              gstValue: variant.gst || null,

              couponName: item.couponName || null,
              couponDiscountValue: item.couponDiscountValue || null,
            };
          })
        );

        return enrichedOrderItems;
      });

      const enrichedOrderItems = await orderResult;

      let findCoupon;
      if (couponId) {
        findCoupon = await prisma.coupon.findFirst({
          where: { id: couponId },
        });
      }

      let findGift;

      if (giftCardId) {
        findGift = await prisma.giftCard.findUnique({
          where: { id: giftCardId },
        });
      }

      const {
        itemDetails,
        totalAmountPrice,
        gstAmountPrice,
        discountAmountPrice,
      } = await calculateOrderPricing(
        orderItems,
        couponId,
        currency,
        giftCardId,
        customerId
      );

      let frontendAmountToMatch = finalAmount;
      if (currency !== "INR") {
        frontendAmountToMatch = await convertCurrency(
          finalAmount,
          "INR",
          currency
        );
      }

      if (Number(frontendAmountToMatch) !== Number(totalAmountPrice)) {
        throw new Error("Total amount mismatch. Please verify your cart.");
      }

      const payment = { totalAmountPrice, currency, paymentMethod };

      const address = await prisma.address.findUnique({
        where: { id: addressId },
      });

      const order = await prisma.order.create({
        data: {
          orderNumber: generateReadableOrderNumber(),
          customer: {
            connect: { id: customerId },
          },
          address: {
            connect: { id: addressId },
          },
          addressSnapshot: address ? { ...address } : null,
          paymentMethod,
          totalAmount: Number.parseFloat(totalAmount),
          finalAmount: Number.parseFloat(totalAmountPrice),
          gstAmount: Number.parseFloat(gstAmountPrice),
          discountAmount: Number.parseFloat(discountAmountPrice),
          orderCurrency: currency,
          finalAmountInInr: await convertCurrency(
            totalAmountPrice,
            currency,
            "INR"
          ),
          finalAmountInUsd: await convertCurrency(
            totalAmountPrice,
            currency,
            "USD"
          ),
          couponId,
          ...(giftCardId && {
            giftCard: {
              connect: { id: giftCardId },
            },
          }),
          code: findCoupon?.code,
          discountType: findCoupon?.discountType,
          discountValue: findCoupon?.discountValue,
          orderItems: {
            create: enrichedOrderItems,
          },
        },
        include: {
          orderItems: {
            select: {
              id: true,
              // productVariant: true,
              quantity: true,
              gst: true,
              total: true,
            },
          },
        },
      });

      if (giftCardId) {
        const updateGift = await prisma.giftCard.update({
          where: { id: giftCardId },
          data: {
            isRedeemed: true,
            redeemedById: customerId,
            redeemedAt: new Date(),
            orderId: order.id,
          },
        });
      }

      //cart delete from customer.......................
      // await prisma.cart.delete({
      //   where: {
      //     customerId,
      //   },
      // });

      let orderDetail;
      if (paymentMethod === "RAZORPAY") {
        orderDetail = await createRazorpayOrder(payment, order.id);
        orderService.addPayment(order.id, payment);
      } else {
        orderDetail = await createPaypalOrder(order.id, currency);
        orderService.addPayment(order.id, payment);
      }

      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "PENDING", // or 'PENDING' based on your flow
        },
      });


      await createOrderNotification(order.id)


      return { ...order, orderDetail };
    } catch (error) {
      console.log("error=", error);
      throw new Error(
        "Something went wrong while creating the order, " + error.message
      );
    }
  },

  //fetch admin all Order...........................................................
  async fetchAdminAllOrder(query) {
    const {
      search,
      status,
      paymentStatus,
      paymentMethod,
      minAmount,
      maxAmount,
      transactionId,
      startDate,
      endDate,
    } = query;
    try {
      let whereFilter = {};

      //searching..........................
      if (search !== null && search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { transactionId: { contains: search, mode: "insensitive" } },
            {
              customer: {
                OR: [
                  { firstName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                ],
              },
            },
          ],
        };
      }

      //status filter..................................
      if (
        paymentStatus !== null &&
        paymentStatus !== undefined &&
        paymentStatus !== "" &&
        ["PENDING", "SUCCESS", "FAILED", "REFUNDED"].includes(paymentStatus)
      ) {
        whereFilter = {
          ...whereFilter,
          paymentStatus: paymentStatus,
        };
      }
      //paymentMethod filter..................................
      if (
        paymentMethod !== null &&
        paymentMethod !== undefined &&
        paymentMethod !== "" &&
        ["RAZORPAY", "PAYPAL", "COD"].includes(paymentMethod)
      ) {
        whereFilter = {
          ...whereFilter,
          paymentMethod: paymentMethod,
        };
      }
      //minAmount & maxAmount filter..................................
      if (
        minAmount !== null &&
        minAmount !== undefined &&
        minAmount !== "" &&
        maxAmount !== null &&
        maxAmount !== undefined &&
        maxAmount !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          finalAmount: {
            gte: Number.parseFloat(minAmount),
            lte: Number.parseFloat(maxAmount),
          },
        };
      } else if (
        minAmount !== null &&
        minAmount !== undefined &&
        minAmount !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          finalAmount: { gte: Number.parseFloat(minAmount) },
        };
      } else if (
        maxAmount !== null &&
        maxAmount !== undefined &&
        maxAmount !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          finalAmount: { lte: Number.parseFloat(maxAmount) },
        };
      }

      //date filter..................................
      if (
        startDate !== null &&
        startDate !== undefined &&
        startDate !== "" &&
        endDate !== null &&
        endDate !== undefined &&
        endDate !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: getTodayUTCDate(startDate),
            lte: getEndOfDayUTCDate(endDate),
          },
        };
      } else if (
        startDate !== null &&
        startDate !== undefined &&
        startDate !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: new Date(startDate),
          },
        };
      } else if (endDate !== null && endDate !== undefined && endDate !== "") {
        whereFilter = {
          ...whereFilter,
          createdAt: {
            lte: new Date(endDate),
          },
        };
      }

      if (status !== null && status !== undefined && status !== "") {
        whereFilter = {
          ...whereFilter,
          status: status,
        };
      }

      const totalCount = await prisma.order.count({
        where: { ...whereFilter },
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const order = await prisma.order.findMany({
        where: whereFilter,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, phone: true },
          },
          address: true,
          orderItems: true,
          paymentHistory: true,
          OrderStatusHistory: true,
        },
      });
      return {
        order,
        pagination: {
          totalPages,
          currentPage,
          totalCount,
          limit,
        },
      };
    } catch (error) {
      console.log("error=", error);
      throw new Error(
        "Something went wrong while fetching the order. Please try again later."
      );
    }
  },

  async getOrderById(orderId) {
    try {
      if (!orderId) throw new Error("Order ID is required.");
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          customer: {
            select: { id: true, firstName: true, lastName: true, phone: true },
          },
          address: true,
          orderItems: true,
          returnRequest: true,
          giftCard:true,
          paymentHistory: true,
          OrderStatusHistory: true,
        },
      });
      if (!order) throw new Error("Order not found.");
      return order;
    } catch (error) {
      console.log("error=", error);
      throw new Error(
        "Something went wrong while fetching the order. Please try again later."
      );
    }
  },

  async getOrdersByCustomer(query, customerId) {
    const { search, status } = query;

    if (!customerId) throw new Error("Customer ID is required.");

    const whereClause = { customerId };

    if (search) {
      whereClause.OR = [
        { orderNumber: search },
        {
          orderItems: {
            some: {
              productName: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }
    if (status) whereClause.status = status;

    return await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        OrderStatusHistory: true,
        status: true,
        finalAmount: true,
    
        
        paymentStatus: true,
        createdAt: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        orderItems: {
          include: {
            ProductReview: {
              select: {
                rating: true,
                reviewTitle: true,
              },
            },
          },
        },
      },
    });
  },

  async updateOrderStatus(orderId, status) {
    try {
      if (!orderId || !status) {
        throw new Error("Order ID and new status are required.");
      }

      const order = await prisma.order.findFirst({
        where: { id: orderId },
        select: {
          customer: {
            select: {
              countryCode: true,
              phone: true,
            },
          },
          finalAmount: true,
          orderNumber: true,
        },
      });

      const existingHistory = await prisma.orderStatusHistory.findFirst({
        where: { orderId, status },
      });

      if (existingHistory) {
        await prisma.orderStatusHistory.update({
          where: { id: existingHistory.id },
          data: { updatedAt: new Date() },
        });
      } else {
        await prisma.orderStatusHistory.create({
          data: { orderId, status },
        });
      }

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: { status },
        select: { id: true, status: true },
      });

      // Map order status to SmsType
      const StatusToSmsTypeMap = {
        CONFIRMED: SmsTypes.ORDER_CONFIRM,
        SHIPPED: SmsTypes.ORDER_SHIPPED,
        DELIVERED: SmsTypes.ORDER_DELIVERED,
        CANCELLED: SmsTypes.ORDER_CANCELLED,
        RETURN_REQUESTED: SmsTypes.RETURN_REQUESTED,
        RETURN_APPROVED: SmsTypes.RETURN_APPROVED,
        RETURNED: SmsTypes.ORDER_RETURNED,
        REFUNDED: SmsTypes.ORDER_REFUNDED,
      };

      const smsType = StatusToSmsTypeMap[status];

      if (smsType && updated) {
        const smsData = {
          orderId: order?.orderNumber,
          ...(smsType === SmsTypes.ORDER_CONFIRM ||
            smsType === SmsTypes.ORDER_SHIPPED
            ? {
              trackingUrl: `${process.env.FRONTEND_URL}/track-order/${order?.orderNumber}`,
            }
            : {trackingUrl: `${process.env.FRONTEND_URL}/track-order/${order?.orderNumber}`,}),
          ...(smsType === SmsTypes.ORDER_REFUNDED
            ? { amount: order?.finalAmount }
            : {}),
        };

        await sendTwilioSMS(
          `${order?.customer?.countryCode}${order?.customer?.phone}`,
          smsType,
          smsData
        );
        
      }

      return updated;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  // async updateOrderStatus(orderId, status) {
  //   console.log("status=", status);
  //   try {
  //     if (!orderId || !status)
  //       throw new Error("Order ID and new status are required.");

  //     const order = await prisma.order.findFirst({
  //       where: { id: orderId },
  //       select: {
  //         customer: {
  //           select: {
  //             countryCode: true,
  //             phone: true,
  //           },
  //         },
  //         finalAmount: true,
  //         orderNumber: true,
  //       },
  //     });

  //     // if (order?.status !== status) {
  //     const existingHistory = await prisma.orderStatusHistory.findFirst({
  //       where: {
  //         orderId: orderId,
  //         status: status,
  //       },
  //     });

  //     console.log("existingHistory==", existingHistory);

  //     if (existingHistory) {
  //       await prisma.orderStatusHistory.update({
  //         where: {
  //           id: existingHistory.id,
  //         },
  //         data: {
  //           updatedAt: new Date(),
  //         },
  //       });
  //     } else {
  //       await prisma.orderStatusHistory.create({
  //         data: {
  //           orderId: orderId,
  //           status: status || "PENDING",
  //         },
  //       });
  //     }
  //     // }

  //     const updated = await prisma.order.update({
  //       where: { id: orderId },
  //       data: { status },
  //       select: { id: true, status: true },
  //     });

  //     if (status === "CONFIRMED" && updated) {
  //       await sendTwilioSMS(
  //         `${order?.customer?.countryCode}${order?.customer?.phone}`,
  //         SmsTypes.ORDER_CONFIRM,
  //         {
  //           orderId: order?.orderNumber,
  //           trackingUrl: `${process.env.FRONTEND_URL}/order/track/${order?.orderNumber}`,
  //         }
  //       );
  //     }
  //     if (status === "SHIPPED" && updated) {
  //       await sendTwilioSMS(
  //         `${order?.customer?.countryCode}${order?.customer?.phone}`,
  //         SmsTypes.ORDER_SHIPPED,
  //         {
  //           orderId: order?.orderNumber,
  //           trackingUrl: `${process.env.FRONTEND_URL}/order/track/${order?.orderNumber}`,
  //         }
  //       );
  //     }
  //     if (status === "DELIVERED" && updated) {
  //       await sendTwilioSMS(
  //         `${order?.customer?.countryCode}${order?.customer?.phone}`,
  //         SmsTypes.ORDER_DELIVERED,
  //         {
  //           orderId: order?.orderNumber,
  //         }
  //       );
  //     }
  //     if (status === "CANCELLED" && updated) {
  //       await sendTwilioSMS(
  //         `${order?.customer?.countryCode}${order?.customer?.phone}`,
  //         SmsTypes.ORDER_CANCELLED,
  //         {
  //           orderId: order?.orderNumber,
  //         }
  //       );
  //     }
  //     if (status === "RETURN_REQUESTED" && updated) {
  //       await sendTwilioSMS(
  //         `${order?.customer?.countryCode}${order?.customer?.phone}`,
  //         SmsTypes.RETURN_REQUESTED,
  //         {
  //           orderId: order?.orderNumber,
  //         }
  //       );
  //     }
  //     if (status === "RETURN_APPROVED" && updated) {
  //       await sendTwilioSMS(
  //         `${order?.customer?.countryCode}${order?.customer?.phone}`,
  //         SmsTypes.RETURN_APPROVED,
  //         {
  //           orderId: order?.orderNumber,
  //         }
  //       );
  //     }
  //     if (status === "RETURNED" && updated) {
  //       await sendTwilioSMS(
  //         `${order?.customer?.countryCode}${order?.customer?.phone}`,
  //         SmsTypes.ORDER_RETURNED,
  //         {
  //           orderId: order?.orderNumber,
  //         }
  //       );
  //     }
  //     if (status === "REFUNDED" && updated) {
  //       await sendTwilioSMS(
  //         `${order?.customer?.countryCode}${order?.customer?.phone}`,
  //         SmsTypes.ORDER_REFUNDED,
  //         {
  //           orderId: order?.orderNumber,
  //           amount: order?.finalAmount,
  //         }
  //       );
  //     }

  //     return updated;
  //   } catch (error) {
  //     throw new Error("Something went wrong " + error.message);
  //   }
  // },

  async addPayment(orderId, payment) {
    try {
      const {
        paymentMethod,
        totalAmountPrice,
        gatewayResponse = null,
        paidAt = new Date(),
        currency = "INR",
        refunded = false,
      } = payment;
      const transactionId = `TXN-${new Date().toISOString().replace(/[-:]/g, "").slice(0, 14)}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      if (!orderId) throw new Error("Order ID is required");
      if (!paymentMethod) throw new Error("Payment method is required");
      // if (!status) throw new Error("Payment status is required");

      const previousAttempts = await prisma.paymentHistory.count({
        where: { orderId },
      });

      const attemptNumber = previousAttempts + 1;

      const createdPayment = await prisma.paymentHistory.create({
        data: {
          orderId,
          paymentMethod,
          transactionId: transactionId,
          amountPaid: Number.parseFloat(totalAmountPrice),
          currency,
          // status,
          gatewayResponse,
          attemptNumber,
          refunded,
          paidAt,
        },
      });

      // if (status.toUpperCase() === "SUCCESS") {
      //   await prisma.order.update({
      //     where: { id: orderId },
      //     data: {
      //       isPaid: true,
      //       paymentStatus: "SUCCESS",
      //       paidAt,
      //       transactionId: transactionId || null,
      //     },
      //   });
      // }

      return createdPayment;
    } catch (error) {
      console.error("Payment error:", error);
      throw new Error(
        error.message || "Something went wrong while processing the payment."
      );
    }
  },

  async getPayments(orderId) {
    if (!orderId) throw new Error("Order ID is required.");
    return await prisma.paymentHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amountPaid: true,
        status: true,
        paidAt: true,
        refunded: true,
        attemptNumber: true,
        paymentMethod: true,
      },
    });
  },

  async trackCustomerOrder(orderNumber) {
    if (!orderNumber)
      throw new Error(
        "Please provide a valid order number to track your order."
      );

    const order = await prisma.order.findFirst({
      where: { orderNumber },
      include: {
        OrderStatusHistory: true,
        address: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });
    if (!order) {
      throw new Error(
        "We were unable to locate the order with the provided tracking number. Please verify the order number and try again."
      );
    }
    return order;
  },

  // cancel order........................................................
  async customerOrderCancel(orderId, cancelledReason) {
    try {
      if (!orderId) {
        throw new Error("Please provide a valid order ID.");
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
          customer: {
            select: {
              countryCode: true,
              phone: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error("Order not found.");
      }

      if (!["CONFIRMED", "PENDING"].includes(order.status)) {
        throw new Error("Only CONFIRMED or PENDING orders can be cancelled.");
      }

      const updatedOrder = await prisma.$transaction(async (tx) => {
        // 1. Cancel all order items & update stock & status history
        for (const item of order.orderItems) {
          await tx.orderItem.update({
            where: { id: item.id },
            data: {
              status: "CANCELLED",
              orderStatusHistory: {
                create: { status: "CANCELLED" },
              },
            },
          });

          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }

        // 2. Update the main order status & cancelled reason
        return await tx.order.update({
          where: { id: orderId },
          data: {
            status: "CANCELLED",
            cancelledReason: cancelledReason || "NO REASON PROVIDED",
          },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            finalAmount: true,
          },
        });
      });

      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
        },
      });

      await cancelOrderNotification(order.id)

      // 3. Send cancellation SMS
      await sendTwilioSMS(
        `${order.customer.countryCode}${order.customer.phone}`,
        SmsTypes.ORDER_CANCELLED,
        { orderId: updatedOrder.orderNumber }
      );

      return updatedOrder;
    } catch (error) {
      console.error("Cancel Order Error:", error);
      throw new Error("Something went wrong: " + error.message);
    }
  },

  // async cancelSingleOrderItem(orderItemId, cancelledReason) {
  //   try {

  //     console.log(orderItemId);

  //     const orderItem = await prisma.orderItem.findUnique({
  //       where: { id: orderItemId },
  //     });

  //     if (!orderItem) throw new Error("Order item not found.");
  //     // if (orderItem.status !== "PENDING" && orderItem.status !== "CONFIRMED") {
  //     //   throw new Error("Only PENDING or CONFIRMED items can be cancelled.");
  //     // }

  //     const [updatedOrderItem, revertStock, logStatus] = await prisma.$transaction([
  //       // 1. Update orderItem with cancellation
  //       prisma.orderItem.update({
  //         where: { id: orderItemId },
  //         data: {
  //           status: "CANCELLED",
  //           cancelledReason,
  //         },
  //       }),

  //       // 2. Revert product variant stock
  //       prisma.productVariant.update({
  //         where: { id: orderItem.productVariantId },
  //         data: {
  //           stock: {
  //             increment: orderItem.quantity,
  //           },
  //         },
  //       }),

  //       // 3. Log in OrderStatusHistory
  //       prisma.orderStatusHistory.create({
  //         data: {
  //           status: "CANCELLED",
  //           updatedAt: new Date(),
  //           OrderItem: {
  //             connect: { id: orderItemId }, // <-- Correct relation link
  //           },
  //           // Optional: if you also want to log order-level history
  //           // order: {
  //           //   connect: { id: orderId },
  //           // },
  //         },
  //       })

  //     ]);

  //     return updatedOrderItem;
  //   } catch (error) {
  //     console.error("error =", error);
  //     throw new Error("Something went wrong: " + error.message);
  //   }
  // },

  // async cancelledOrder(req, res) {
  //   const { orderId, cancelledReason } = req.body;

  //   try {
  //     const cancelledOrder = await prisma.$transaction(async (tx) => {
  //       // 1. Get the order
  //       const order = await tx.order.findUnique({
  //         where: { id: orderId },
  //         include: {
  //           items: true, // Assuming order has items array
  //         },
  //       });

  //       if (!order) {
  //         throw new Error("Order not found");
  //       }

  //       // 2. Loop through each item and update stock if order was CONFIRMED
  //       if (order.status === "CONFIRMED") {
  //         for (const item of order.items) {
  //           await tx.productVariant.update({
  //             where: { id: item.productVariantId },
  //             data: {
  //               stock: { increment: item.quantity },
  //             },
  //           });
  //         }
  //       }

  //       // 3. Update the order status to CANCELLED
  //       const updatedOrder = await tx.order.update({
  //         where: { id: orderId },
  //         data: {
  //           status: "CANCELLED",
  //           cancelledReason,
  //         },
  //       });

  //       return updatedOrder;
  //     });

  //     res.status(200).json({
  //       success: true,
  //       message: "Order cancelled successfully",
  //       data: cancelledOrder,
  //     });

  //   } catch (error) {
  //     console.error("Cancel order error:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Error cancelling order",
  //       error: error.message,
  //     });
  //   }
  // },

  //    Sales Report
  async getCompleteSalesReportByDate(query = {}) {
    const { startDate, endDate } = query;
    let startOfRange, endOfRange;

    // Handle single date request
    if (startDate && !endDate) {
      const baseDate = new Date(startDate);
      startOfRange = new Date(baseDate.setHours(0, 0, 0, 0));
      endOfRange = new Date(baseDate.setHours(23, 59, 59, 999));
    }
    // Handle date range request
    else if (startDate && endDate) {
      startOfRange = new Date(new Date(startDate).setHours(0, 0, 0, 0));
      endOfRange = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    } else {
      throw new Error("Either provide a single 'date' or both 'startDate' and 'endDate'");
    }

    // Validate
    if (isNaN(startOfRange.getTime()) || isNaN(endOfRange.getTime())) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD format");
    }

    // Fetch order items
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: startOfRange,
            lte: endOfRange,
          },
        },
      },
      include: {
        order: true,
      },
    });

    // Grouping logic
    const productMap = new Map();

    for (const item of orderItems) {
      const key = item.productName || "Unnamed Product";

      if (!productMap.has(key)) {
        productMap.set(key, {
          productName: key,
          imageUrl: item.imageUrl,
          totalQuantity: 0,
          totalOrders: 0,
          totalSalesAmount: 0,
          totalPaidAmount: 0,
          totalGST: 0,
          totalDiscount: 0,
          cancelledQuantity: 0,
          paidQuantity: 0,
          pendingQuantity: 0,
          statusBreakdown: {},
        });
      }

      const data = productMap.get(key);
      data.totalQuantity += item.quantity;
      data.totalOrders += 1;
      data.totalSalesAmount += item.total;
      data.totalDiscount +=
        (item.discountValue || 0) + (item.couponDiscountValue || 0);

      const orderStatus = item.order?.status || "UNKNOWN";
      const itemStatus = item.status || "UNKNOWN";
      const statusKey = `${orderStatus}_${itemStatus}`;
      data.statusBreakdown[statusKey] =
        (data.statusBreakdown[statusKey] || 0) + item.quantity;

      if (itemStatus === "CANCELLED") {
        data.cancelledQuantity += item.quantity;
      }
      if (item.order?.isPaid) {
        data.paidQuantity += item.quantity;
        data.totalPaidAmount += item.total;
      } else {
        data.pendingQuantity += item.quantity;
      }
    }

    return {
      dateRange: {
        startDate: startOfRange.toISOString().split("T")[0],
        endDate: endOfRange.toISOString().split("T")[0],
      },
      report: Array.from(productMap.values()),
    };
  },



  async getOrderReportByStatusFilter(query = {}) {
    try {

      const { startDate, endDate } = query;
      let startOfRange, endOfRange;

      // Handle single date request
      if (startDate && !endDate) {
        const baseDate = new Date(startDate);
        startOfRange = new Date(baseDate.setHours(0, 0, 0, 0));
        endOfRange = new Date(baseDate.setHours(23, 59, 59, 999));
      }
      // Handle date range request
      else if (startDate && endDate) {
        startOfRange = new Date(new Date(startDate).setHours(0, 0, 0, 0));
        endOfRange = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      } else {
        throw new Error(
          "Either provide a single 'date' or both 'startDate' and 'endDate'"
        );
      }

      // Validate dates
      if (isNaN(startOfRange.getTime()) || isNaN(endOfRange.getTime())) {
        throw new Error("Invalid date format. Please use YYYY-MM-DD format");
      }

      // First get total count of orders for the date range
      const totalCount = await prisma.order.count({
        where: {
          createdAt: {
            gte: startOfRange,
            lte: endOfRange,
          },
        },
      });

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startOfRange,
            lte: endOfRange,
          },
        },
        include: {
          orderItems: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const statusCount = {};
      const paymentStatusCount = {};
      const topProductMap = {};
      const paymentMethodStats = {};

      let totalItemsOrdered = 0;
      let totalAmount = 0;
      let gstCollected = 0;
      let discountGiven = 0;
      let refundAmount = 0;
      let usedCoupons = 0;
      let giftCardUsage = 0;

      let finalRevenueInInr = 0;
      let finalRevenueInUsd = 0;
      let fallbackRevenue = 0;
      let inrOrderCount = 0;
      let usdOrderCount = 0;

      for (const order of orders) {
        const status = order.status;
        statusCount[status] = (statusCount[status] || 0) + 1;

        const paymentStatus = order.paymentStatus;
        paymentStatusCount[paymentStatus] =
          (paymentStatusCount[paymentStatus] || 0) + 1;

        const method = order.paymentMethod || "UNKNOWN";
        if (!paymentMethodStats[method]) {
          paymentMethodStats[method] = { count: 0, amount: 0 };
        }
        paymentMethodStats[method].count += 1;
        paymentMethodStats[method].amount += order.finalAmount || 0;

        totalAmount += order.totalAmount || 0;
        gstCollected += order.gstAmount || 0;
        discountGiven += order.discountAmount || 0;
        refundAmount += order.refundAmount || 0;

        if (order.couponId) usedCoupons++;
        if (order.giftCardId) giftCardUsage++;

        if (order.orderCurrency === "INR") {
          finalRevenueInInr += order.finalAmountInInr || 0;
          inrOrderCount++;
        } else if (order.orderCurrency === "USD") {
          finalRevenueInUsd += order.finalAmountInUsd || 0;
          usdOrderCount++;
        } else {
          fallbackRevenue += order.finalAmount || 0;
        }

        for (const item of order.orderItems) {
          totalItemsOrdered += item.quantity || 0;
          const name = item.productName || "Unknown Product";
          topProductMap[name] = (topProductMap[name] || 0) + item.quantity;
        }
      }

      const topProducts = Object.entries(topProductMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([productName, quantity]) => ({ productName, quantity }));

      // Prepare response
      const response = {
        dateRange: {
          startDate: startOfRange.toISOString().split("T")[0],
          endDate: endOfRange.toISOString().split("T")[0],
        },
        totalOrders: totalCount,
        paginatedOrders: orders.length,
        totalItemsOrdered,
        orderStatusCount: statusCount,
        paymentStatusCount,
        totalAmount,
        discountGiven,
        refundAmount,
        usedCoupons,
        giftCardUsage,
        topProducts,
        paymentMethodStats,
        finalRevenueInInr,
        finalRevenueInUsd,
        fallbackRevenue,
        inrOrderCount,
        usdOrderCount,
      };

      // For single date requests, simplify the dateRange in response
      if (startDate && !endDate) {
        response.startDate = response.dateRange.startDate;
        delete response.dateRange;
      }

      return response;
    } catch (err) {
      console.error("Error generating order report:", err);
      throw new Error("Failed to generate order report: " + err.message);
    }
  },

  // expected delivery time
  async adminExpectedDeliveryTime(orderId, date) {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      throw Error("Order is Not Valid");
    }

    console.log(existingOrder.status);

    if (
      existingOrder.status == "PENDING" ||
      existingOrder.status == "CONFIRMED" ||
      existingOrder.status == "SHIPPED"
    ) {
      const result = prisma.order.update({
        where: { id: orderId },
        data: {
          expectedDeliveryDate: date,
        },
      });

      return result;
    } else {
      throw Error("Order Status is Not Valid");
    }
  },

  // Refund Order
  async adminrefundOrder({ orderId, refundAmount, reason }) {
    try {
      const order = await prisma.order.findUnique({ where: { id: orderId } });

      if (!order) throw new Error("Order not found");

      if (!order.isPaid || order.paymentStatus !== "SUCCESS")
        throw new Error("Only successfully paid orders can be refunded");

      if (refundAmount > order.finalAmount)
        throw new Error("Refund amount exceeds total paid amount");

      //  Call Razorpay refund API
      const refund = await refundRazorpayPayment({
        paymentId: order.paymentId,
        refundAmount,
        reason,
        orderNumber: order.orderNumber || order.id,
      });

      //  Prisma Transaction
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: {
            refundAmount: parseFloat(refundAmount),
            refundId: refund.id,
            refundReason: reason,
            status: "REFUNDED",
            paymentStatus: "REFUNDED",
            cancelledReason: reason,
            updatedAt: new Date(),
          },
        }),

        prisma.paymentHistory.updateMany({
          where: { orderId, refunded: false },
          data: {
            refunded: true,
            refundedAt: new Date(),
          },
        }),

        prisma.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: "REFUNDED",
          },
        }),
      ]);

      return {
        success: true,
        message: "✅ Refund processed successfully",
      };
    } catch (error) {
      console.error("Error in refundOrderStatus:", error);
      throw new Error(error.message || "Refund failed");
    }
  },

  // RETURN -MODULES:-
  //---- Customer Return Request
  async customerReturnRequest(orderId, reason, imagesUrls) {
    try {
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
        },
      });

      if (!existingOrder) {
        throw new Error("Order not found.");
      }

      if (existingOrder.status !== "DELIVERED") {
        throw new Error("Only Delivered orders can be return Requested.");
      }

      // if (!existingOrder.isPaid) {
      //   throw new Error("Only Successfully Paid Orders can be Requested.");
      // }

      if (existingOrder.status === "RETURN_APPROVED") {
        throw new Error("Order Return Request Already Approved");
      }

      if (existingOrder.status === "RETURN_REQUESTED") {
        throw new Error("Already Return Request");
      }

      const returnRequest = await prisma.returnRequest.create({
        data: {
          orderId: existingOrder.id,
          reason: reason || "No reason provided",
          photos: imagesUrls || [],
        },
      });

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "RETURN_REQUESTED",
        },
      });

      return returnRequest;
    } catch (error) {
      console.error("Error in customerRefundRequest:", error);
      throw new Error(error.message || "Failed to request refund");
    }
  },

  // --- Admin Return Status Change ---
  async adminReturnRequestStatus({ id, orderId }) {
    try {
      console.log("mis", id, orderId);

      if (!id) {
        throw new Error("Invalid input data");
      }

      // Update the return request
      const updatedReturnRequest = await prisma.returnRequest.update({
        where: { id },
        data: { isApproved: true },
      });

      const updateOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: "RETURN_APPROVED" },
      });

      return updatedReturnRequest;
    } catch (error) {
      throw new Error(
        error.message || "Failed to update return request status."
      );
    }
  },

  //  fetch admin all Return Request
  async fetchAdminAllReturnRequests(query) {
    const { isApproved, startDate, endDate } = query;

    try {
      let whereFilter = {};

      // ✅ Filter by isApproved
      if (
        isApproved !== null &&
        isApproved !== undefined &&
        isApproved !== ""
      ) {
        whereFilter.isApproved = isApproved === "true";
      }

      // ✅ Filter by date range
      if (startDate && endDate) {
        whereFilter.createdAt = {
          gte: getTodayUTCDate(startDate),
          lte: getEndOfDayUTCDate(endDate),
        };
      } else if (startDate) {
        whereFilter.createdAt = {
          gte: new Date(startDate),
        };
      } else if (endDate) {
        whereFilter.createdAt = {
          lte: new Date(endDate),
        };
      }

      // ✅ Count total matching requests
      const totalCount = await prisma.returnRequest.count({
        where: whereFilter,
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      // ✅ Fetch data with pagination and related order + customer
      const returnRequests = await prisma.returnRequest.findMany({
        where: whereFilter,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      return {
        returnRequests,
        pagination: {
          totalPages,
          currentPage,
          totalCount,
          limit,
        },
      };
    } catch (error) {
      console.error("Error fetching return requests:", error);
      throw new Error(
        "Something went wrong while fetching return requests. Please try again later."
      );
    }
  },
};

export default orderService;
