import { Router } from "express";
import contact from "../../controller/contact-form/contactController.js";

const router = Router();

// Admin routes

// router.post("/create", contact.submitContactForm);
router.get("/fetch", contact.getAllMessages);
router.get("/fetch/:id", contact.getMessageById);
router.patch("/update/:id/status", contact.updateMessageStatus);
router.delete("/delete/:id", contact.deleteMessage);

export default router;
