/* eslint-disable no-undef */
import prisma from "../../config/prismaClient.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import transporter from "../../utils/nodeMailer.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import { paginate } from "../../utils/pagination.js";
import { sendTwilioSMS, SmsTypes } from "../../utils/twilioSendSMS.js";

export const registerCustomer = async (data, session) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      alternatePhone,
      dob,
      gender,
      password,
      profileImage,
      bio,
    } = data;

    // ✅ Validation
    if (!firstName) throw { status: 400, message: "First name is required" };
    if (!lastName) throw { status: 400, message: "Last name is required" };
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw { status: 400, message: "Please provide a valid email address" };
    }
    if (!phone || !phone.match(/^\+?[1-9]\d{9,}$/)) {
      throw { status: 400, message: "Please provide a valid phone number" };
    }
    if (!countryCode) {
      throw { status: 400, message: "Country code is required" };
    }
    if (!password) throw { status: 400, message: "Password is required" };
    if (password.length < 6) {
      throw {
        status: 400,
        message: "Password must be at least 6 characters long",
      };
    }
    if (!/[A-Z]/.test(password)) {
      throw {
        status: 400,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!/[a-z]/.test(password)) {
      throw {
        status: 400,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!/[0-9]/.test(password)) {
      throw {
        status: 400,
        message: "Password must contain at least one number",
      };
    }
    if (!/[!@#$%^&*]/.test(password)) {
      throw {
        status: 400,
        message:
          "Password must contain at least one special character (!@#$%^&*)",
      };
    }

    // ✅ Check if customer exists
    const existingUser = await prisma.customer.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existingUser)
      throw {
        statusCode: 409,
        message: "A user with this email or phone number already exists",
      };
    const [hashedPassword, token] = await Promise.all([
      bcrypt.hash(String(password), 10),
      bcrypt.hash(uuidv4(), 16),
    ]);

    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    // ✅ Create customer
    const newUser = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        countryCode,
        phone,
        alternatePhone,
        dob,
        gender,
        password: hashedPassword,
        profileImage,
        bio,
        verifyToken: token,
        verifyTokenExpiry: expiry,
      },
    });

    // ✅ Store in session
    if (!session) throw { status: 500, message: "Session not initialized" };
    session.newUser = {
      id: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };

    // if (newUser) {
    //   sendTwilioSMS(`${countryCode}${phone}`, SmsTypes.WELCOME, {
    //     name: `${firstName} ${lastName}`,
    //   });
    // }

    // ✅ Fire-and-forget email sending
    const verifyLink = `${process.env.FRONTEND_URL}/auth/verifyemail?token=${token}&role=${newUser.role}`;

    transporter
      .sendMail({
        to: email,
        subject: "Verify Your Email",
        html: `
        <div>
          <h2>${process.env.GREET_MESSAGE || "Welcome to Our Platform"}</h2>
        </div>
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; color: #000; background-color: #fff; padding: 40px 30px; border: 1px solid #ddd;">
          <h2 style="text-align: center; font-size: 22px; margin-bottom: 25px; border-bottom: 1px solid #000; padding-bottom: 10px;">Email Verification</h2>
          <p style="font-size: 16px;">Hello ${firstName},</p>
          <p style="font-size: 16px;">Click below to verify your email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="font-size: 14px; color: #444;">If you didn’t create this account, you can ignore this email.</p>
          <p style="margin-top: 40px; font-size: 14px;">– The Team</p>
        </div>
      `,
      })
      .catch((err) => console.error("Email send failed:", err));

    if (newUser) {
      const verificationMessage = `Please verify your account by visiting: ${verifyLink}`;

      await sendTwilioSMS(`${countryCode}${phone}`, SmsTypes.VERIFICATION, {
        verifyLink: verifyLink,
      });
    }

    return newUser;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

