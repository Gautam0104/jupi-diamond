import prisma from "../../config/prismaClient.js";

export const PermissionService = {
  async createPermission(name, label, module) {
    return await prisma.permission.create({
      data: { name, label, module },
    });
  },

  async getAllPermissions() {
    return await prisma.permission.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },
  //fetch permission by id.............................
  async getPermissionById(id) {
    try {
      return await prisma.permission.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        "Something went wrong while fetching permission",
        error.message
      );
    }
  },

  //update permission by id.............................
  async updatePermission(id, name, label, module) {
    return await prisma.permission.update({
      where: { id },
      data: { name, label, module },
    });
  },
  //delete permission by id.............................
  async deletePermission(id) {
    try {
      const permission = await prisma.permission.findUnique({
        where: { id },
      });
      if (!permission) {
        throw new Error("Permission not found");
      }

      return await prisma.permission.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        "Something went wrong while deleting permission",
        error.message
      );
    }
  },

  async assignExtraPermissions(adminId, permissionIds = []) {
    try {
      return prisma.admin.update({
        where: { id: adminId },
        data: {
          extraPermissions: {
            connect: permissionIds.map((id) => ({ id })),
          },
        },
        include: { extraPermissions: true },
      });
    } catch (error) {
      console.log(error);
      throw new Error(
        "Something went wrong while assign permission",
        error.message
      );
    }
  },

  async unassignExtraPermissions(adminId, permissionIds = []) {
    return prisma.admin.update({
      where: { id: adminId },
      data: {
        extraPermissions: {
          disconnect: permissionIds.map((id) => ({ id })),
        },
      },
      include: { extraPermissions: true },
    });
  },
  async fetchAdminPermissions(adminId) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
        extraPermissions: true,
      },
    });

    const rolePermissions = admin.role.permissions.map((rp) => rp.permission);
    const extraPermissions = admin.extraPermissions;

    const combined = [
      ...rolePermissions,
      ...extraPermissions.filter(
        (ep) => !rolePermissions.some((rp) => rp.id === ep.id)
      ),
    ];

    return combined;
  },
};
