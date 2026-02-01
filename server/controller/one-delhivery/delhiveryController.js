import delhiveryService from "../../services/one-delhivery/delhiveryService.js";

const delhiveryController = {
  async createPickupLocation(req, res) {
    const { name, address, city, state, country, pin, phone } = req.body;
    if (!name || !address || !city || !state || !country || !pin || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (phone.length < 10 || pin.length < 4) {
      return res.status(400).json({ error: "Invalid phone or pin" });
    }
    try {
      const response = await delhiveryService.createPickupLocation(req.body);
      res.json(response.data);
    } catch (err) {
      console.log("error=", err);
      res.status(500).json({ error: err.message });
    }
  },

  async createOrder(req, res) {
    const { pickup_location, shipment } = req.body;
    if (!pickup_location || typeof pickup_location !== "string") {
      return res.status(400).json({ error: "pickup_location is required" });
    }
    const requiredFields = [
      "waybill",
      "order",
      "product",
      "consignee",
      "consignee_address",
      "consignee_city",
      "consignee_state",
      "consignee_pincode",
      "consignee_phone",
      "payment_mode",
      "total_amount",
      "weight",
      "pieces",
      "cod_amount",
    ];
    for (const field of requiredFields) {
      if (!shipment[field])
        return res.status(400).json({ error: `shipment.${field} is required` });
    }
    if (!["Prepaid", "COD"].includes(shipment.payment_mode)) {
      return res.status(400).json({ error: "Invalid payment_mode" });
    }
    if (typeof shipment.weight !== "number" || shipment.weight <= 0) {
      return res.status(400).json({ error: "Invalid weight" });
    }
    try {
      const response = await delhiveryService.createOrder(req.body);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async trackOrder(req, res) {
    const { awb } = req.params;
    if (!awb || awb.length < 5) {
      return res.status(400).json({ error: "AWB number is required" });
    }
    try {
      const response = await delhiveryService.trackOrder(awb);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async cancelOrder(req, res) {
    const { waybill } = req.body;
    if (!waybill || typeof waybill !== "string") {
      return res.status(400).json({ error: "waybill is required" });
    }
    try {
      const response = await delhiveryService.cancelOrder(waybill);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getManifest(req, res) {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });
    try {
      const response = await delhiveryService.getManifest(date);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async generateWaybill(req, res) {
    const count = parseInt(req.query.count || "1");
    if (isNaN(count) || count <= 0 || count > 100) {
      return res.status(400).json({ error: "Invalid count. Max 100." });
    }
    try {
      const response = await delhiveryService.generateWaybill(count);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default delhiveryController;
