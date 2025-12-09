import instance from "./axios.cusomize";

const createUserApi = (name,email, phone, address, password,role) => {
    const URL = "/api/register";
    const data = {name,email, phone, address, password,role} ;

    return instance.post(URL,data);
}

const LoginApi = (email, password) => {
    const URL = "/api/login";
    const data = {email, password} ;

    return instance.post(URL,data);
}

const getUserApi = () => {
    const URL = "/api/users";
    return instance.get(URL); 
}
const getSellerApi = () => {
    const URL = "/api/sellers";
    return instance.get(URL); 
}

const getcheckStoreApi = (userId) => {
    const URL = `/api/seller/store/${userId}`;
    return instance.get(URL); 
}

// Lấy danh sách bài viết (News Feed)
const getAllArticlesApi = () => {
    return instance.get('/api/articles');
}

// Lấy chi tiết bài viết
const getArticleDetailApi = (id) => {
    return instance.get(`/api/articles/${id}`);
}

// Like bài viết
const likeArticleApi = (id) => {
    return instance.put(`/api/articles/${id}/like`);
}

// Lấy tất cả sản phẩm
const getAllProductsApi = () => {
    return instance.get('/api/items');
}

// Lấy tất cả danh mục
const getAllCategoriesApi = () => {
    return instance.get('/api/categories');
}

// User Order APIs
const getUserOrderHistoryApi = () => {
    return instance.get('/api/orders/user/history');
}

const getOrderDetailApi = (orderId) => {
    return instance.get(`/api/orders/${orderId}`);
}

const cancelOrderApi = (orderId) => {
    return instance.post(`/api/orders/${orderId}/cancel`);
}

export {createUserApi,LoginApi,getUserApi,getSellerApi,getcheckStoreApi,
    getAllArticlesApi, getArticleDetailApi, likeArticleApi, getAllProductsApi, getAllCategoriesApi,
    getUserOrderHistoryApi, getOrderDetailApi, cancelOrderApi
}