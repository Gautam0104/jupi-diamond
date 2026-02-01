import { Router } from "express";
import adminController from "../../controller/admin/adminController.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = Router();

router.post("/admin/register", adminController.adminRegister);
router.get("/admin/fetch", adminController.fetchStaff);
router.get("/fetch/count", adminController.fetchDashboardCount);
router.get("/fetch/outofstock", adminController.fetchOutOfStockProducts);
router.get("/admin/fetch/by/:id", adminController.fetchStaffById);
router.patch("/admin/update", adminController.updateAdminStaff);
router.post("/admin/login", adminController.adminLogin);
router.get("/admin/check/session", adminController.checkSession);
//admin-only route to approve/reject retailer
router.patch(
  "/admin/toggle/status/:id",
  isAdmin,
  adminController.isActiveController
);
router.patch(
  "/admin/retailer/kyc/:retailerId",
  isAdmin,
  adminController.kycUpdate
);

export default router;
