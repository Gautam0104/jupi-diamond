import { PermissionService } from "../../services/permissionServices/permissionServices.js";

const permissionController = {
  async createPermission(req, res) {
    const { name, label, module } = req.body;
    if (!name || !label || !module)
      return res.status(400).json({ message: "All fields are required" });

    try {
      const permission = await PermissionService.createPermission(
        name,
        label,
        module
      );
      res.status(201).json(permission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAllPermissions(req, res) {
    try {
      const permissions = await PermissionService.getAllPermissions();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //fetch permission by id.............................
  async getPermissionById(req, res) {
    const { id } = req.params;
    try {
      const permission = await PermissionService.getPermissionById(id);
      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      res.json(permission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //update permission.................................
  async updatePermission(req, res) {
    const { id } = req.params;
    const { name, label, module } = req.body;
    try {
      const updatedPermission = await PermissionService.updatePermission(
        id,
        name,
        label,
        module
      );
      res.json(updatedPermission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //delete permission.................................
  async deletePermission(req, res) {
    const { id } = req.params;
    try {
      await PermissionService.deletePermission(id);
      res.json({ message: "Permission deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async addExtraPermissionsToAdmin(req, res) {
    const { adminId } = req.params;
    const { permissionIds } = req.body;

    try {
      const updated = await PermissionService.assignExtraPermissions(
        adminId,
        permissionIds
      );
      res
        .status(200)
        .json({ success: true, message: "Permissions added", data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async removeExtraPermissionFromAdmin(req, res) {
    const { adminId } = req.params;
    const { permissionIds } = req.body;

    try {
      const updated = await PermissionService.unassignExtraPermissions(
        adminId,
        permissionIds
      );
      res
        .status(200)
        .json({ success: true, message: "Permissions removed", data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getAllPermissionsForAdmin(req, res) {
    const { adminId } = req.params;

    try {
      const permissions =
        await PermissionService.fetchAdminPermissions(adminId);
      res.status(200).json({ success: true, data: permissions });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

export default permissionController;
