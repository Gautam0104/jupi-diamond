import prisma from "../config/prismaClient.js";

export async function authMiddleware(request, response, next) {
  const userId = request.session?.user?.id;
  const role = request.session?.user?.role;
  console.log("user=>", request.session?.user);
  try {
    if (!request.session || !userId) {
      //check if the session exists and contains userId
      return response.status(401).json({ message: "User not authenticated" });
    }

    //verify the user exists in the database and has valid role
    if (role !== "ADMIN" && role !== "CUSTOMER") {
      return response.status(403).json({ message: "Invalid user role" });
    }

    const user =
      (await prisma.customer.findUnique({
        where: { id: userId },
      })) ||
      (await prisma.admin.findUnique({
        where: { id: userId },
      }));

    if (!user) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    //attach user info to the request object (optional)
    request.user = user;

    //pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error in authMiddleware middleware:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}

export async function authorizeRole(roles) {
  return (req, res, next) => {
    const userRole = req.session?.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      console.log("Role check failed. User role:", userRole);
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };
}
