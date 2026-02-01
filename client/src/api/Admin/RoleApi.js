import { axiosPrivate } from "../axios";


export const createRole = (data) => {
  return axiosPrivate.post('/role/create', data);
}
export const getAllRoles = () => {
  return axiosPrivate.get('/role/fetch');
}
export const getRoleById = (id) => {
  return axiosPrivate.get(`/role/fetch/single/${id}`);
}
export const assignPermissionsToRole = (roleId, permissionIds) => {
  return axiosPrivate.post(`/role/assign/${roleId}/permissions`, { permissionIds });
}
export const updateRole = (data) => {
  return axiosPrivate.patch('/role/update', data);
}
export const deleteRole = (id) => {
  return axiosPrivate.delete(`/role/delete/${id}`);
}