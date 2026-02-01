
import { axiosPrivate } from "../axios";


export const customerOrderReturn = (formData,id) => {
  return axiosPrivate.post(`/order/customer/return-request/${id}`, formData);
};



