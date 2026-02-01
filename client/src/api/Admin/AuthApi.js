import { axiosPrivate } from "../axios";

export const adminLogin = (allData) => {
  return axiosPrivate.post('/admin/login', allData);
};

export const checkAdminSession = () => {
  return axiosPrivate.get('/admin/check/session');
};


export const adminRegister = (allData) => {
  return axiosPrivate.post('/admin/register', allData);
}
export const fetchStaff = (params={}) => {
  return axiosPrivate.get('/admin/fetch',{params});
};
export const fetchStaffById = (id) => {
  return axiosPrivate.get(`/admin/fetch/by/${id}`);
};
export const updateAdminStaff = (allData) => {
  return axiosPrivate.patch('/admin/update', allData);
};
export const toggleStatus = (id) => {
  return axiosPrivate.patch(`/admin/toggle/status/${id}`);
};
export const kycUpdate = (retailerId, allData) => {
  return axiosPrivate.patch(`/admin/retailer/kyc/${retailerId}`, allData);
};