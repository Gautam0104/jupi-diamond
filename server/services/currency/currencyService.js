import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const currencyService = {
  async createCurrency(data) {
    try {
      const findCurrency = await prisma.currency.findFirst({
        where: { code: data.code },
      });
      if (findCurrency) {
        throw new Error("Currency already exists");
      }
      return await prisma.currency.create({ data });
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async getAllCurrencies() {
    try {
      const currency = await prisma.currency.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (!currency) {
        throw new Error("Currency not found");
      }
      return currency;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async getAllPublicCurrencies() {
    try {
      const currency = await prisma.currency.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (!currency) {
        throw new Error("Currency not found");
      }
      return currency;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async getCurrencyById(id) {
    try {
      const currency = await prisma.currency.findUnique({ where: { id } });
      if (!currency) {
        throw new Error("Currency not found!");
      }
      return currency;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async updateCurrency(id, data) {
    try {
      const findCurrency = await prisma.currency.findUnique({ where: { id } });
      if (!findCurrency) {
        throw new Error("Currency not found");
      }

      return await prisma.currency.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async deleteCurrency(id) {
    try {
      const findCurrency = await prisma.currency.findUnique({ where: { id } });
      if (!findCurrency) {
        throw new Error("Currency not found");
      }
      return await prisma.currency.delete({ where: { id } });
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },
};

export default currencyService;
