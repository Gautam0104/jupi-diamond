import bcrypt from "bcryptjs";
import prisma from "../../config/prismaClient.js";
import { paginate } from "../../utils/pagination.js";
import { getEndOfDayUTCDate, getTodayUTCDate } from "../../utils/dateUtil.js";

const adminService = {
  async adminRegisteration(data) {
    const { name, email, password, roleId } = data;

    if (!name || !email || !password) {
      throw { status: 400, message: "Provide all the required fields" };
    }

    try {
      const existingAdmin = await prisma.admin.findFirst({
        where: {
          email,
        },
      });

      if (existingAdmin) {
        throw { status: 409, message: "Admin already exists" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await prisma.admin.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: {
            connect: {
              id: roleId,
            },
          },
        },
      });

      return newAdmin;
    } catch (error) {
      console.error("Error in adminRegisteration:", error);
      if (error.code === "P2002") {
        throw { status: 409, message: "Email already in use" }; // Prisma unique constraint error
      }
      throw { status: 500, message: "Database error" };
    }
  },

  async fetchDashboardCount(query) {
    try {
      const { search, date, startDate, endDate } = query;
      console.log(
        "search=",
        search,
        "date=",
        date,
        "startDate=",
        startDate,
        "endDate=",
        endDate
      );

      const startDates = startDate ? getTodayUTCDate(startDate) : null;
      const endDates = endDate
        ? getEndOfDayUTCDate(endDate)
        : startDate
          ? getEndOfDayUTCDate(startDate)
          : null;
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1); // Start of 12 months ago

      let whereFilter = {
        // role: {
        //   NOT: {
        //     name: {
        //       equals: "admin",
        //     },
        //   },
        // },
      };

      //date wise filter - for specific date only
      if (
        startDates !== null &&
        startDates !== undefined &&
        startDates !== ""
      ) {
        console.log("date=", startDates, endDates);

        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: startDates,
            lte: endDates || startDates,
          },
        };
      }

      if (search?.trim()) {
        whereFilter = {
          ...whereFilter,
          OR: [{ purityLabel: { contains: search, mode: "insensitive" } }],
        };
      }

      const [
        earningData,
        orderItemCount,
        orderStatusCounts,
        customerCount,
        productCount,
        recentOrders,
        lowStockProducts,
        monthlyOrders,
        topCategory,
        mostWishlistedProducts,
        bestSellingProducts,
      ] = await Promise.all([
        prisma.order.aggregate({
          _sum: {
            finalAmount: true,
          },
          where: {
            ...whereFilter,
            isPaid: true,
          },
        }),
        prisma.orderItem.count({ where: whereFilter }),
        prisma.order.groupBy({
          by: ["status"],
          _count: true,
          where: {
            ...whereFilter,
            AND: [
              {
                status: {
                  in: [
                    "PENDING",
                    "CONFIRMED",
                    "DELIVERED",
                    "CANCELLED",
                    "SHIPPED",
                    "REFUNDED",
                  ],
                },
              },
              {
                isPaid: true,
              },
            ],
          },
        }),
        prisma.customer.count({
          where: whereFilter,
        }),
        prisma.productVariant.count({
          where: whereFilter,
        }),
        prisma.order.findMany({
          where: whereFilter,
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
            orderItems: {
              select: {
                quantity: true,
              },
            },
            finalAmount: true,
            paymentStatus: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
              },
            },
          },
        }),
        prisma.productVariant.findMany({
          where: {
            ...whereFilter,
            stock: {
              lt: 5,
            },
          },
          select: {
            productVariantTitle: true,
            stock: true,
            finalPrice: true,
            productVariantImage: true,
            id: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.order.findMany({
          where: {
            ...whereFilter,
            isPaid: true,
            createdAt: {
              gte: oneYearAgo,
            },
            status: {
              notIn: ["CANCELLED", "REFUNDED"],
            },
          },
          select: {
            createdAt: true,
            finalAmount: true,
          },
        }),
        prisma.orderItem.groupBy({
          by: ["jewelryType"],
          _count: {
            _all: true,
          },
          where: {
            ...whereFilter,
            jewelryType: {
              not: null,
            },
          },
        }),
        prisma.wishlist.groupBy({
          by: ["productVariantId"],
          _count: {
            productVariantId: true,
          },
          take: 5,
          orderBy: {
            _count: {
              productVariantId: "desc",
            },
          },
        }),
        prisma.orderItem.groupBy({
          by: ["productVariantId"],
          _sum: {
            quantity: true,
          },
          where: {
            order: {
              ...whereFilter,
              status: "DELIVERED",
            },
          },
          orderBy: {
            _sum: {
              quantity: "desc",
            },
          },
          take: 5,
        }),
      ]);

      const topCategoriesWithImages = await Promise.all(
        topCategory.map(async (category) => {
          if (!category.jewelryType) return null;

          const jewelryType = await prisma.jewelryType.findFirst({
            where: {
              name: category.jewelryType,
            },
            select: {
              imageUrl: true,
            },
          });

          return {
            name: category.jewelryType,
            count: category._count._all,
            imageUrl: jewelryType?.imageUrl || null,
          };
        })
      ).then((results) => results.filter(Boolean));

      const mostWishlistedWithDetails = await Promise.all(
        mostWishlistedProducts.map(async (wishlistItem) => {
          const productVariant = await prisma.productVariant.findUnique({
            where: {
              id: wishlistItem.productVariantId,
            },
            select: {
              productVariantTitle: true,
              productVariantImage: true,
              products: {
                select: {
                  name: true,
                  productSlug: true,
                },
              },
            },
          });

          return {
            id: wishlistItem.productVariantId,
            title: productVariant?.productVariantTitle || "Unknown Product",
            image: productVariant?.productVariantImage[0]?.imageUrl || null,
            productSlug: productVariant?.products?.productSlug || "",
            wishlistCount: wishlistItem._count.productVariantId,
          };
        })
      );

      const bestSellingProductDetails = await Promise.all(
        bestSellingProducts.map(async (item) => {
          const productVariant = await prisma.productVariant.findUnique({
            where: { id: item.productVariantId },
            select: {
              productVariantTitle: true,
              productVariantImage: true,
              products: {
                select: {
                  name: true,
                  productSlug: true,
                },
              },
            },
          });

          return {
            id: item.productVariantId,
            title: productVariant?.productVariantTitle || "Unknown Product",
            image: productVariant?.productVariantImage[0]?.imageUrl || null,
            productSlug: productVariant?.products?.productSlug || "",
            quantitySold: item._sum.quantity,
          };
        })
      );

      console.log("category order=>", topCategory);
      // Group monthly sales manually without date-fns
      const monthlySalesMap = {};
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      for (const order of monthlyOrders) {
        const createdAt = new Date(order.createdAt);
        const monthKey = monthNames[createdAt.getMonth()]; // e.g., "Jul"

        if (!monthlySalesMap[monthKey]) {
          monthlySalesMap[monthKey] = 0;
        }
        monthlySalesMap[monthKey] += Number(order.finalAmount);
      }

      const monthlySalesReport = monthNames.map((month) => ({
        month,
        totalSales: monthlySalesMap[month] || 0,
      }));

      console.log("product count =", orderStatusCounts);

      // Map order status counts to separate fields
      const orderStatusMap = Object.fromEntries(
        orderStatusCounts.map((item) => [item.status, item._count])
      );

      return {
        earning: earningData._sum.finalAmount || 0,
        totalOrderItems: orderItemCount,
        pendingOrder: orderStatusMap["PENDING"] || 0,
        confirmOrder: orderStatusMap["CONFIRMED"] || 0,
        shippedOrder: orderStatusMap["SHIPPED"] || 0,
        completedOrder: orderStatusMap["DELIVERED"] || 0,
        cancelledOrder: orderStatusMap["CANCELLED"] || 0,
        refundedOrder: orderStatusMap["REFUNDED"] || 0,
        customer: customerCount,
        product: productCount,
        recentOrder: recentOrders,
        lowStock: lowStockProducts,
        monthlySalesReport,
        topCategory: topCategoriesWithImages,
        mostWishlistedProducts: mostWishlistedWithDetails,
        bestSellingProductDetails: bestSellingProductDetails,
      };
    } catch (error) {
      console.error("Error in fetchDashboardCount:", error);
      throw { status: 500, message: "Error fetching dashboard count" };
    }
  },

  async fetchLowStock(query) {
    const { search } = query;
    try {
      let whereFilter = {};

      // Get total count for pagination
      const totalCount = await prisma.productVariant.count({
        where: {
          stock: {
            lt: 5,
          },
        },
      });

      // Searching
      if (search) {
        whereFilter = {
          ...whereFilter,
          OR: [
            { productVariantTitle: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        };
      }

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const lowStock = await prisma.productVariant.findMany({
        where: {
          ...whereFilter,
          stock: {
            lt: 5,
          },
        },
        select: {
          id: true,
          productVariantTitle: true,
          stock: true,
          finalPrice: true,
          productVariantImage: true,
          sku: true,
          products: {
            select: {
              name: true,
              productSlug: true,
              jewelryType: {
                select: {
                  id: true,
                  name: true,
                  jewelryTypeSlug: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      return {
        lowStock,
        pagination: { page, limit, skip, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw new Error(
        "Something went wrong while fetching low stock products: " +
          error.message
      );
    }
  },

  async fetchStaff(query) {
    try {
      const { search } = query;
      let whereFilter = {
        role: {
          NOT: {
            name: {
              equals: "admin",
            },
          },
        },
      };

      if (search !== null && search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [{ name: { contains: search, mode: "insensitive" } }],
          OR: [{ email: { contains: search, mode: "insensitive" } }],
        };
      }

      const totalCount = await prisma.admin.count({
        where: { ...whereFilter },
      });
      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const staff = await prisma.admin.findMany({
        where: whereFilter,
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          extraPermissions: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      });

      return {
        staff,
        pagination: { page, limit, totalCount, totalPages, currentPage },
      };
    } catch (error) {
      console.error("Error in fetchStaff:", error);
      throw { status: 500, message: "Error fetching staff" };
    }
  },

  async fetchStaffById(id) {
    try {
      if (!id) {
        throw { status: 400, message: "Staff ID is required" };
      }

      const staff = await prisma.admin.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          extraPermissions: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!staff) {
        throw { status: 404, message: "Staff not found" };
      }

      return staff;
    } catch (error) {
      console.error("Error in fetchStaffById:", error);
      throw { status: 500, message: "Error fetching staff" };
    }
  },

  //update admin staff..................
  async updateAdminStaff(data) {
    const { id, name, email, role, isActive, extraPermissions, password } =
      data;

    if (!id || !name || !email) {
      throw { status: 400, message: "Provide all the required fields" };
    }

    try {
      const existingAdmin = await prisma.admin.findUnique({
        where: {
          id,
        },
      });

      if (!existingAdmin) {
        throw { status: 404, message: "Admin not found" };
      }

      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) {
        updateData.role = {
          connect: {
            id: role,
          },
        };
      }

      if (extraPermissions) {
        updateData.extraPermissions = {
          set: extraPermissions.map((permissionId) => ({
            id: permissionId,
          })),
        };
      }
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      console.log("update=", updateData);
      const updatedAdmin = await prisma.admin.update({
        where: {
          id,
        },
        data: updateData,
      });

      return updatedAdmin;
    } catch (error) {
      console.error("Error in updateAdminStaff:", error);
      throw { status: 500, message: "Error updating admin staff" };
    }
  },

  async adminLoginFunction(data, session) {
    const { email, password } = data;

    if (!email || !password) {
      throw { statusCode: 400, message: "Provide all the required fields" };
    }

    try {
      const existingAdmin = await prisma.admin.findFirst({
        where: {
          email,
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
          extraPermissions: true,
        },
      });
      console.log("existingAdmin==", existingAdmin);
      if (!existingAdmin) {
        throw { statusCode: 404, message: "Admin not found" };
      }

      if (existingAdmin.isActive === false) {
        throw new Error(
          "Your account is currently inactive. Please contact support for verification."
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingAdmin.password
      );

      if (!isPasswordCorrect) {
        throw { statusCode: 401, message: "Invalid credential" };
      }

      if (!session) {
        console.log("Session not initialized");
        throw { statusCode: 500, message: "Session not initialized" };
      }

      const rolePermissions = existingAdmin?.role?.permissions?.map(
        (rp) => rp.permission
      );
      const extraPermissions = existingAdmin.extraPermissions;
      const permissions = [
        ...(rolePermissions?.filter((p) => p) || []),
        ...(extraPermissions?.filter(
          (ep) =>
            ep && !(rolePermissions || [])?.some((rp) => rp?.id === ep?.id)
        ) || []),
      ];

      session.admin = {
        id: existingAdmin.id,
        email: existingAdmin.email,
        phone: existingAdmin.phone,
        name: existingAdmin.name,
        role: existingAdmin?.role?.name,
        status: existingAdmin.isActive,
        permissions,
      };

      return {
        message: "Admin login successfully",
        data: {
          id: existingAdmin.id,
          email: existingAdmin.email,
          phone: existingAdmin.phone,
          name: existingAdmin.name,
          role: existingAdmin?.role?.name,
          status: existingAdmin.isActive,
          permissions,
        },
      };
    } catch (error) {
      console.error("Error in adminLoginFunction:", error);
      throw new Error("Something went wrong while login " + error.message);
    }
  },

  async checkAdminSession(adminId) {
    try {
      if (!adminId) {
        throw {
          message: "User is not authenticated",
          isAuthenticated: false,
        };
      }

      const admin = await prisma.admin.findFirst({
        where: {
          id: adminId,
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
          extraPermissions: true,
        },
      });

      if (!admin) {
        throw {
          message: "User not found",
          isAuthenticated: false,
        };
      }

      const rolePermissions = admin?.role?.permissions?.map(
        (rp) => rp.permission
      );
      const extraPermissions = admin.extraPermissions;
      const permissions = [
        ...(rolePermissions?.filter((p) => p) || []),
        ...(extraPermissions?.filter(
          (ep) =>
            ep && !(rolePermissions || [])?.some((rp) => rp?.id === ep?.id)
        ) || []),
      ];

      return {
        message: "User is authenticated",
        admin: {
          id: admin.id,
          email: admin.email,
          phone: admin.phone,
          name: admin.name,
          role: admin?.role?.name,
          status: admin.isActive,
          permissions,
        },
        isAuthenticated: true,
      };
    } catch (error) {
      console.log("session error = ", error);
      throw new Error(
        "Something went wrong while checking session ",
        error.message
      );
    }
  },

  async isActiveUserService(id) {
    try {
      if (!id) {
        throw { status: 400, message: "User ID is required" };
      }

      const user = await prisma.admin.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw { status: 404, message: "User not found" };
      }

      const newIsActive = !user.isActive;

      const updatedUser = await prisma.admin.update({
        where: { id },
        data: { isActive: newIsActive },
      });

      return {
        message: `User ${newIsActive ? "activated" : "deactivated"} successfully`,
        data: updatedUser,
      };
    } catch (error) {
      console.error("Error in isActiveUserService:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Error updating user status",
      };
    }
  },
};

export default adminService;
