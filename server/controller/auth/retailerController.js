import {
  retailerLogin,
  retailerRegister,
} from "../../services/auth/retialerService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

export async function registerRetailer(request, response) {
  try {
    //check required fields
    const result = await retailerRegister(request.body);
    return response.status(201).json({
      message:
        "Retailer registered successfully and verification email also sent",
      data: result,
    });
  } catch (error) {
    console.error(`Error in Retailer Registration ${error}`);

    const prismaError = handlePrismaError(error);
    return response.json({
      statusCode: prismaError.statusCode,
      message: prismaError.message,
      code: prismaError.code,
    });
  }
}

export async function loginRetailer(request, response) {
  try {
    const user = await retailerLogin(request.body, request.session);
    response.status(200).json({ success: true, user });
  } catch (error) {
    console.error(`Error in Retailer Login ${error}`);

    const prismaError = handlePrismaError(error);
    return response.json({
      statusCode: prismaError.statusCode,
      message: prismaError.message,
      code: prismaError.code,
    });
  }
}

// export async function logoutRetailer(req, res) {
//   try {
//     if (!req.session) {
//       return res.status(500).json({ message: "Session not initialized" });
//     }

//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ message: "Error logging out" });
//       }
//       return res
//         .status(200)
//         .json({ message: "Retailer logged out successfully" });
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function getRetailerProfile(req, res) {
//   try {
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const retailerId = req.session.user.id;

//     const retailerProfile = await prisma.user.findUnique({
//       where: { id: retailerId },
//     });

//     if (!retailerProfile) {
//       return res.status(404).json({ message: "Retailer not found" });
//     }

//     return res.status(200).json({ data: retailerProfile });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }
// export async function updateRetailerProfile(req, res) {
//   try {
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const retailerId = req.session.user.id;
//     const { name, email, phone, businessName, businessAddress, gstNumber } =
//       req.body;

//     const updatedRetailer = await prisma.user.update({
//       where: { id: retailerId },
//       data: {
//         name,
//         email,
//         phone,
//         businessName,
//         businessAddress,
//         gstNumber,
//       },
//     });

//     return res.status(200).json({
//       message: "Retailer profile updated successfully",
//       data: updatedRetailer,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function deleteRetailerProfile(req, res) {
//   try {
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const retailerId = req.session.user.id;

//     await prisma.user.delete({
//       where: { id: retailerId },
//     });

//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ message: "Error logging out" });
//       }
//       return res.status(200).json({ message: "Retailer profile deleted" });
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }
// export async function verifyRetailerEmail(req, res) {
//   try {
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const retailerId = req.session.user.id;

//     const updatedRetailer = await prisma.user.update({
//       where: { id: retailerId },
//       data: { isVerifiedEmail: true },
//     });

//     return res.status(200).json({
//       message: "Retailer email verified successfully",
//       data: updatedRetailer,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function resendVerificationEmail(req, res) {
//   try {
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     req.session.user.id;

//     // Logic to resend verification email goes here
//     // For example, you can use a mail service to send the email

//     return res.status(200).json({
//       message: "Verification email resent successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }
// export async function updateRetailerPassword(req, res) {
//   try {
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const retailerId = req.session.user.id;
//     const { oldPassword, newPassword } = req.body;

//     const existingUser = await prisma.user.findUnique({
//       where: { id: retailerId },
//     });

//     if (!existingUser) {
//       return res.status(404).json({ message: "Retailer not found" });
//     }

//     const isOldPasswordValid = await bcrypt.compare(
//       oldPassword,
//       existingUser.password
//     );
//     if (!isOldPasswordValid) {
//       return res.status(401).json({ message: "Invalid old password" });
//     }

//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     const updatedRetailer = await prisma.user.update({
//       where: { id: retailerId },
//       data: { password: hashedNewPassword },
//     });

