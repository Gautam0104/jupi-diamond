import { Router } from "express";
import { verifyEmail } from "../../utils/verifyEmail.js";
import {
  checkSession,
  customerLogin,
  customerRegister,
  deleteCustomerController,
  fetchCustomer,
  getAllCustomers,
  updateCustomerController,
} from "../../controller/auth/customerController.js";
import { logoutAdmin, logoutUser } from "../../controller/user/userController.js";

const router = Router();

router.post("/register", customerRegister);
router.get("/fetch", fetchCustomer);
router.post("/login", customerLogin);
router.patch("/update", updateCustomerController);
router.get("/verifyemail", verifyEmail);
router.get("/check/session", checkSession);
router.post("/user/logout", logoutUser);
router.post("/admin/logout", logoutAdmin);

//admin access..............................
router.get("/fetch/all", getAllCustomers);
router.delete("/delete/:id", deleteCustomerController);

export default router;
