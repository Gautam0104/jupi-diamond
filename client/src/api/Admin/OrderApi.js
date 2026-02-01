import { id } from "date-fns/locale";
import { axiosPrivate } from "../axios";

export const getAllOrders = (params = {}) => {
  return axiosPrivate.get(`/order/admin/fetch`, {
    params,
    startDate: params.startDate
      ? new Date(params.startDate).toISOString()
      : undefined,
    endDate: params.endDate
      ? new Date(params.endDate).toISOString()
      : undefined,
  });
};

export const getOrderById = (orderId) => {
  return axiosPrivate.get(`/order/fetch/${orderId}`);
};

export const updateOrderStatus = (orderId, data) => {
  return axiosPrivate.patch(`/order/update/${orderId}/status`, data);
};


export const orderRefunded = (orderId, data) => {
  return axiosPrivate.post(`/order/customer/refund/${orderId}`, data);
};


export const orderRequestApproved = (id,data) => {
  return axiosPrivate.post(`/order/admin/return-request/approved/${id}`, data);
};


export const delivertTime = (id,data) => {
  return axiosPrivate.post(`/order/admin/expected-delivery/${id}`, data);
};



