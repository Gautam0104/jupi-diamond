import { axiosPrivate } from "../axios";


export const createShippingCharge = (data) => {
    return axiosPrivate.post('/shipping/create', data);
}   
export const getAllShippingCharges = () => {
    return axiosPrivate.get('/shipping/fetch');
}
export const getShippingChargeById = (id) => {
    return axiosPrivate.get(`/shipping/fetch/by/${id}`);
}
export const updateShippingCharge = (id, data) => {
    return axiosPrivate.patch(`/shipping/update/${id}`, data);
}
export const deleteShippingCharge = (id) => {
    return axiosPrivate.delete(`/shipping/delete/${id}`);
}

