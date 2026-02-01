import { axiosPrivate } from "../axios";

export const userRegister = (userData) => {
  return axiosPrivate.post("/auth/customer/register", userData);
};

export const userEmailVerification = async (token, role) => {
  return axiosPrivate.get("/auth/customer/verifyemail", {
    params: { token, role },
  });
};

export const userLogin = (formData) => {
  return axiosPrivate.post("/auth/customer/login", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateUser = (allData) => {
  return axiosPrivate.patch("/auth/customer/update", allData);
};

export const UserLogout = () => {
  return axiosPrivate.post("/auth/customer/user/logout");
};

export const AdminLogout = () => {
  return axiosPrivate.post("/auth/customer/admin/logout");
};

export const userForgetPassword = (allData) => {
  return axiosPrivate.post(`/auth/password/forget`, allData);
};

export const userCreateNewPassword = (token, id, newPassword) => {
  return axiosPrivate.patch(`/auth/password/reset`, {
    token,
    id,
    newPassword,
  });
};
