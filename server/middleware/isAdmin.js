import prisma from "../config/prismaClient.js";

export async function isAdmin(request, response, next) {
  try {
    // Check if the session exists and contains adminId
    if (!request.session || !request.session.admin) {
      return response.status(401).json({ message: "Admin not authenticated" });
    }

    // Verify the admin exists in the database
    const admin = await prisma.admin.findUnique({
      where: { id: request.session.admin.id },
    });

    if (!admin) {
      return response.status(401).json({ message: "Admin not authenticated" });
    }

    // Attach admin info to the request object (optional)
    request.admin = admin;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}