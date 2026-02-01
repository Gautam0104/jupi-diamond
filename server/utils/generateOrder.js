export const generateReadableOrderNumber = () => {
  const datePart = new Date().getTime().toString().slice(-8);
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase(); // 5-char alphanumeric
  return `ORD-${datePart}-${randomPart}`;
};
