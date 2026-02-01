import { axiosPrivate } from "../axios";

// Gemstone Type API
export const getGemstoneType = () => {
  return axiosPrivate.get(`/gemstone-type/fetch`);
};
export const getGemstoneTypeById = (id) => {
  return axiosPrivate.get(`/gemstone-type/fetch/${id}`);
};
export const createGemstoneType = (data) => {
  return axiosPrivate.post(`/gemstone-type/create`, data);
};
export const updateGemstoneType = (id, data) => {
  return axiosPrivate.patch(`/gemstone-type/update/${id}`, data);
};
export const deleteGemstoneType = (id) => {
  return axiosPrivate.delete(`/gemstone-type/delete/${id}`);
};

// Gemstone Variant API
export const getGemstoneVariant = (params = {}) => {
  return axiosPrivate.get(`/gemstone-variant/fetch`,{params});
};
export const getGemstoneVariantById = (id) => {
  return axiosPrivate.get(`/gemstone-variant/fetch/${id}`);
};
export const createGemstoneVariant = (data) => {
  return axiosPrivate.post(`/gemstone-variant/create`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const updateGemstoneVariant = (id, data) => {
  return axiosPrivate.patch(`/gemstone-variant/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const deleteGemstoneVariant = (id) => {
  return axiosPrivate.delete(`/gemstone-variant/delete/${id}`);
};

// Gemstone Color API
export const getGemstoneColor = () => {
  return axiosPrivate.get(`/gemstone-color/fetch`);
};
export const getGemstoneColorById = (id) => {
  return axiosPrivate.get(`/gemstone-color/fetch/${id}`);
};
export const createGemstoneColor = (data) => {
  return axiosPrivate.post(`/gemstone-color/create`, data);
};
export const updateGemstoneColor = (id, data) => {
  return axiosPrivate.patch(`/gemstone-color/update/${id}`, data);
};
export const deleteGemstoneColor = (id) => {
  return axiosPrivate.delete(`/genstone-color/delete/${id}`);
};


// Gemstone Color Variant API
export const getGemstoneColorVariant = () => {
  return axiosPrivate.get(`/gemstone-color-variant/fetch`);
};
export const getGemstoneColorVariantById = (id) => {
  return axiosPrivate.get(`/gemstone-color-variant/fetch/${id}`);
};
export const createGemstoneColorVariant = (data) => {
  return axiosPrivate.post(`/gemstone-color-variant/create`, data);
};
export const updateGemstoneColorVariant = (id, data) => {
  return axiosPrivate.patch(`/gemstone-color-variant/update/${id}`, data);
};
export const deleteGemstoneColorVariant = (id) => {
  return axiosPrivate.delete(`/gemstone-color-variant/delete/${id}`);
};


export const getGemstoneVariantUpdateHistory = (id, params = {}) => {
  return axiosPrivate.get(`/gemstone-variant/fetch/history/${id}`, { params });
}