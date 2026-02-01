import { axiosPrivate } from "../axios";

// Global Making Charges API
export const fetchGlobalMakingCharges = (params={}) => {
  return axiosPrivate.get('/global-making-charge/fetch',{params});
};
export const fetchGlobalMakingChargesById = (id) => {
  return axiosPrivate.get(`/global-making-charge/fetch/${id}`);
};
export const createGlobalMakingCharges = (data) => {
  return axiosPrivate.post('/global-making-charge/create', data);
};
export const updateGlobalMakingCharges = (id, data) => {
  return axiosPrivate.patch(`/global-making-charge/update/${id}`, data);
};
export const deleteGlobalMakingCharges = (id) => {
  return axiosPrivate.delete(`/global-making-charge/delete/${id}`);
};


// Global Making Charges Weight Range API
export const createMakingChargeWeightRange = (data) => {
  return axiosPrivate.post('/global-making-weight-range/create', data);
};
export const fetchAllMakingChargeWeightRanges = (params = {}) => {
  return axiosPrivate.get('/global-making-weight-range/fetch',{params});
};
export const fetchSingleMakingChargeWeightRange = (id) => {
  return axiosPrivate.get(`/global-making-weight-range/fetch/${id}`);
};
export const updateMakingChargeWeightRange = (id, data) => {
  return axiosPrivate.patch(`/global-making-weight-range/update/${id}`, data);
};
export const deleteMakingChargeWeightRange = (id) => {
  return axiosPrivate.delete(`/global-making-weight-range/delete/${id}`);
};
export const updateMakingChargeWeightRangeStatus = (id, data) => {
  return axiosPrivate.patch(`/global-making-weight-range/update/status/${id}`, data);
};


export const fetchMakingWeightByCategoryId = (categoryId) => {
  return axiosPrivate.get(`/global-making-weight-range/fetch/makingweightBy/${categoryId}`);
};