import { axiosPrivate } from "../axios";

export const getAllReviews = (params={}) => {
  return axiosPrivate.get(`/product-review/admin/reviews`,{params});
};    

export const approveReview = (id, status) => {
  return axiosPrivate.patch(`/product-review/admin/reviews/isApproved/${id}/${status}`);
};


export const featureReview = (id, status) => {
  return axiosPrivate.patch(`/product-review/admin/reviews/isFeatured/${id}/${status}`);
};
export const deleteReview = (id) => {
  return axiosPrivate.delete(`/product-review/admin/reviews/${id}`);
};