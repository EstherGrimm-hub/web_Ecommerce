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

// ============ VARIANTS (ĐÃ SỬA LỖI DUPLICATE EXPORT) ============
// 1. Thêm biến thể mới (Bỏ chữ 'export' ở đây)
const addVariantApi = (data) => {
    return instance.post("/api/items/variant", data);
};

// 2. Cập nhật biến thể (Bỏ chữ 'export' ở đây)
const updateVariantApi = (id, data) => {
    return instance.put(`/api/items/variant/${id}`, data);
};

// 3. Xóa biến thể (Bỏ chữ 'export' ở đây)
const deleteVariantApi = (id) => {
    return instance.delete(`/api/items/variant/${id}`);
};

// ================= CATEGORIES =================

// GET categories by store
const getCategoriesByStoreApi = (storeId) => {
  const URL = `/api/categories/store/${storeId}`; 
  return instance.get(URL);
}

// CREATE category
const createCategoryApi = (data) => {  
  const URL = `/api/categories`;
  return instance.post(URL, data); 
}

// UPDATE category
const updateCategoryApi = (id, data) => {
  const URL = `/api/categories/${id}`;
  return instance.put(URL, data);
}

// DELETE category
const deleteCategoryApi = (id) => {
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

const getArticleDetailApi = (id) => {
  return instance.get(`/api/articles/${id}`);
}

const updateArticleApi = (id, data) => {
  return instance.put(`/api/articles/${id}`, data);
}

// Xuất khẩu chung ở cuối file
export {
  getItemsByStoreApi,
  createItemApi,
  updateItemApi,
  deleteItemApi,
  getItemDetailApi,
  
  // Variants (Đã khai báo bên trên, giờ export ở đây là đúng chuẩn)
  addVariantApi,
  updateVariantApi,
  deleteVariantApi,

  // Categories
  getCategoriesByStoreApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,

  // Orders
  getOrdersByStoreApi,
  updateOrderStatusApi,

  // Articles
  getArticlesByStoreApi, 
  createArticleApi, 
  deleteArticleApi,
  getArticleDetailApi,
  updateArticleApi
};