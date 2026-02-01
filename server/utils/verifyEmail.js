import prisma from "../config/prismaClient.js";

export async function verifyEmail(req, res) {
  const { token, role } = req.query;

  if (!token || !role) {
    return res
      .status(400)
      .json({ success: false, message: "Token and role are required" });
  }

  try {
    let user;

    // Check the role and query the appropriate table
    if (role === "RETAILER") {
      user = await prisma.retailer.findFirst({
        where: { verifyToken: token, verifyTokenExpiry: { gte: new Date() } },
      });
    } else if (role === "CUSTOMER") {
      user = await prisma.customer.findFirst({
        where: { verifyToken: token, verifyTokenExpiry: { gte: new Date() } },
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // Update the user's verification status
    if (role === "RETAILER") {
      await prisma.retailer.update({
        where: { id: user.id },
        data: {
          isVerifiedEmail: true,
          verifyToken: null,
          verifyTokenExpiry: null,
        },
      });
    } else if (role === "CUSTOMER") {
      await prisma.customer.update({
        where: { id: user.id },
        data: {
          isVerifiedEmail: true,
          verifyToken: null,
          verifyTokenExpiry: null,
        },
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// export async function resendVerificationEmail(req, res) {
//   const { email } = req.body;

//   const user = await prisma.retailer.findUnique({ where: { email } });
//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }

//   if (user.isVerifiedEmail) {
//     return res.status(400).json({ success: false, message: "Email is already verified" });
//   }

//   const token = uuidv4();
//   const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

//   await prisma.retailer.update({
//     where: { email },
//     data: { verifyToken: token, verifyTokenExpiry: expiry },
//   });

//   const verifyLink = `http://localhost:8000/auth/verifyemail/?token=${token}`;

//   await transporter.sendMail({
//     to: email,
//     subject: "Resend Email Verification",
//     html: `<p>Please verify your email by clicking <a href="${verifyLink}">here</a>.</p>`,
//   });

//   res.status(200).json({ success: true, message: "Verification email resent" });
// }
