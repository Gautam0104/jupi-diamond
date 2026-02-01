// src/utils/sizeUtils.js

/**
 * Formats a size unit into its display symbol.
 * @param {string} unit - The unit to format (e.g., "MM", "CM", "US", "INCH").
 * @returns {string} - The formatted unit symbol (e.g., "mm", "cm", "US", `"`).
 */
export const formatSizeUnit = (unit) => {
  if (!unit) return "";

  switch (unit.toUpperCase()) {
    case "MM":
      return "mm";
    case "CM":
      return "cm";
    case "US":
      return "US";
    case "INCH":
      return '"';
    default:
      return unit;
  }
};