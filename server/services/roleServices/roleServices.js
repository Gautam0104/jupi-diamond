import prisma from "../../config/prismaClient.js";

export const rolesService = {
  async createRole(name, description) {
    try {
      // Check for existing role with same name
      const existingRole = await prisma.roles.findFirst({
        where: {
          name: name.trim().toLowerCase(),
        },
      });

      if (existingRole) {
        throw new Error("This role already exists");
      }

      return await prisma.roles.create({
        data: {
          name: name.trim().toLowerCase(),
          description: description.trim(),
        },
      });
    } catch (error) {
      throw new Error(
        `Something went wrong while creating role: ${error.message}`
      );
    }
  },

  async getAllRoles() {
    try {
      const findAdmin = await prisma.admin.findFirst({
        where: {
          role: {
            name: "admin",
          },
        },
      });
      const adminRoleId = findAdmin.rolesId;
      return await prisma.roles.findMany({
        where: {
          NOT: {
            id: adminRoleId,
          },
        },
        include: { permissions: { include: { permission: true } } },
      });
    } catch (error) {
      throw new Error(`Error fetching roles: ${error.message}`);
    }
  },
  //Get role by id.........................................
  async getRoleById(id) {
    try {
      const findRole = await prisma.roles.findUnique({
        where: { id },
        include: { permissions: { include: { permission: true } } },
      });
      if (!findRole) {
        throw new Error("Role not found");
      }

      return findRole;
    } catch (error) {
      throw new Error(`Something went wrong finding role: ${error.message}`);
    }
  },

  async assignPermissions(roleId, permissionIds) {
    try {
      // Get existing permissions and filter in a single query
      const existingPermissions = await prisma.rolePermission.findMany({
        where: {
          roleId,
          permissionId: {
            notIn: permissionIds,
          },
        },
      });

      // Bulk create new permissions in a single operation
      if (permissionIds.length > 0) {
        await prisma.rolePermission.createMany({
          data: permissionIds.map((pid) => ({
            roleId,
            permissionId: pid,
          })),
          skipDuplicates: true, // Skip any duplicate permission assignments
        });
      }

      return {
        success: true,
        message: "Permissions assigned successfully",
      };
    } catch (error) {
      throw new Error(
        `Something went wrong while assigning permissions: ${error.message}`
      );
    }
  },

  //update role ................................................................
  async updateRole(data) {
    const { id, name, description } = data;
    console.log("data=", data);
    try {
      const findRole = await prisma.roles.findUnique({
        where: { id },
      });

      if (!findRole) {
        throw new Error("This role was not found!");
      }

      const roleUpdate = await prisma.roles.update({
        where: {
          id,
        },
        data: {
          name: name.trim().toLowerCase(),
          description: description.trim(),
        },
      });

      return roleUpdate;
    } catch (error) {
      throw new Error(
        `Something went wrong while updating role: ${error.message}`
      );
    }
  },

  //delete role.................................................................
  async deleteRole(id) {
    try {
      const findRole = await prisma.roles.findUnique({
        where: { id },
      });

      if (!findRole) {
        throw new Error("This role was not found!");
      }

      const roleDelete = await prisma.roles.delete({
        where: {
          id,
        },
      });

      return roleDelete;
    } catch (error) {
      throw new Error(
        `Something went wrong while deleting role: ${error.message}`
      );
    }
  },
};
