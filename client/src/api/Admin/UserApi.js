import { axiosPrivate } from "../axios";

export const fetchUser = (params = {}) => {
  const formattedParams = {
    ...params,
    startDate: params.startDate ? new Date(params.startDate).toISOString() : undefined,
    endDate: params.endDate ? new Date(params.endDate).toISOString() : undefined,
  };

  const cleanParams = Object.fromEntries(
    Object.entries(formattedParams).filter(([_, value]) => value !== undefined)
  );

  return axiosPrivate.get(`/auth/customer/fetch/all`, { params: cleanParams });
};