import { axiosPrivate } from "../axios";


export const fetchDashboardCount = async (params = {}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );
  return await axiosPrivate.get("/admin/dashboard/fetch/count", { 
    params: filteredParams 
  });
};