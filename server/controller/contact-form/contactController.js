import { contactSupport } from "../../services/contact-form/contactService.js";

const contact = {
  async submitContactForm(req, res) {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !email || !message) {
        return res
          .status(400)
          .json({ message: "Name, email, and message are required." });
      }

      const data = await contactSupport.submitContactForm({
        name,
        email,
        phone,
        subject,
        message,
      });
      res.status(201).json({ message: "Message submitted successfully", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Submission failed", error: error.message });
    }
  },
  async getAllMessages(req, res) {
    try {
      const data = await contactSupport.getAllMessages(req.query);
      res.status(200).json({ data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch messages", error: error.message });
    }
  },
  async getMessageById(req, res) {
    try {
      const data = await contactSupport.getMessageById(req.params.id);
      if (!data) return res.status(404).json({ message: "Message not found" });
      res.status(200).json({ data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch message", error: error.message });
    }
  },
  async updateMessageStatus(req, res) {
    try {
      const { status } = req.body;
      if (!["PENDING", "RESPONDED", "CLOSED"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const data = await contactSupport.updateMessageStatus(
        req.params.id,
        status
      );
      res.status(200).json({ message: "Status updated", data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update status", error: error.message });
    }
  },
  async deleteMessage(req, res) {
    try {
      await contactSupport.deleteMessage(req.params.id);
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete message", error: error.message });
    }
  },
};

export default contact;
