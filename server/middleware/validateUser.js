import prisma from "../config/prismaClient.js";

export const validateUser = async (req, res, next) => {
  const { userId } = req.body; // Only userId is expected now

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  // First, check if the user is a CUSTOMER or RETAILER
  const customer = await prisma.customer.findUnique({ where: { id: userId } });
  if (customer) {
    req.userType = "CUSTOMER";  // Attach userType to the request
    req.user = customer; // Attach the customer data to the request if needed
    return next(); // Proceed to the next middleware or controller
  }

  const retailer = await prisma.retailer.findUnique({ where: { id: userId } });
  if (retailer) {
    req.userType = "RETAILER"; // Attach userType to the request
    req.user = retailer; // Attach the retailer data to the request if needed
    return next(); // Proceed to the next middleware or controller
  }

  // If no customer or retailer is found with the provided userId
  return res.status(400).json({ message: "Invalid userId" });
};
