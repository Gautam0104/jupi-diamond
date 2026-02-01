import axios, { axiosPrivate } from "../axios";

export const getPublicBanners = () => {
  return axios.get(`/banner/public/list`);
};

export const submitContactForm = (data) => {
  return axios.post(`/public/contact/create`, data);
};

export const getPublicProductVariant = (filters) => {
  const {
    page,
    search,
    minWeight,
    maxWeight,
    limit,
    metalVariantSlug,
    gemstoneVariantSlug,
    sortBy,
    sortOrder,
    isActive,
    isGift,
    isFeatured,
    isNewArrival,
    minPrice,
    maxPrice,
    occasionSlug,
    productStyleSlug,
    collectionSlug,
    jewelryTypeSlug,
    startDate,
    endDate,
    globalDiscountId,
    globalMakingChargesId,
    karigarId,
    productSizeId,
    makingChargeWeightRangeId,
    makingChargeCategorySetId,
    debounceSearch,
    dailyWear,
    caratWeight,
    metalColorSlug,
  } = filters;

  const params = {};

  if (page) params.page = page;
  if (search || debounceSearch) params.search = search || debounceSearch;
  if (minWeight) params.minWeight = minWeight;
  if (maxWeight) params.maxWeight = maxWeight;
  if (limit) params.limit = limit;
  if (metalVariantSlug) params.metalVariantSlug = metalVariantSlug;
  if (gemstoneVariantSlug) params.gemstoneVariantSlug = gemstoneVariantSlug;
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;
  if (isActive !== undefined) params.isActive = isActive;
  if (isGift !== undefined) params.isGift = isGift;
  if (isFeatured !== undefined) params.isFeatured = isFeatured;
  if (isNewArrival !== undefined) params.isNewArrival = isNewArrival;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (occasionSlug) params.occasionSlug = occasionSlug;
  if (productStyleSlug) params.productStyleSlug = productStyleSlug;
  if (collectionSlug) params.collectionSlug = collectionSlug;
  if (jewelryTypeSlug) params.jewelryTypeSlug = jewelryTypeSlug;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (globalDiscountId) params.globalDiscountId = globalDiscountId;
  if (globalMakingChargesId)
    params.globalMakingChargesId = globalMakingChargesId;
  if (karigarId) params.karigarId = karigarId;
  if (productSizeId) params.productSizeId = productSizeId;
  if (makingChargeWeightRangeId)
    params.makingChargeWeightRangeId = makingChargeWeightRangeId;
  if (makingChargeCategorySetId)
    params.makingChargeCategorySetId = makingChargeCategorySetId;

  if (dailyWear) params.dailyWear = dailyWear;
  if (caratWeight) params.caratWeight = caratWeight;
  if (metalColorSlug) params.metalColorSlug = metalColorSlug;

  return axios.get(`/product-variant/public/fetch/all`, { params });
};

export const fetchNewArrivalProductVariant = (params) => {
  return axios.get(`/product-variant/public/new/arrival`, { params });
};

export const fetchProductBySlug = (productSlug) => {
  return axios.get(`/product/public/fetch/${productSlug}`);
};

export const getSideFilterData = (jewelryTypeSlug) => {
  return axios.get(`/public/side-filter`, { params: { jewelryTypeSlug } });
};

export const fetchIndexPageData = () => {
  return axios.get(`/public/data`);
};

export const fetchCartByCustomer = () => {
  return axiosPrivate.get(`/cart/fetch/customer`);
};

export const addItemToCart = (data) => {
  return axiosPrivate.post(`/cart-item/add`, data);
};
export const updateCartItem = (cartId, cartItemId, data) => {
  return axiosPrivate.patch(
    `/cart-item/cart/${cartId}/item/${cartItemId}`,
    data
  );
};
export const deleteCartItem = (cartItemId) => {
  return axiosPrivate.delete(`/cart-item/delete/${cartItemId}`);
};

export const getProductDetails = (productVariantId) => {
  return axios.get(`/product-variant/fetch/${productVariantId}`);
};

export const createOrder = (data) => {
  return axiosPrivate.post(`/order/create`, data);
};
export const fetchOrderById = (orderId) => {
  return axiosPrivate.get(`/order/fetch/${orderId}`);
};
export const fetchOrdersByUser = (params = {}) => {
  return axiosPrivate.get(`/order/user/all`, { params });
};
export const updateOrderStatus = (orderId, status) => {
  return axiosPrivate.patch(`/order/update/${orderId}/status`, { status });
};
export const addPaymentToOrder = (orderId, paymentData) => {
  return axiosPrivate.post(`/order/pay/${orderId}/payment`, paymentData);
};
export const fetchPaymentsByOrderId = (orderId) => {
  return axiosPrivate.get(`/order/fetch/${orderId}/payments`);
};

export const addProductReview = (formdata) => {
  return axiosPrivate.post(`/product-review/create`, formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchReviewsByVariant = (variantId,params={}) => {
  return axios.get(`/product-review/fetch/${variantId}`, { params });
};

export const verifyRazorpayPayment = (data) => {
  return axiosPrivate.post(`/payment/verify`, data);
};

export const fetchFooterCmsPage = (slug) => {
  return axios.get(`/footer-cms/fetch/${slug}`);
};

export const getAllPublicCurrencies = (params = {}) => {
  return axios.get(`/currency/public/fetch`, { params });
};

export const getPublicShippingCharges = () => {
  return axiosPrivate.get("/shipping/public/data");
};

export const getBlogs = (params = {}) => {
  return axios.get(`/blogs/public/fetch`, { params });
};

export const getFeaturedBlogs = (params = {}) => {
  return axios.get(`/blogs/public/featured/fetch`, { params });
};

export const getBlogsBySlug = (slug) => {
  return axios.get(`/blogs/public/fetch/${slug}`);
};

export const fetchGlobalNotifications = () => {
  return axiosPrivate.get(`/global/notification/fetch`);
};

export const deleteNotification = (id) => {
  return axiosPrivate.delete(`/global/notification/read/${id}`);
};

export const applyCoupon = (data) => {
  return axiosPrivate.post(`/coupon/applied`, data);
};

export const applyGift = (data) => {
  return axiosPrivate.post(`/gift/voucher/customer/redeem`, data);
};

export const getWishlistItems = () => {
  return axiosPrivate.get(`/wishlist/customer/fetch`);
};
export const addToWish = (data) => {
  return axiosPrivate.post(`/wishlist/create`, data);
};
export const removeFromWish = (itemId) => {
  return axiosPrivate.delete(`/wishlist/customer/delete/${itemId}`);
};

export const trackCustomerOrder = (orderNumber) => {
  return axios.get(`/order/customer/track/${orderNumber}`);
};

export const getMyGiftCards = () => {
  return axiosPrivate.get(`/gift/voucher/my/card`);
};

export const redeemGiftCard = (data) => {
  return axiosPrivate.post(`/gift/voucher/customer/redeem`, data);
};

export const getProductComparison = (slugs) => {
  return axios.post(`/product-variant/comparison/fetch`, {
    productSlugs: slugs,
  });
};

export const cancelCustomerOrder = (orderId, cancelledReason) => {
  return axiosPrivate.post(`/order/customer/cancel/${orderId}`, {
    cancelledReason,
  });
};

export const fetchProductStylesByJewelryType = (jewelryTypeSlug) => {
  return axios.get(`/public/product-styles/${jewelryTypeSlug}`);
};
