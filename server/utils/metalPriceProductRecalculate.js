import calculateCharge from "./calculatingMakingPrice.js";

export function calculateProductPricing({
  metalPriceInGram = 0,
  metalWeightInGram = 0,
  gemstonePrice = 0,
  gemstoneWeightInCarat = 0,
  chargeRange = null,
  gst = 0,
}) {
  const metalCost = metalPriceInGram * metalWeightInGram;
  const gemstoneCost = gemstonePrice * gemstoneWeightInCarat;
  const base = metalCost + gemstoneCost;

  const makingCharge = chargeRange
    ? calculateCharge(base, {
        type: chargeRange.chargeType,
        chargeValue: chargeRange.chargeValue,
        discountType: chargeRange.discountType,
        discountValue: chargeRange.discountValue,
      })
    : 0;

  const sellingPrice = Math.round(base + makingCharge);
  const gstAmount = (sellingPrice * gst) / 100;
  const finalPrice = Math.round(sellingPrice + gstAmount);

  return {
    base,
    metalCost,
    gemstoneCost,
    makingCharge,
    sellingPrice,
    finalPrice,
    gstAmount,
  };
}
