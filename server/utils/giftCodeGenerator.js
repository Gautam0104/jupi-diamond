export function generateGiftCardCode(customerName = "") {
  // Take first 3 letters of customer name (uppercase), fallback to 'GC'
  const prefix = customerName
    ? customerName.substring(0, 3).toUpperCase()
    : "GC";

  // Generate a random alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Combine and return (e.g., JOHN-ABC123)
  return `${prefix}-${randomPart}`;
}
