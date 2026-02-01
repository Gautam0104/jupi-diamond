import xlsx from "xlsx";

export const parseExcelToProductPayload = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "", // ensures missing fields are not `undefined`
    raw: false, // parses numbers/strings reliably
  });

  const grouped = {};

  for (const row of sheetData) {
    const productKey = row["name"]?.trim();

    if (!productKey) continue;

    if (!grouped[productKey]) {
      grouped[productKey] = {
        name: productKey,
        description: row["description"]?.trim() || "",
        jewelryTypeSlug: row["jewelryTypeSlug"]?.trim(),
        // collectionSlug: row["collectionSlug"]?.trim(),
        collectionSlug:
          row["collectionSlug"]
            ?.trim()
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || [],
        productStyleSlug:
          row["productStyleSlug"]
            ?.trim()
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || [],
        occasionSlug:
          row["occasionSlug"]
            ?.trim()
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || [],
        // occasionSlug: row["occasionSlug"]?.trim() || null,
        tags:
          row["tags"]
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) || [],
        metaTitle: row["metaTitle"]?.trim() || "",
        metaDescription: row["metaDescription"]?.trim() || "",
        metaKeywords: row["metaKeywords"]?.trim() || "",
        // isFeatured: row["isFeatured"]?.toString().toLowerCase() === "true" || false,
        // isNewArrival: row["isNewArrival"]?.toString().toLowerCase() === "true" || false,
        // newArrivalUntil: newArrivalUntil,
        // images: row["images"]?.split(',').map(s => s.trim()).filter(Boolean) || [],
        productVariants: [],
      };
    }

    // Parse comma-separated sizes into array
    const productSizeSlug = row["productSizeSlug"]
      ? row["productSizeSlug"]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    grouped[productKey].productVariants.push({
      metalVariantSlug: row["metalVariantSlug"]?.trim() || null,
      metalColorSlug: row["metalColorSlug"]?.trim() || null,
      gemstoneVariantSlug: row["gemstoneVariantSlug"]?.trim() || null,
      globalMakingChargeSlug: row["globalMakingChargeSlug"]?.trim() || null,
      globalDiscountSlug: row["globalDiscountSlug"]?.trim() || null,
      metalWeightInGram: parseFloat(row["metalWeightInGram"]) || 0,
      diamondInWeightCarat: parseFloat(row["gemstoneWeightInCarat"]) || 0,
      numberOfDiamonds: parseInt(row["numberOfDiamonds"], 10) || 0,
      numberOfgemStones: parseInt(row["numberOfgemStones"], 10) || 0,
      numberOfSideDiamonds: parseInt(row["numberOfSideDiamonds"], 10) || 0,
      sideDiamondPriceCarat: parseFloat(row["sideDiamondPriceCarat"]) || 0,
      sideDiamondWeight: parseFloat(row["sideDiamondWeight"]) || 0,
      sideDiamondQuality: row["sideDiamondQuality"] || null,
      totalPriceSideDiamond: parseFloat(row["totalPriceSideDiamond"]) || 0,
      screwOption: row["screwOption"] ? JSON.parse(row["screwOption"]) : null,
      returnPolicyText: row["returnPolicyText"] || null,
      note: row["note"] || null,
      length: parseFloat(row["length"]) || null,
      width: parseFloat(row["width"]) || null,
      height: parseFloat(row["height"]) || null,
      gst: parseInt(row["gst"], 10) || null,
      productSizeSlug: productSizeSlug,
      stock: parseInt(row["stock"], 10) || 0,
      couponSlug: row["couponSlug"]?.trim() || null,
    });
  }

  return Object.values(grouped);
};
