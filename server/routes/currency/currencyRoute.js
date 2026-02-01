import express from "express";
import currencyController from "../../controller/currency/currencyController.js";

const router = express.Router();

router.post("/create", currencyController.createCurrency);
router.get("/public/fetch", currencyController.getAllPublicCurrencies);
router.get("/fetch", currencyController.getAllCurrencies);
router.get("/fetch/:currencyId", currencyController.getCurrencyById);
router.patch("/update/:currencyId", currencyController.updateCurrency);
router.delete("/delete/:currencyId", currencyController.deleteCurrency);

export default router;
