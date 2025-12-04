const { poolPromise, sql } = require("../config/Sql");

// 1. Service: Tạo bài viết
const createArticleService = async (data) => {
    try {
        const { store_id, item_id, title, description, image, isPublished } = data;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("store_id", sql.Int, store_id)
            .input("item_id", sql.BigInt, item_id)
            .input("title", sql.NVarChar, title)
            .input("description", sql.NVarChar, description)
            .input("image", sql.NVarChar, image)
            .input("isPublished", sql.Bit, isPublished || 0)
            .query(`
                INSERT INTO Articles (store_id, item_id, title, description, image, isPublished)
                OUTPUT INSERTED.*
                VALUES (@store_id, @item_id, @title, @description, @image, @isPublished)
            `);
        return result.recordset[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// 2. Service: Lấy tất cả bài viết
const getAllArticlesService = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    A.*,
                    S.name as store_name
                    -- Tạm thời bỏ dòng lấy ảnh store vì bảng Stores không có cột 'image'
                    -- S.image as store_image
                FROM Articles A
                LEFT JOIN Stores S ON A.store_id = S.id
                WHERE A.isPublished = 1 
                ORDER BY A.createdAt DESC
            `);
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 3. Service: Lấy bài viết theo Store
const getArticlesByStoreService = async (storeId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("store_id", sql.Int, storeId)
            .query("SELECT * FROM Articles WHERE store_id = @store_id");
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 4. Service: Lấy chi tiết (Phiên bản an toàn nhất)
const getArticleByIdService = async (id) => {
    try {
        const pool = await poolPromise;
        
        // Tăng view (Giữ nguyên)
        await pool.request()
            .input("id", sql.Int, id)
            .query("UPDATE Articles SET views = views + 1 WHERE id = @id");

        // Lấy chi tiết (ĐOẠN CẦN SỬA)
        const result = await pool.request()
            .input("id_select", sql.Int, id)
            .query(`
                SELECT 
                    A.*, 
                    S.name as store_name, 
                    -- S.image as store_image, -- (Đã comment)
                    
                    I.name as item_name,
                    I.price as item_price
                    
                    -- DÒNG GÂY LỖI: Hãy comment nó lại hoặc sửa thành tên đúng (ví dụ I.image_url)
                    -- , I.image as item_image 
                    
                FROM Articles A
                LEFT JOIN Stores S ON A.store_id = S.id
                LEFT JOIN Items I ON A.item_id = I.id
                WHERE A.id = @id_select
            `);

        return result.recordset[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// 5. Service: Cập nhật bài viết
const updateArticleService = async (id, data) => {
    try {
        const { title, description, image, isPublished, item_id } = data;
        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .input("title", sql.NVarChar, title)
            .input("description", sql.NVarChar, description)
            .input("image", sql.NVarChar, image)
            .input("isPublished", sql.Bit, isPublished)
            .input("item_id", sql.BigInt, item_id)
            .query(`
                UPDATE Articles
                SET title = @title, 
                    description = @description, 
                    image = @image, 
                    isPublished = @isPublished,
                    item_id = @item_id,
                    updatedAt = GETDATE()
                WHERE id = @id
            `);
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 6. Service: Xóa bài viết
const deleteArticleService = async (id) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Articles WHERE id = @id");
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 7. Service: Like bài viết
const likeArticleService = async (articleId, userId) => {
    const pool = await poolPromise;
    
    const articleResult = await pool.request()
        .input("id", sql.Int, articleId)
        .query("SELECT liked_by_users, likes FROM Articles WHERE id = @id");

    if (articleResult.recordset.length === 0) {
        throw new Error("Bài viết không tồn tại");
    }

    const article = articleResult.recordset[0];
    
    let likedUsers = [];
    try {
        likedUsers = JSON.parse(article.liked_by_users || "[]");
    } catch (e) {
        likedUsers = [];
    }

    const userIdInt = parseInt(userId);
    if (likedUsers.includes(userIdInt)) {
        throw new Error("Bạn đã thích bài viết này rồi!");
    }

    likedUsers.push(userIdInt);
    const newLikedJson = JSON.stringify(likedUsers);

    await pool.request()
        .input("id", sql.Int, articleId)
        .input("json", sql.NVarChar, newLikedJson)
        .query(`
            UPDATE Articles 
            SET likes = likes + 1, 
                liked_by_users = @json 
            WHERE id = @id
        `);

    return true;
};

module.exports = {
    createArticleService,
    getAllArticlesService,
    getArticlesByStoreService,
    getArticleByIdService,
    updateArticleService,
    deleteArticleService,
    likeArticleService
};