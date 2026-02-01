import { Router } from "express";
import orderController from "../../controller/order/orderController.js";
import { isAdmin } from "../../middleware/isAdmin.js";
import { upload } from "../../middleware/aws.file.stream.js";

const router = Router();

//admin fetch order api.................................................................
router.get("/admin/fetch", orderController.fetchAdminAllOrder);
// public order api....................................................................
router.post("/create", orderController.createOrder);
router.get("/fetch/:orderId", orderController.getOrderById);
router.get("/user/all", orderController.getOrdersByUser);
router.patch("/update/:orderId/status", orderController.updateOrderStatus);
router.post("/pay/:orderId/payment", orderController.addPayment);
router.get("/fetch/:orderId/payments", orderController.getPayments);

router.get("/customer/track/:orderNumber", orderController.trackCustomerOrder);
router.post("/customer/cancel/:orderId", orderController.customerOrderCancel);
router.post("/customer/refund/:orderId", orderController.refundOrder);

//  return request api .............................
router.post("/customer/return-request/:orderId",upload.any(), orderController.customerReturnRequest); 
router.post("/admin/return-request/approved/:id",upload.any(), orderController.adminReturnRequestStatus); 
//  admin private
router.get("/admin/fetch/return-request", isAdmin,orderController.fetchReturnRequest); 
router.post("/admin/status/return-request/:id", isAdmin,orderController.adminReturnRequestStatus);


// expected delivery time
router.post("/admin/expected-delivery/:id",isAdmin,orderController.addExpectedDeliveryTime);



//  private----for admin
router.get("/sales-report",orderController.orderSalesReport)
router.get("/order-report",orderController.orderReport)

export default router;
