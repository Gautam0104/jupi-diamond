import axios, { axiosPrivate } from "../axios";

export const fetchSalesReport = async (params = {}) => {
   const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );
  return await axiosPrivate.get("/order/sales-report", { params: filteredParams });
};

export const fetchOrderReport = async (params={}) => {
   const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );
  return await axios.get("/order/order-report",{ params: filteredParams });
};
