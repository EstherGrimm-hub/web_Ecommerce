import instance from "./axios.cusomize";

// ================= ITEMS =================
const getItemsByStoreApi = (storeId) => {
  return instance.get(`/api/items/store/${storeId}`);
};

const createItemApi = (data) => {
  return instance.post(`/api/items`, data);
};

const updateItemApi = (itemId, data) => {
  return instance.put(`/api/items/${itemId}`, data);
};

const deleteItemApi = (itemId) => {
  return instance.delete(`/api/items/${itemId}`);
};

const getItemDetailApi = (id) => {
  return instance.get(`/api/items/${id}`);
};

// ================= VARIANTS =================
const addVariantApi = (data) => {
  return instance.post(`/api/items/variant`, data);
};

const updateVariantApi = (id, data) => {
  return instance.put(`/api/items/variant/${id}`, data);
};

const deleteVariantApi = (id) => {
  return instance.delete(`/api/items/variant/${id}`);
};

// ================= CATEGORIES =================
const getCategoriesByStoreApi = (storeId) => {
  return instance.get(`/api/categories/store/${storeId}`);
};

const createCategoryApi = (data) => {
  return instance.post(`/api/categories`, data);
};

const updateCategoryApi = (id, data) => {
  return instance.put(`/api/categories/${id}`, data);
};

const deleteCategoryApi = (id) => {
  return instance.delete(`/api/categories/${id}`);
};

// ================= ORDERS =================
const getOrdersByStoreApi = (storeId) => {
  return instance.get(`/api/orders/store/${storeId}`);
};

const updateOrderStatusApi = (orderId, status) => {
  return instance.put(`/api/orders/${orderId}/status`, { status });
};

// ================= ARTICLES =================
const getArticlesByStoreApi = (storeId) => {
  return instance.get(`/api/articles/store/${storeId}`);
};

const createArticleApi = (data) => {
  return instance.post(`/api/articles`, data);
};

const deleteArticleApi = (id) => {
  return instance.delete(`/api/articles/${id}`);
};

const getArticleDetailApi = (id) => {
  return instance.get(`/api/articles/${id}`);
};

const updateArticleApi = (id, data) => {
  return instance.put(`/api/articles/${id}`, data);
};

// ================= EXPORT =================
export {
  getItemsByStoreApi,
  createItemApi,
  updateItemApi,
  deleteItemApi,
  getItemDetailApi,

  addVariantApi,
  updateVariantApi,
  deleteVariantApi,

  getCategoriesByStoreApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,

  getOrdersByStoreApi,
  updateOrderStatusApi,

  getArticlesByStoreApi,
  createArticleApi,
  deleteArticleApi,
  getArticleDetailApi,
  updateArticleApi,
};
