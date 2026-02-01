import { axiosPrivate } from "../axios";

export const getCoupons = (params={}) => {
  return axiosPrivate.get(`/coupon/fetch`,{params});
}
export const createCoupon = (data) => {
  return axiosPrivate.post(`/coupon/create`, data);
};
export const getCouponById = (id) => {
  return axiosPrivate.get(`/coupon/fetch/${id}`);
};
export const updateCoupon = (id, data) => {
  return axiosPrivate.patch(`/coupon/update/${id}`, data);
};
export const deleteCoupon = (id) => {
  return axiosPrivate.delete(`/coupon/delete/${id}`);
};

export const updateCouponStatus = (id) => {
  return axiosPrivate.patch(`/coupon/status/update/${id}`);
}