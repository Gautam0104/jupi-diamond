import { axiosPrivate } from "../axios";


export const getAllCurrencies = (params = {}) => {
    return axiosPrivate.get(`/currency/fetch`, { params });
};

export const createCurrency = (data) => {
    return axiosPrivate.post(`/currency/create`, data);
};
export const getCurrencyById = (id) => {
    return axiosPrivate.get(`/currency/fetch/${id}`);
};
export const updateCurrency = (id, data) => {
    return axiosPrivate.patch(`/currency/update/${id}`, data);
};
export const deleteCurrency = (id) => {
    return axiosPrivate.delete(`/currency/delete/${id}`);
}