//fetch by customer
export const getCustomer = async (customerId) => {
  try {
    if (!customerId) {
      throw { message: "Unauthorized - Please login to continue" };
    }

    const customer = await prisma.customer.findFirst({
      where: { id: customerId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        countryCode: true,
        phone: true,
        alternatePhone: true,
        bio: true,
        gender: true,
        status: true,
        dob: true,
        email: true,
        profileImage: true,
      },
    });
    if (!customer) {
      throw { status: 404, message: "Customer not found" };
    }
    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};
//fetch all customer
export const getAllCustomer = async (query) => {
  const { search, startDate, endDate, sortBy, sortOrder, status, role } = query;
  try {
    let whereFilter = {};
    if (search !== null && search !== undefined && search !== "") {
      whereFilter = {
        ...whereFilter,
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    //filter by status.......................................................
    if (status !== null && status !== undefined && status !== "") {
      whereFilter = { ...whereFilter, status: status };
    }

    //role wise filter.......................................................
    if (role !== null && role !== undefined && role !== "") {
      whereFilter = { ...whereFilter, role: role };
    }

    //filter by date.......................................................
    if (
      startDate !== undefined &&
      startDate !== "" &&
      endDate !== undefined &&
      endDate !== ""
    ) {
      whereFilter = {
        ...whereFilter,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    } else if (startDate !== undefined && startDate !== "") {
      whereFilter = {
        ...whereFilter,
        createdAt: { gte: new Date(startDate) },
      };
    } else if (endDate !== undefined && endDate !== "") {
      whereFilter = {
        ...whereFilter,
        createdAt: { lte: new Date(endDate) },
      };
    }

    //sortBy.............................................
    let orderBy = {};
    if (sortBy && sortOrder) {
      orderBy[sortBy] = sortOrder;
    }

    const totalCount = await prisma.customer.count({
      where: whereFilter,
    });

    const { page, limit, skip, totalPages, currentPage } = paginate(
      query,
      totalCount
    );

    const customer = await prisma.customer.findMany({
      where: whereFilter,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        alternatePhone: true,
        bio: true,
        gender: true,
        status: true,
        dob: true,
        email: true,
        role: true,
        profileImage: true,
        address: true,
      },
    });
    if (!customer) {
      throw { status: 404, message: "Customer not found" };
    }
    return {
      customer,
      pagination: { page, limit, skip, totalPages, currentPage, totalCount },
    };
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

export const loginCustomer = async (data, session) => {
  try {
    let { email, password } = data;

    // ✅ Normalize and trim input
    email = email?.trim().toLowerCase();

    if (!email) {
      throw { status: 400, message: "Provide either email or phone number" };
    }
    if (!password) {
      throw { status: 400, message: "Password is required" };
    }

    // ✅ Find user by email or phone
    const user = await prisma.customer.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone: email }],
      },
    });

    if (!user) {
      throw { status: 401, message: "Invalid credentials" }; // Changed to 401 Unauthorized
    }

    if (!user.isVerifiedEmail) {
  throw { status: 403, message: "Please verify your email before logging in" };
}

    // ✅ Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { status: 401, message: "Invalid credentials" }; // Changed to 401 Unauthorized
    }

    // ✅ Initialize session
    if (!session) {
      throw { status: 500, message: "Session not initialized" };
    }

    session.user = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    return {
      status: 200, // Added explicit success status
      message: "User logged in successfully",
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    if (error.code) throw handlePrismaError(error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Unexpected server error",
    };
  }
};

export const checkCustomerSession = async (customerId) => {
  try {
    if (!customerId) {
      throw {
        message: "User is not authenticated",
        isAuthenticated: false,
      };
    }

    const user = await prisma.customer.findFirst({
      where: {
        id: customerId,
      },
    });

    if (!user) {
      throw {
        message: "User not found",
        isAuthenticated: false,
      };
    }

    return {
      message: "User is authenticated",
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      isAuthenticated: true,
    };
  } catch (error) {
    throw error;
  }
};

export const updateCustomer = async (customerId, data) => {
  try {
    const {
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      alternatePhone,
      gender,
      dob,
      profileImage,
      bio,
    } = data;

    // ✅ Step 1: Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      throw { status: 404, message: "Customer not found" };
    }

    // ✅ Step 2: Validate input
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw { status: 400, message: "Invalid email format" };
    }

    if (phone && !/^\+?[1-9]\d{9,14}$/.test(phone)) {
      throw { status: 400, message: "Invalid phone number format" };
    }
    if (!countryCode) {
      throw { status: 400, message: "Country code is required!" };
    }

    // ✅ Step 3: Build normalized update payload
    const updatedData = {
      ...(firstName && { firstName: firstName.trim() }),
      ...(lastName && { lastName: lastName.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(phone && { phone: phone.trim() }),
      ...(alternatePhone && { alternatePhone: alternatePhone.trim() }),
      ...(gender && { gender }),
      ...(dob && { dob: new Date(dob) }),
      ...(profileImage && { profileImage }),
      ...(bio && { bio: bio.trim() }),
      ...(countryCode && { countryCode: countryCode.trim() }),
    };

    // ✅ Step 4: Prevent restricted fields from being updated
    const forbiddenFields = [
      "password",
      "verifyToken",
      "verifyTokenExpiry",
      "resetToken",
      "resetTokenExpiry",
      "role",
      "status",
      "isVerifiedEmail",
      "createdAt",
      "updatedAt",
      "Session",
      "Cart",
      "Order",
      "address",
      "id",
    ];

    for (const key of Object.keys(data)) {
      if (forbiddenFields.includes(key)) {
        throw { status: 403, message: `Field '${key}' cannot be updated` };
      }
    }

    // ✅ Step 5: Perform the update
    const updatedUser = await prisma.customer.update({
      where: { id: customerId },
      data: updatedData,
    });

    // ✅ Step 6: Return safe updated response
    return {
      message: "Customer profile updated successfully",
      data: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        countryCode: updatedUser.countryCode,
        phone: updatedUser.phone,
        alternatePhone: updatedUser.alternatePhone,
        gender: updatedUser.gender,
        dob: updatedUser.dob,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        role: updatedUser.role,
        status: updatedUser.status,
        updatedAt: updatedUser.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    if (!customerId) {
      throw { status: 401, message: "Unauthorized - Please login to continue" };
    }

    // First check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      throw { status: 404, message: "Customer not found" };
    }

    // Alternatively, for hard delete:
    const deletedCustomer = await prisma.customer.delete({
      where: { id: customerId },
    });

    return deletedCustomer;
  } catch (error) {
    console.error("Error deleting customer:", error);
    if (error.code) throw handlePrismaError(error);
    throw {
      status: error.status || 500,
      message: error.message || "Unexpected error during account deletion",
    };
  }
};
