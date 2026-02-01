import { axiosPrivate } from "../axios";

export const getGlobalDiscounts = (params = {}) => {
  return axiosPrivate.get(`/global-discount/fetch/all`, { params });
};
export const getGlobalDiscountById = (id) => {
  return axiosPrivate.get(`/global-discount/fetch/${id}`);
};
export const createGlobalDiscount = (data) => {
  return axiosPrivate.post(`/global-discount/create`, data);
};
export const updateGlobalDiscount = (id, data) => {
  return axiosPrivate.patch(`/global-discount/update/${id}`, data);
};
export const deleteGlobalDiscount = (id) => {
  return axiosPrivate.delete(`/global-discount/delete/${id}`);
};
