import { axiosPrivate } from "../axios";


export const getBanners = (params = {}) => {
  return axiosPrivate.get(`/banner/fetch`, { params });
}
export const createBanner = (data) => {
  return axiosPrivate.post(`/banner/create`, data);
};
export const getBannerById = (id) => {
  return axiosPrivate.get(`/banner/fetch/${id}`);
};
export const updateBanner = (id, data) => {
  return axiosPrivate.patch(`/banner/update/${id}`, data);
};
export const toggleBanner = (id) => {
  return axiosPrivate.patch(`/banner/update/toggle/${id}`);
};
export const deleteBanner = (id) => {
  return axiosPrivate.delete(`/banner/delete/${id}`);
};
