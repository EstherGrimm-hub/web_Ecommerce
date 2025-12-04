import instance from "./axios.cusomize";

// ================= ITEMS =================
// GET all items by store
const getItemsByStoreApi = (storeId) => {
  const URL = `/api/items/store/${storeId}`;
  return instance.get(URL);
};

// CREATE item
const createItemApi = (data) => {
  const URL = `/api/items`;
  return instance.post(URL, data);
};

// UPDATE item
const updateItemApi = (itemId, data) => {
  const URL = `/api/items/${itemId}`;
  return instance.put(URL, data);
};

// DELETE item
const deleteItemApi = (itemId) => {
  const URL = `/api/items/${itemId}`;
  return instance.delete(URL);
};
// Thêm hàm lấy chi tiết Item cho Seller
const getItemDetailApi = (id) => {
  return instance.get(`/api/items/${id}`);
}

// ================= CATEGORIES =================

// GET categories by store
const getCategoriesByStoreApi = (storeId) => {
  // Backend route: GET /api/categories/store/:storeId
  const URL = `/api/categories/store/${storeId}`; 
  return instance.get(URL);
}

// CREATE category
const createCategoryApi = (data) => {  
  // Backend route: POST /api/categories
  const URL = `/api/categories`;
  return instance.post(URL, data); 
}

// UPDATE category
const updateCategoryApi = (id, data) => {
  // Backend route: PUT /api/categories/:id
  const URL = `/api/categories/${id}`;
  return instance.put(URL, data);
}

// DELETE category
const deleteCategoryApi = (id) => {
  // Backend route: DELETE /api/categories/:id
  const URL = `/api/categories/${id}`;
  return instance.delete(URL);
}

// Lấy danh sách đơn hàng của Shop
const getOrdersByStoreApi = (storeId) => {
  return instance.get(`/api/orders/store/${storeId}`);
}

// Cập nhật trạng thái đơn (Duyệt đơn/Giao hàng)
const updateOrderStatusApi = (orderId, status) => {
  return instance.put(`/api/orders/${orderId}/status`, { status });
}

// ================= ARTICLES =================
const getArticlesByStoreApi = (storeId) => {
  return instance.get(`/api/articles/store/${storeId}`);
}

const createArticleApi = (data) => {
  return instance.post(`/api/articles`, data);
}

const deleteArticleApi = (id) => {
  return instance.delete(`/api/articles/${id}`);
}
// Thêm hàm lấy chi tiết Article cho Seller
const getArticleDetailApi = (id) => {
  return instance.get(`/api/articles/${id}`);
}
const updateArticleApi = (id, data) => {
  return instance.put(`/api/articles/${id}`, data);
}
export {
  getItemsByStoreApi,
  createItemApi,
  updateItemApi,
  deleteItemApi,
  getCategoriesByStoreApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  getOrdersByStoreApi,
  updateOrderStatusApi,
  getArticlesByStoreApi, 
  createArticleApi, 
  deleteArticleApi,
  getItemDetailApi, 
  getArticleDetailApi,
  updateArticleApi
};