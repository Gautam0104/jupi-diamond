import prisma from "../config/prismaClient.js";

let staticExchangeRates = {};
const findCurrency = async () => {
  try {
    const currencies = await prisma.currency.findMany();
    currencies.forEach((currency) => {
      staticExchangeRates[currency.code] = currency.exchangeRate;
    });
    return currencies;
  } catch (error) {
    throw new Error("Error in finding currency");
  }
};

async function convertCurrency(amount, from = "INR", to = "INR") {
  if (!amount || isNaN(amount)) {
    throw new Error("Invalid amount");
  }

  await findCurrency();

  const fromRate = staticExchangeRates[from.toUpperCase()];
  const toRate = staticExchangeRates[to.toUpperCase()];

  if (!fromRate || !toRate) {
    throw new Error(`Unsupported currency conversion: ${from} to ${to}`);
  }

  const converted = (amount / fromRate) * toRate;
  return parseFloat(converted.toFixed(2));
}

export default convertCurrency;
