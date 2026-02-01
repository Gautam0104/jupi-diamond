import { axiosPrivate } from "../axios";

export const createUserAddress = (payload) => {
  return axiosPrivate.post(`/address/create`, payload);
};
export const deleteUserAddress = (id) => {
  return axiosPrivate.delete(`/address/delete/${id}`);
};
export const getUserAddressById = (id) => {
  return axiosPrivate.get(`/address/fetch/${id}`);
};
export const getUserAddress = () => {
  return axiosPrivate.get(`/address/fetch`);
};
export const updateUserAddress = (id, payload) => {
  return axiosPrivate.patch(`/address/update/${id}`, payload);
};
