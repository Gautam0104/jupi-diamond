import { axiosPrivate } from "../axios";

export const getUserProfile = (id) => {
  return axiosPrivate.get(`/auth/customer/fetch`);
};

export const updateUserProfile = (payload) => {
  return axiosPrivate.patch(`/auth/customer/update`, payload);
};
