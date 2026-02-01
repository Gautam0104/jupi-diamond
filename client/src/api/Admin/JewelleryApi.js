import { axiosPrivate } from "../axios";

export const getJewelleryType = (params={}) => {
  return axiosPrivate.get(`/jewelry-type/fetch`,{params});
};
export const createJewelleryType = (data) => {
  return axiosPrivate.post(`/jewelry-type/create`, data);
};
export const getJewelleryTypeById = (id) => {
  return axiosPrivate.get(`/jewelry-type/fetch/${id}`);
};
export const updateJewelleryType = (id, data) => {
  return axiosPrivate.patch(`/jewelry-type/update/${id}`, data);
};
export const deleteJewelleryType = (id) => {
  return axiosPrivate.delete(`/jewelry-type/delete/${id}`);
}
export const toggleJewelleryType = (id) => {
  return axiosPrivate.patch(`/jewelry-type/toggle/${id}`);
}