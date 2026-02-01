import prisma from "../../config/prismaClient.js";

const userAddressService = {
  async getUserAddress(customerId) {
    try {
      console.log("address=", customerId);
      //if customer id not found
      if (!customerId) {
        throw {
          statusCode: 401,
          message: "Unauthorized - Please login to continue",
        };
      }
      const address = await prisma.address.findMany({
        where: { customerId },
      });
      if (!address) {
        throw new Error("Address not found");
      }
      return address;
    } catch (error) {
      throw error;
    }
  },
  async addAddress({
    customerId,
    houseNo,
    landMark,
    street,
    city,
    state,
    country,
    postalCode,
    isBilling = false,
    panNumber,
    gstNumber,
    addressType,
    phone = null,
  }) {
    // Validate all required fields in one check
    const requiredFields = {
      customerId,
      houseNo,
      landMark,
      street,
      city,
      state,
      country,
      postalCode,
      addressType,
    };
    if (Object.values(requiredFields).some((field) => !field)) {
      throw new Error("All fields are required");
    }

    // Check customer and address existence in parallel
    const [customer, findAddress] = await Promise.all([
      prisma.customer.findUnique({
        where: { id: customerId },
      }),
      prisma.address.findFirst({
        where: { customerId, street, city, state, country, postalCode },
      }),
    ]);

    if (!customer) throw new Error("Customer not found");

    if (findAddress) {
      throw {
        statusCode: 409,
        message: "This Address already exists!",
      };
    }

    return prisma.address.create({
      data: {
        customerId,
        houseNo,
        landMark,
        street,
        city,
        state,
        country,
        postalCode,
        isBilling,
        addressType,
        panNumber,
        gstNumber,
        phone,
      },
    });
  },

  async getUserAddressById(id, customerId) {
    try {
      if (!id) {
        throw new Error("Id is required");
      }

      const address = await prisma.address.findUnique({
        where: { id, customerId },
      });

      if (!address) {
        throw new Error("Address not found");
      }

      return {
        success: true,
        status: 200,
        message: "User address fetched successfully",
        data: address,
      };
    } catch (error) {
      throw error;
    }
  },

  async deleteUserAddress(id, customerId) {
    if (!customerId) {
      throw {
        statusCode: 401,
        message: "Unauthorized - Please login to continue",
      };
    }
    if (!id) {
      throw new Error("Id is required");
    }

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    const result = await prisma.address.delete({
      where: { id },
    });
    return result;
  },
  async updateUserAddress({
    id,
    customerId,
    houseNo,
    landMark,
    state,
    street,
    city,
    country,
    postalCode,
    panNumber,
    gstNumber,
    addressType,
  }) {
    try {
      if (!customerId) {
        throw {
          statusCode: 401,
          message: "Unauthorized - Please login to continue",
        };
      }

      if (
        !id ||
        !houseNo ||
        !landMark ||
        !street ||
        !city ||
        !state ||
        !country ||
        !postalCode
      ) {
        throw new Error("All fields are required");
      }

      const existing = await prisma.address.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new Error("Address not found");
      }

      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        throw new Error("Customer not found");
      }

      const address = await prisma.address.update({
        where: { id },
        data: {
          customerId,
          houseNo,
          landMark,
          state,
          street,
          city,
          country,
          postalCode,
          panNumber,
          gstNumber,
          addressType,
        },
      });

      return address;
    } catch (error) {
      throw error;
    }
  },
};

export default userAddressService;
