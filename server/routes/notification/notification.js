import { Router } from "express";
import notificationController from "../../controller/notification/notificationController.js";

const router = Router();

router.get("/fetch", notificationController.getAllNotification);
router.delete("/read/:id", notificationController.deleteNotification);

export default router;
