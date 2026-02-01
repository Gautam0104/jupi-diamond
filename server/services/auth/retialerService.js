/* eslint-disable no-undef */
import bcrypt from "bcryptjs";
import prisma from "../../config/prismaClient.js";
import { v4 as uuidv4 } from "uuid";
import transporter from "../../utils/nodeMailer.js";

export async function retailerRegister(data) {
  const {
    name,
    email,
    phone,
    password,
    businessName,
    businessAddress,
    gstNumber,
    verificationDocs,
    role,
  } = data;
  if (
    !name ||
    !email ||
    !phone ||
    !password ||
    !businessName ||
    !businessAddress ||
    !verificationDocs ||
    !gstNumber ||
    !role
  ) {
    throw new Error({
      status: 400,
      message: "Please provide all required Fields",
    });
  }

  const existingUser = await prisma.retailer.findFirst({
    where: {
      OR: [{ phone }, { email }, { gstNumber }],
    },
  });

  if (existingUser) {
    throw {
      status: 409,
      message: "Retailer already exist! Please try agian with another account",
    };
  }

  //hashing the password entered by the retailer
  const hashedPassword = await bcrypt.hash(password, 10);
  const token = uuidv4();
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 ho

  console.log("Verification Token:", token);
  console.log("Verification Expiry:", expiry);

  const newRetailer = await prisma.retailer.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      businessAddress,
      businessName,
      verificationDocs,
      gstNumber,
      verifyToken: token,
      verifyTokenExpiry: expiry,
      role: "RETAILER",
    },
  });

  const verifyLink = `http://localhost:8000/auth/verifyemail/?token=${token}&role=RETAILER`;

  console.log("Verification Link:", verifyLink);

  await transporter.sendMail({
    to: email,
    subject: "Please Verify Your Email",
    html: `
     <div>
      <h2>${process.env.GREET_MESSAGE}</h2>
      </div>
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; background-color: #ffffff; color: #000000; padding: 40px 30px; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="text-align: center; font-size: 22px; margin-bottom: 30px; border-bottom: 1px solid #000; padding-bottom: 10px;">
          Verify Your Email Address
        </h2>
  
        <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
  
        <p style="font-size: 16px; line-height: 1.6;">
          We're excited to have you on board! To get started, please verify your email address by clicking the button below.
        </p>
  
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
  
        <p style="font-size: 14px; color: #333;">
          If you didn’t sign up for this account, you can safely ignore this email.
        </p>
  
        <p style="margin-top: 40px; font-size: 14px;">
          Best regards,<br>
          <strong>Your Team</strong>
        </p>
      </div>
    `,
  });

  return newRetailer;
}

export async function retailerLogin(data, session) {
  const { email, phone, password } = data;
  if (!email || !phone || !password) {
    throw { status: 400, message: "Please provide all the required Fields" };
  }
  const user = await prisma.retailer.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  console.log("existingUser", user);

  if (!user) {
    throw {
      status: 404,
      message: "Retailer not found! Please try again with another account",
    };
  }

  if (!user.isActive) {
    throw { status: 403, message: "Account is deactivated" };
  }

  if (user.role !== "RETAILER") {
    throw {
      status: 403,
      message: "You are not authorized to login as a Retailer",
    };
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) throw { status: 401, message: "Invalid Password" };

  if (!user.isVerifiedEmail) {
    throw { status: 401, message: "Please verify your email to login" };
  }

  if (!user.isActive) {
    throw { status: 403, message: "Your account is deactivated" };
  }

  if (!session) {
    console.log("Session not found");
    throw { status: 404, message: "Session not found" };
  }
  console.log("Session before setting:", session);
  console.log("session.existingUser before setting:", session.user);

  session.user = {
    id: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  return user;
}
