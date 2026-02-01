import { axiosPrivate } from "../axios";


export const createGiftCard = async (data) => {
    return axiosPrivate.post("/gift/voucher/create", data);
};
export const fetchAllGiftCards = async (params={}) => {
    return axiosPrivate.get("/gift/voucher/fetch",{ params });
};
export const fetchGiftCardById = async (id) => {
    return axiosPrivate.get(`/gift/voucher/fetch/${id}`);
}
export const updateGiftCard = async (id, data) => {
    return axiosPrivate.patch(`/gift/voucher/update/${id}`, data);
};
export const deleteGiftCard = async (id) => {
    return axiosPrivate.delete(`/gift/voucher/delete/${id}`);
};
export const getMyGiftCards = async () => {
    return axiosPrivate.get("/gift/voucher/my/card");
}
export const redeemGiftCard = async (data) => {
    return axiosPrivate.post("/gift/voucher/customer/redeem", data);
}