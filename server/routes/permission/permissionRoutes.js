// routes/permission.routes.js
import express from "express";
import permissionController from "../../controller/permissionController/permissionController.js";

const router = express.Router();

router.post("/create", permissionController.createPermission);
router.get("/fetch", permissionController.getAllPermissions);
router.get("/fetch/single/:id", permissionController.getPermissionById);
router.patch("/update/:id", permissionController.updatePermission);
router.delete("/delete/:id", permissionController.deletePermission);

router.post(
  "/assign/:adminId/add",
  permissionController.addExtraPermissionsToAdmin
);
router.post(
  "/:adminId/remove",
  permissionController.removeExtraPermissionFromAdmin
);
router.get("/:adminId", permissionController.getAllPermissionsForAdmin);

export default router;
