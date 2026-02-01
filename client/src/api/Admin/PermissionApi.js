import { axiosPrivate } from "../axios";

export const createPermission = (data) => {
  return axiosPrivate.post('/permission/create', data);
}
export const getAllPermissions = () => {
  return axiosPrivate.get('/permission/fetch');
}
export const getPermissionById = (id) => {
  return axiosPrivate.get(`/permission/fetch/single/${id}`);
}
export const updatePermission = (id, data) => {
  return axiosPrivate.patch(`/permission/update/${id}`, data);
}
export const deletePermission = (id) => {
  return axiosPrivate.delete(`/permission/delete/${id}`);
}
export const assignPermissionsToAdmin = (adminId, permissionIds) => {
  return axiosPrivate.post(`/permission/assign/${adminId}/add`, { permissionIds });
}
export const removePermissionsFromAdmin = (adminId, permissionIds) => {
  return axiosPrivate.post(`/permission/${adminId}/remove`, { permissionIds });
}
export const getAllPermissionsForAdmin = (adminId) => {
  return axiosPrivate.get(`/permission/${adminId}`);
}
