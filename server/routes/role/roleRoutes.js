import express from "express";
import roleController from "../../controller/roleController/roleController.js";
const router = express.Router();

router.post("/create", roleController.createRole);
router.get("/fetch", roleController.getAllRoles);
router.get("/fetch/single/:id", roleController.getRoleById);
router.post(
  "/assign/:roleId/permissions",
  roleController.assignPermissionsToRole
);
router.patch("/update", roleController.updateRole);
router.delete("/delete/:id", roleController.deleteRole);

export default router;
