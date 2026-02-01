import { axiosPrivate } from "../axios";

export const getCollection = (params = {}) => {
  return axiosPrivate.get(`/collection/fetch`, { params });
};

export const createCollection = (data) => {
  return axiosPrivate.post(`/collection/create`, data);
};
export const getCollectionById = (id) => {
  return axiosPrivate.get(`/collection/fetch/${id}`);
};
export const updateCollection = (id, data) => {
  return axiosPrivate.patch(`/collection/update/${id}`, data);
};
export const deleteCollection = (id) => {
  return axiosPrivate.delete(`/collection/delete/${id}`);
};
export const toggleCollection = (id) => {
  return axiosPrivate.patch(`/collection/toggle/${id}`);
};
