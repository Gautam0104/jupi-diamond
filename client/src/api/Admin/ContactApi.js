import { axiosPrivate } from "../axios";



export const getAllMessages = (params={}) => {
  return axiosPrivate.get(`/contact/fetch`,{params});
};
export const getMessageById = (id) => {
  return axiosPrivate.get(`/contact/fetch/${id}`);
};
export const updateMessageStatus = (id, data) => {
  return axiosPrivate.patch(`/contact/update/${id}/status`, data);
};
export const deleteMessage = (id) => {
  return axiosPrivate.delete(`/contact/delete/${id}`);
};