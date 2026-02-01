import { axiosPrivate } from "../axios";

export const getMetalType = (params = {}) => {
  return axiosPrivate.get(`/metal-type/fetch`, { params });
};
export const getMetalTypeById = (id) => {
  return axiosPrivate.get(`/metal-type/fetch/ById/${id}`);
};
export const createMetalType = async (data) => {
  return axiosPrivate.post("/metal-type/create", data);
};
export const deleteMetalType = (id) => {
  return axiosPrivate.delete(`/metal-type/delete/${id}`);
};
export const updateMetalType = (id, data) => {
  return axiosPrivate.patch(`/metal-type/update/${id}`, data);
};

export const getMetalColor = (params={}) => {
  return axiosPrivate.get(`/metal-color/fetch`,{ params });
};
export const getMetalColorById = (id) => {
  return axiosPrivate.get(`/metal-color/fetch/${id}`);
};
export const createMetalColor = (data) => {
  return axiosPrivate.post(`/metal-color/create`, data);
};
export const deleteMetalColor = (id) => {
  return axiosPrivate.delete(`/metal-color/delete/${id}`);
};
export const updateMetalColor = (id, data) => {
  return axiosPrivate.patch(`/metal-color/update/${id}`, data);
};

export const getMetalVariant = (params = {}) => {
  return axiosPrivate.get(`/metal-variant/fetch`, { params });
};
export const getMetalVariantById = (id) => {
  return axiosPrivate.get(`/metal-variant/fetch/${id}`);
};
export const createMetalVariant = (data) => {
  return axiosPrivate.post(`/metal-variant/create`, data);
};
export const deleteMetalVariant = (id) => {
  return axiosPrivate.delete(`/metal-variant/delete/${id}`);
};
export const updateMetalVariant = (id, data) => {
  return axiosPrivate.patch(`/metal-variant/update/${id}`, data);
};

export const getMetalVariantUpdateHistory = (id,params={}) => {
  return axiosPrivate.get(`/metal-variant/fetch/history/${id}`,{params});
};

export const getMetalColorVariant = () => {
  return axiosPrivate.get(`/metal-color-variant/fetch`);
};
export const getMetalColorVariantById = (id) => {
  return axiosPrivate.get(`/metal-color-variant/fetch/${id}`);
};
export const createMetalColorVariant = (data) => {
  return axiosPrivate.post(`/metal-color-variant/create`, data);
};
export const deleteMetalColorVariant = (id) => {
  return axiosPrivate.delete(`/metal-color-variant/delete/${id}`);
};
