import { axiosPrivate } from "../axios";

export const getProduct = () => {
  return axiosPrivate.get(`/product/fetch`);
};

export const getProductById = (id) => {
  return axiosPrivate.get(`/product/fetch/${id}`);
};

export const createProduct = (data) => {
  return axiosPrivate.post(`/product/create`, data);
};

export const updateProduct = (id, data) => {
  return axiosPrivate.patch(`/product/update/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteProduct = (id) => {
  return axiosPrivate.delete(`/product/delete/${id}`);
};

export const bulkUploadProductsFromExcel = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosPrivate.post(`/product/bulk-create/excel`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getKarigarDetails = () => {
  return axiosPrivate.get(`/product/karigar/details`);
};

export const addProductVariant = (productId, data) => {
  return axiosPrivate.post(`/product/add-variant/${productId}`, data);
};

// Product Variant APIs
export const getProductVariant = (filters) => {
  const {
    page,
    limit,
    minWeight,
    maxWeight,
    metalVariantId,
    gemstoneVariantId,
    sortBy,
    gridView,
    sortOrder,
    isActive,
    isFeatured,
    isNewArrival,
    minPrice,
    maxPrice,
    occasionId,
    productStyleId,
    collectionId,
    jewelryTypeId,
    startDate,
    endDate,
    globalDiscountId,
    globalMakingChargesId,
    karigarId,
    productSizeId,
    makingChargeWeightRangeId,
    makingChargeCategorySetId,
    search,
  } = filters;

  // Create params object and only add properties that have truthy values
  const params = { limit: 10};

  if (search) params.search = search;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (minWeight) params.minWeight = minWeight;
  if (maxWeight) params.maxWeight = maxWeight;
  if (metalVariantId) params.metalVariantId = metalVariantId;
  if (gemstoneVariantId) params.gemstoneVariantId = gemstoneVariantId;
  if (sortBy) params.sortBy = sortBy;
  if (gridView) params.gridView = gridView;
  if (sortOrder) params.sortOrder = sortOrder;
  if (isActive !== undefined) params.isActive = isActive;
  if (isFeatured !== undefined) params.isFeatured = isFeatured;
  if (isNewArrival !== undefined) params.isNewArrival = isNewArrival;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (occasionId) params.occasionId = occasionId;
  if (productStyleId) params.productStyleId = productStyleId;
  if (collectionId) params.collectionId = collectionId;
  if (jewelryTypeId) params.jewelryTypeId = jewelryTypeId;
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

  return axiosPrivate.get(`/product-variant/fetch`, { params });
};

export const getProductVariantById = (id) => {
  return axiosPrivate.get(`/product-variant/fetch/${id}`);
};
export const createProductVariant = (data) => {
  return axiosPrivate.post(`/product-variant/create`, data);
};
export const updateProductVariant = (id, data) => {
  return axiosPrivate.patch(`/product-variant/update/${id}`, data);
};
export const deleteProductVariant = (id) => {
  return axiosPrivate.delete(`/product-variant/delete/${id}`);
};

export const toggleProductVariantStatus = (id, status) => {
  return axiosPrivate.patch(`/product-variant/update/status/${status}/${id}`);
};

export const addProductVariantImage = (id, data) => {
  return axiosPrivate.post(`/product-variant/add/image/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const removeProductVariantImage = (imageId) => {
  return axiosPrivate.delete(`/product-variant/remove/image/${imageId}`);
};

export const updateProductVariantImageOrder = (id, data) => {
  return axiosPrivate.patch(`/product-variant/update-image-order/${id}`, data);
};

export const addScrewToVariant = (data) => {
  return axiosPrivate.post(`/product-variant/add/crew`, data);
};
export const removeScrewFromVariant = (variantId, screwId) => {
  return axiosPrivate.delete(
    `/product-variant/remove/crew/${variantId}/${screwId}`
  );
};

// Product Size APIs
export const getProductSize = (params = {}) => {
  return axiosPrivate.get(`/product-size/fetch`, { params });
};
export const getProductSizeById = (id) => {
  return axiosPrivate.get(`/product-size/fetch/${id}`);
};
export const createProductSize = (data) => {
  return axiosPrivate.post(`/product-size/create`, data);
};
export const updateProductSize = (id, data) => {
  return axiosPrivate.patch(`/product-size/update/${id}`, data);
};
export const deleteProductSize = (id) => {
  return axiosPrivate.delete(`/product-size/delete/${id}`);
};

// Product Style APIs
export const getProductStyle = (params = {}) => {
  return axiosPrivate.get(`/product-style/fetch`, { params });
};
export const createProductStyle = (data) => {
  return axiosPrivate.post(`/product-style/create`, data);
};
export const getProductStyleById = (id) => {
  return axiosPrivate.get(`/product-style/fetch/${id}`);
};
export const updateProductStyle = (id, data) => {
  return axiosPrivate.patch(`/product-style/update/${id}`, data);
};
export const deleteProductStyle = (id) => {
  return axiosPrivate.delete(`/product-style/delete/${id}`);
};
export const toggleProductStyle = (id) => {
  return axiosPrivate.patch(`/product-style/toggle/${id}`);
};


export const getOutofStockProducts = (params={}) => {
  return axiosPrivate.get(`/admin/dashboard/fetch/outofstock`, { params });
}

export const updateDailyWearStatus = (id, status) => {
  return axiosPrivate.patch(`/product-variant/update/${id}/status`, { status });
}

export const updateProductVariantStock = (id, stock) => {
  return axiosPrivate.patch(`/product-variant/update-stock/${id}`, { stock });
}