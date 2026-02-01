import { axiosPrivate } from "../axios";

export const getOccassion = (params = {}) => {
  return axiosPrivate.get(`/occassion/fetch`, { params });
};
export const getOccassionById = (id) => {
  return axiosPrivate.get(`/occassion/fetch/${id}`);
};
export const createOccassion = (data) => {
  return axiosPrivate.post(`/occassion/create`, data);
};

export const updateOccassion = (id, data) => {
  return axiosPrivate.patch(`/occassion/update/${id}`, data);
};
export const deleteOccassion = (id) => {
  return axiosPrivate.delete(`/occassion/delete/${id}`);
};

export const toggleOccassionStatus = (id) => {
  return axiosPrivate.patch(`/occassion/toggle/${id}`);
}
