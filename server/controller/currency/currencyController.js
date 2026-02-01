import currencyService from "../../services/currency/currencyService.js";
import { successResponse } from "../../utils/responseHandler.js";

const currencyController = {
  async createCurrency(req, res) {
    const { code, symbol, exchangeRate } = req.body;
    try {
      if (!code) {
        res.status(400).json({ success: false, message: "Code is required" });
      }
      if (!symbol) {
        res.status(400).json({ success: false, message: "Symbol is required" });
      }
      if (!exchangeRate) {
        res
          .status(400)
          .json({ success: false, message: "Exchange rate is required" });
      }
      const result = await currencyService.createCurrency(req.body);

      return successResponse(res, 200, "Currency created successfully", result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getAllCurrencies(req, res) {
    try {
      const result = await currencyService.getAllCurrencies(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },
  async getAllPublicCurrencies(req, res) {
    try {
      const result = await currencyService.getAllPublicCurrencies(req.query);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  async getCurrencyById(req, res) {
    try {
      const result = await currencyService.getCurrencyById(
        req.params.currencyId
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  async updateCurrency(req, res) {
    try {
      if (!req.params.currencyId) {
        res
          .status(400)
          .json({ success: false, message: "Currency id is required" });
      }

      const result = await currencyService.updateCurrency(
        req.params.currencyId,
        req.body
      );
      res
        .status(200)
        .json({ success: true, message: "Currency updated", data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async deleteCurrency(req, res) {
    try {
      if (!req.params.currencyId) {
        res
          .status(400)
          .json({ success: false, message: "Currency id is required" });
      }
      const result = await currencyService.deleteCurrency(
        req.params.currencyId
      );
      res
        .status(200)
        .json({ success: true, message: "Currency deleted", data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};

export default currencyController;
