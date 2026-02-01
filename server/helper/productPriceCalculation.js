import calculateCharge from "../utils/calculatingMakingPrice.js";

export const calculateFinalProductCost = (
  variant,
  metalVariant,
  gemstoneVariant,
  chargeRange
) => {
  // console.log("variant=>", variant);
  // --- Step 1: Individual Cost Calculations ---
  const metalWeight = parseFloat(variant.metalWeightInGram) || 0;
  const gemstoneCarat = parseFloat(variant.gemstoneWeightInCarat) || 0;
  const sideDiamondCarat = parseFloat(variant.sideDiamondWeight) || 0;

  const metalRate = metalVariant?.metalPriceInGram || 0;
  const gemstoneRate = gemstoneVariant?.gemstonePrice || 0;
  const sideDiamondRate = parseInt(variant.sideDiamondPriceCarat) || 0;

  const metalCost = metalWeight * metalRate;
  const gemstoneCost = gemstoneCarat * gemstoneRate;
  const sideDiamondCost = sideDiamondCarat * sideDiamondRate;

  const base = metalCost + gemstoneCost + sideDiamondCost;

  // --- Step 2: Gross Weight Calculation ---
  const gemstoneWeight = gemstoneCarat * 0.2; // carat to gram
  const sideDiamondWeight = sideDiamondCarat * 0.2; // carat to gram

  const grossWeight = metalWeight + gemstoneWeight + sideDiamondWeight;

  // --- Step 3: Making Charge ---
  const makingCharge = calculateCharge(base, {
    type: chargeRange?.chargeType,
    chargeValue: chargeRange?.chargeValue,
    discountType: chargeRange?.discountType,
    discountValue: chargeRange?.discountValue,
    metalWeight: metalWeight,
  });

  // --- Step 4: Final Before GST ---
  let final = base + makingCharge;

  // --- Step 5: GST Calculation ---
  const gstPercentage = parseInt(variant.gst) || 0;
  const gstAmount = (final * gstPercentage) / 100;
  const finalWithGst = final + gstAmount;

  // --- Return Full Breakdown ---
  return {
    metalCost,
    gemstoneCost,
    sideDiamondCost,
    base,
    makingCharge,
    gstAmount: Math.round(gstAmount),
    final: Math.round(final),
    finalWithGst: Math.round(finalWithGst),
    metalWeight,
    gemstoneWeight,
    sideDiamondWeight,
    grossWeight: parseFloat(grossWeight.toFixed(2)),
  };
};
