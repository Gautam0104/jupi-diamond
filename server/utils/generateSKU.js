export function generateSku(productSlug, metalLabel, gemstoneClarity, index) {
  const namePart = String(productSlug || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4); // 4 chars

  const metalPart = String(metalLabel || "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 3); // 3 chars

  const gemPart = String(gemstoneClarity || "NA")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 3); // 3 chars

  const randomIndex = Math.floor(Math.random() * 1000); // 0–999
  const indexPart = String(randomIndex).padStart(3, "0");

  return `${namePart}-${metalPart}-${gemPart}-${indexPart}`;
}
