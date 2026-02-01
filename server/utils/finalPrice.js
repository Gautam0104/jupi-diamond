// utils/priceUtils.js
export function calculateFinalPrice(sellingPrice, coupon) {
  if (!coupon || !coupon.isActive) return sellingPrice;

  const now = new Date();
  if (coupon.validTo && new Date(coupon.validTo) < now) return sellingPrice;

  let finalPrice = sellingPrice;

  if (coupon.discountType === "PERCENTAGE") {
    finalPrice = sellingPrice - (sellingPrice * coupon.discountValue) / 100;
  } else if (coupon.discountType === "FIXED") {
    finalPrice = sellingPrice - coupon.discountValue;
  }
  return Math.max(0, Math.round(finalPrice)); // optional: round off and avoid negative price
}
