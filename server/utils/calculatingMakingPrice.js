function calculateCharge(baseAmount, charge = {}) {
  // Default configuration
  const type = (charge.type || "FIXED").toUpperCase();
  const chargeValue = Number(charge.chargeValue || 0);
  const discountType = (charge.discountType || "").toUpperCase();
  const discountValue = Number(charge.discountValue || 0);
  console.log("charge=", charge);
  // Validate type
  const validTypes = ["FIXED", "PERCENTAGE", "PER_GRAM_WEIGHT"];
  const chargeType = validTypes.includes(type) ? type : "FIXED";

  let makingCharge = 0;

  //Here calculate making charge Fixed/Percentage
  if (chargeType === "FIXED") {
    makingCharge = chargeValue;
  } else if (chargeType === "PERCENTAGE") {
    makingCharge = (baseAmount * chargeValue) / 100;
  } else if (chargeType === "PER_GRAM_WEIGHT") {
    makingCharge = Number.parseFloat(charge.metalWeight) * chargeValue; // Assume baseAmount is total weight
  }

  // Apply discount only if making charge is calculated
  if (makingCharge > 0) {
    if (discountType === "PERCENTAGE") {
      makingCharge -= (makingCharge * discountValue) / 100;
    } else if (discountType === "FIXED") {
      makingCharge -= discountValue;
    }
  }

  // Final charge should not be negative
  return Math.max(makingCharge, 0);
}

export default calculateCharge;
