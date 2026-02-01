/* eslint-disable no-undef */

import { v4 as uuidv4 } from "uuid";
import transporter from "../../utils/nodeMailer.js";
import bcrypt from "bcryptjs";
import { adminLogout, userLogout } from "../../services/user/userService.js";
import prisma from "../../config/prismaClient.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

export async function sendForgotPassword(request, response) {
  const { identifier } = request.body;
  if (!identifier) {
    return response.status(400).json({
      success: false,
      message: "Identifier is required",
    });
  }
  try {
    // Find user by email or phone
    const user = await prisma.customer.findFirst({
      where: {
        OR: [{ email: identifier.toLowerCase() }, { phone: identifier }],
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user?.email) {
      return response.status(404).json({
        success: false,
        message: "User not found or email not available",
      });
    }

    // Generate reset token with 1 hour expiry
    const token = await bcrypt.hash(uuidv4(), 16);
    // Token expires after 1 hour (60 minutes * 60 seconds * 1000 milliseconds)
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.customer.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: tokenExpiry,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/customer/reset/password/?token=${token}&id=${user.id}`;

    // Send password reset email
    await transporter.sendMail({
      to: user.email,
      subject: "Reset Your Password",
      html: `
      <div>
        <h2>${process.env.GREET_MESSAGE}</h2>
      </div>
      <div style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; padding: 30px; max-width: 600px; margin: auto; border: 1px solid #ddd;">
        <h2 style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>You recently requested to reset your password. Click the button below to proceed. This link is valid for <strong>1 hour</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p style="margin-top: 40px;">Best regards,<br />Your Team</p>
      </div>
      `,
    });

    return response.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function resetPassword(req, res) {
  const { token, id, newPassword } = req.body;

  if (!token || !id || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token, user Id and new password are required" });
  }

  try {
    const user = await prisma.customer.findFirst({
      where: {
        resetToken: token,
        id: id,
        resetTokenExpiry: { gte: new Date() }, // Token still valid
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.customer.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(`Error in resetPassword API: ${error}`);
    const prismaError = handlePrismaError(error);
    return response.json({
      statusCode: prismaError.statusCode,
      message: prismaError.message,
      success: false,
      code: prismaError.code,
    });
  }
}

export async function logoutUser(req, res) {
  try {
    const result = await userLogout(req); // Pass the full req object
    res.status(result.status).json({
      message: result.message,
      role: result.role, // Include the role in the response
    });
  } catch (error) {
    console.error(`Error in Logout: ${error}`);
    const prismaError = handlePrismaError(error);
    return response.json({
      statusCode: prismaError.statusCode,
      message: prismaError.message,
      success: false,
      code: prismaError.code,
    });
  }
}

export async function logoutAdmin(req, res) {
  try {
    const result = await adminLogout(req); 
    res.status(result.status).json({
      message: result.message,
      role: result.role, 
    });
  } catch (error) {
    console.error(`Error in Logout: ${error}`);
    const prismaError = handlePrismaError(error);
    return response.json({
      statusCode: prismaError.statusCode,
      message: prismaError.message,
      success: false,
      code: prismaError.code,
    });
  }
}
