import prisma from "../config/prismaClient.js";
import convertCurrency from "./currency.js";

export async function calculateOrderPricing(
  orderItems,
  couponId = null,
  currency,
  giftCardId = null,
  customerId
) {


  let totalAmountPrice = 0;
  let gstAmountPrice = 0;
  let discountAmountPrice = 0;

  const itemDetails = await Promise.all(
    orderItems.map(async (item) => {
      const productVariant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
        include: {
          GlobalDiscount: true,
        },
      });

      if (!productVariant) {
        throw new Error("Invalid product variant ID: " + item.productVariantId);
      }

      const quantity = parseInt(item.quantity) || 1;
      const finalPrice = parseFloat(productVariant.finalPrice);

      const gst = parseFloat(productVariant.gst) || 0;
      const discount =
        parseFloat(productVariant?.GlobalDiscount?.discountValue) || 0;
  
      const itemSubtotal = finalPrice * quantity;
      const itemGst = gst * quantity;
      const itemDiscount = discount * quantity;

      totalAmountPrice += itemSubtotal;
      gstAmountPrice += itemGst;
      discountAmountPrice += itemDiscount;

      return {
        productVariantId: item.productVariantId,
        quantity,
        priceAtPurchase: finalPrice,
        gst,
        discountValue: discount,
        total: itemSubtotal,
      };
    })
  );


  console.log("coupin card id is",couponId);
  

  // Optional: Apply coupon
  if (couponId) {
    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    
    if (
      coupon &&
      coupon.isActive &&
      (!coupon.validFrom || new Date() >= coupon.validFrom) &&
      (!coupon.validTo || new Date() <= coupon.validTo) &&
      (!coupon.minCartValue || totalAmountPrice >= coupon.minCartValue)
    )
  
     
    {
      if (coupon.discountType === "PERCENTAGE") {
        discountAmountPrice += (totalAmountPrice * coupon.discountValue) / 100;
      } else if (coupon.discountType === "FIXED") {
        discountAmountPrice += coupon.discountValue;
      }
    }
  }

  if (giftCardId) {
    const giftCard = await prisma.giftCard.findUnique({ where: { id: giftCardId } })

   
    
  
    if (giftCard &&
      !giftCard.isRedeemed &&
      (!giftCard.expiresAt || giftCard.expiresAt > new Date()) &&
      giftCard.assignedToId === customerId) {

      discountAmountPrice += giftCard.value;
    }

  }

  
  

  const finalAmountPrice =
    totalAmountPrice  - discountAmountPrice;


  const convertedAmt = await convertCurrency(finalAmountPrice, "INR", currency);


  return {
    itemDetails,
    totalAmountPrice: convertedAmt,
    gstAmountPrice,
    discountAmountPrice,
    // finalAmountPrice,
  };
}