//     return res.status(200).json({
//       message: "Retailer password updated successfully",
//       data: updatedRetailer,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function resetRetailerPassword(req, res) {
//   try {
//     const { email, newPassword } = req.body;

//     if (!email || !newPassword) {
//       return res
//         .status(400)
//         .json({ message: "Provide all the required fields" });
//     }

//     const existingUser = await prisma.user.findFirst({
//       where: { email },
//     });

//     if (!existingUser) {
//       return res.status(404).json({ message: "Retailer not found" });
//     }

//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     const updatedRetailer = await prisma.user.update({
//       where: { email },
//       data: { password: hashedNewPassword },
//     });

//     return res.status(200).json({
//       message: "Retailer password reset successfully",
//       data: updatedRetailer,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function getAllRetailers(req, res) {
//   try {
//     const retailers = await prisma.user.findMany({
//       where: { role: "RETAILER" },
//     });

//     return res.status(200).json({ data: retailers });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function getRetailerById(req, res) {
//   try {
//     const retailerId = req.params.id;

//     const retailer = await prisma.user.findUnique({
//       where: { id: retailerId },
//     });

//     if (!retailer) {
//       return res.status(404).json({ message: "Retailer not found" });
//     }

//     return res.status(200).json({ data: retailer });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function updateRetailerById(req, res) {
//   try {
//     const retailerId = req.params.id;
//     const { name, email, phone, businessName, businessAddress, gstNumber } =
//       req.body;

//     const updatedRetailer = await prisma.user.update({
//       where: { id: retailerId },
//       data: {
//         name,
//         email,
//         phone,
//         businessName,
//         businessAddress,
//         gstNumber,
//       },
//     });

//     return res.status(200).json({
//       message: "Retailer updated successfully",
//       data: updatedRetailer,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function deleteRetailerById(req, res) {
//   try {
//     const retailerId = req.params.id;

//     await prisma.user.delete({
//       where: { id: retailerId },
//     });

//     return res.status(200).json({ message: "Retailer deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function verifyRetailerAccount(req, res) {
//   try {
//     const retailerId = req.params.id;

//     const updatedRetailer = await prisma.user.update({
//       where: { id: retailerId },
//       data: { isVerifiedEmail: true },
//     });

//     return res.status(200).json({
//       message: "Retailer account verified successfully",
//       data: updatedRetailer,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function deactivateRetailerAccount(req, res) {
//   try {
//     const retailerId = req.params.id;

//     const updatedRetailer = await prisma.user.update({
//       where: { id: retailerId },
//       data: { isActive: false },
//     });

//     return res.status(200).json({
//       message: "Retailer account deactivated successfully",
//       data: updatedRetailer,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function activateRetailerAccount(req, res) {
//   try {
//     const retailerId = req.params.id;

//     const updatedRetailer = await prisma.user.update({
//       where: { id: retailerId },
//       data: { isActive: true },
//     });

//     return res.status(200).json({
//       message: "Retailer account activated successfully",
//       data: updatedRetailer,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }

// export async function getRetailerOrders(req, res) {
//   try {
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const retailerId = req.session.user.id;

//     const orders = await prisma.order.findMany({
//       where: { retailerId },
//     });

//     return res.status(200).json({ data: orders });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }
// export async function getRetailerOrderById(req, res) {
//   try {
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const retailerId = req.session.user.id;
//     const orderId = req.params.id;

//     const order = await prisma.order.findUnique({
//       where: { id: orderId, retailerId },
//     });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     return res.status(200).json({ data: order });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }
// export async function createRetailerOrder(req, res) {
//   try {
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const retailerId = req.session.user.id;
//     const { items, totalAmount } = req.body;

//     const newOrder = await prisma.order.create({
//       data: {
//         retailerId,
//         items,
//         totalAmount,
//       },
//     });

//     return res.status(201).json({
//       message: "Order created successfully",
//       data: newOrder,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Database error" });
//   }
// }
