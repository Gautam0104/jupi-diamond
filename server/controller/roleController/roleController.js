import { rolesService } from "../../services/roleServices/roleServices.js";

const roleController = {
  async createRole(req, res) {
    const { name, description } = req.body;
    if (!name)
      return res.status(400).json({ message: "Role name is required" });

    try {
      const role = await rolesService.createRole(name, description);
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAllRoles(req, res) {
    try {
      const roles = await rolesService.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //fetch role by id..................................................

  async getRoleById(req, res) {
    try {
      const roles = await rolesService.getRoleById(req.params.id);
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //update role.........................................................
  async updateRole(req, res) {
    const { id } = req.params;
    try {
      const roleUpdate = await rolesService.updateRole({ ...req.body, id });
      res.status(200).json(roleUpdate);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async assignPermissionsToRole(req, res) {
    const { roleId } = req.params;
    const { permissionIds } = req.body;
    if (!Array.isArray(permissionIds))
      return res
        .status(400)
        .json({ message: "permissionIds must be an array" });

    try {
      const result = await rolesService.assignPermissions(
        roleId,
        permissionIds
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  //update role.......................................
  async updateRole(req, res) {
    const { id, name, description } = req.body;
    try {
      if (!id || !name) {
        return res
          .status(400)
          .json({ message: "Role ID and name are required" });
      }

      const roleUpdate = await rolesService.updateRole(req.body);
      res
        .status(200)
        .json({ message: "Role Updated Successfully", data: roleUpdate });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteRole(req, res) {
    try {
      const roleDelete = await rolesService.deleteRole(req.params.id);
      res
        .status(200)
        .json({ message: "Role Deleted Successfully", data: roleDelete });
    } catch (error) {
      res.status(200).json({ message: error.message });
    }
  },
};

export default roleController;
