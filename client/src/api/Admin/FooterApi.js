import { axiosPrivate } from "../axios";


export const fetchAllPages = async () => {
    return await axiosPrivate.get("/footer-cms/fetch/all/pages");
};

export const createPage = async (data) => {
    return await axiosPrivate.post("/footer-cms/create", data);
};
export const getPageById = async (id) => {
    return await axiosPrivate.get(`/footer-cms/fetch/id/${id}`);
};
export const updatePage = async (id, data) => {
    return await axiosPrivate.patch(`/footer-cms/update/${id}`, data);
};
export const deletePage = async (id) => {
    return await axiosPrivate.delete(`/footer-cms/delete/${id}`);
};