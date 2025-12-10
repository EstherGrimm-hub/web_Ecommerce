import instance from "./axios.cusomize";

// ======================
// AUTH
// ======================
const createUserApi = (name, email, phone, address, password, role) => {
    return instance.post("/api/register", {
        name, email, phone, address, password, role
    });
};

const LoginApi = (email, password) => {
    return instance.post("/api/login", { email, password });
};


// ======================
// USER
// ======================
const getUserApi = () => {
    return instance.get("/api/users");
};


// ======================
// SELLER
// ======================
const getSellerApi = () => {
    return instance.get("/api/sellers");
};

const getcheckStoreApi = (userId) => {
    return instance.get(`/api/seller/store/${userId}`);
};


// ======================
// ARTICLES / BLOG
// ======================
const getAllArticlesApi = () => {
    return instance.get("/api/articles");
};

const getArticleDetailApi = (id) => {
    return instance.get(`/api/articles/${id}`);
};

const likeArticleApi = (id) => {
    return instance.put(`/api/articles/${id}/like`);
};


// ======================
// PRODUCTS & CATEGORIES
// ======================
const getAllProductsApi = () => {
    return instance.get("/api/items");
};

const getAllCategoriesApi = () => {
    return instance.get("/api/categories");
};


// ======================
// ORDER (USER)
// ======================
const getUserOrderHistoryApi = () => {
    return instance.get("/api/orders/user/history");
};

const getOrderDetailApi = (orderId) => {
    return instance.get(`/api/orders/${orderId}`);
};

const cancelOrderApi = (orderId) => {
    return instance.post(`/api/orders/${orderId}/cancel`);
};


// ======================
// EXPORT
// ======================
export {
    createUserApi,
    LoginApi,
    getUserApi,
    getSellerApi,
    getcheckStoreApi,

    getAllArticlesApi,
    getArticleDetailApi,
    likeArticleApi,

    getAllProductsApi,
    getAllCategoriesApi,

    getUserOrderHistoryApi,
    getOrderDetailApi,
    cancelOrderApi,
};
