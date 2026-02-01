import prisma from "../../config/prismaClient.js";
import calculateMakingCharge from "../../lib/calculateMakingCharges.js";
import getApplicableMakingCharge from "../../lib/getApplicableMakingCharge.js";

export async function getProductVariantsWithCharges() {
  const productVariants = await prisma.productVariant.findMany({
    include: {
      products: true,
    },
  });
  const result = [];

  for (const variant of productVariants) {
    const chargeRule = await getApplicableMakingCharge(variant);

    let makingCharge = 0;
    if (chargeRule) {
      makingCharge = calculateMakingCharge({
        productVariant: variant,
        globalMakingCharge: chargeRule,
      });
    }
    result.push({
      ...variant,
      makingCharge,
    });
  }

  return result;
}
