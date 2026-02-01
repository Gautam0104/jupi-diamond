import React, { createContext, useState, useEffect, useCallback } from "react";
import { getAllPublicCurrencies } from "../api/Public/publicApi";

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("currency") || "INR"
  );
  const [exchangeRates, setExchangeRates] = useState({ INR: 1 });
  const [currencyList, setCurrencyList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllPublicCurrencies();
      setCurrencyList(res.data.data);
      
      // Create exchange rates object from the API data
      const rates = {};
      res.data.data.forEach(curr => {
        rates[curr.code] = curr.exchangeRate;
      });
      setExchangeRates(rates);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const switchCurrency = useCallback((newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  }, []);

  const convertPrice = useCallback(
    (amountInINR) => {
      return amountInINR * (exchangeRates[currency] || 1);
    },
    [currency, exchangeRates]
  );

  const getCurrencySymbol = useCallback((currCode) => {
    const currency = currencyList.find((c) => c.code === currCode);
    return currency ? currency.symbol : currCode;
  }, [currencyList]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        switchCurrency,
        convertPrice,
        countryCurrencyMap: currencyList,
        fetchExchangeRates: fetchData,
        getCurrencySymbol,
        loading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};