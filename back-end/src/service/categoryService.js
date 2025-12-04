const { poolPromise, sql } = require("../config/Sql");

// --- HÀM PHỤ: Kiểm tra quyền sở hữu Store ---
const checkStoreOwnership = async (storeId, userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, storeId)
            .query("SELECT owner_id FROM Stores WHERE id = @id");
        
        if (result.recordset.length === 0) return false; 
        return result.recordset[0].owner_id === userId;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 1. Service: Tạo danh mục mới
const createCategoryService = async (data, userId) => {
    try {
        const { store_id, name, description, parent_id, image } = data;

        // Bảo mật: Check xem user có phải chủ shop không
        const isOwner = await checkStoreOwnership(store_id, userId);
        if (!isOwner) throw new Error("Forbidden: Bạn không phải chủ cửa hàng này!");

        const pool = await poolPromise;
        const result = await pool.request()
            .input("store_id", sql.Int, store_id)
            .input("name", sql.NVarChar, name)
            .input("description", sql.NVarChar, description)
            .input("parent_id", sql.Int, parent_id || null)
            .input("image", sql.NVarChar, image)
            .query(`
                INSERT INTO Categories (store_id, name, description, parent_id, image)
                OUTPUT INSERTED.*
                VALUES (@store_id, @name, @description, @parent_id, @image)
            `);
        return result.recordset[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// 2. Service: Lấy tất cả (Admin dùng)
const getAllCategoriesService = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Categories");
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 3. Service: Lấy theo Store (Seller dùng)
const getCategoriesByStoreService = async (storeId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("store_id", sql.Int, storeId)
            .query("SELECT * FROM Categories WHERE store_id = @store_id ORDER BY id DESC");
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 4. Service: Lấy chi tiết
const getCategoryByIdService = async (id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM Categories WHERE id = @id");
        return result.recordset[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// 5. Service: Cập nhật (Có check quyền)
const updateCategoryService = async (id, data, userId) => {
    try {
        const { store_id, name, description, parent_id, image } = data;

        // Bảo mật
        const isOwner = await checkStoreOwnership(store_id, userId);
        if (!isOwner) throw new Error("Forbidden: Bạn không có quyền sửa danh mục này!");

        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .input("name", sql.NVarChar, name)
            .input("description", sql.NVarChar, description)
            .input("parent_id", sql.Int, parent_id || null)
            .input("image", sql.NVarChar, image)
            .query(`
                UPDATE Categories
                SET name = @name, 
                    description = @description, 
                    parent_id = @parent_id, 
                    image = @image, 
                    updatedAt = GETDATE()
                WHERE id = @id
            `);
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 6. Service: Xóa (Có check quyền)
const deleteCategoryService = async (id, userId) => {
    try {
        const pool = await poolPromise;

        // Lấy store_id của category này để check quyền sở hữu
        const catCheck = await pool.request()
            .input("cat_id", sql.Int, id)
            .query("SELECT store_id FROM Categories WHERE id = @cat_id");
        
        if (catCheck.recordset.length === 0) throw new Error("Category not found");
        
        const storeId = catCheck.recordset[0].store_id;
        const isOwner = await checkStoreOwnership(storeId, userId);
        
        if (!isOwner) throw new Error("Forbidden: Bạn không có quyền xóa danh mục này!");

        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Categories WHERE id = @id");
        return true;
    } catch (err) {
        if (err.number === 547) {
            throw new Error("Không thể xóa: Danh mục này đang chứa sản phẩm hoặc danh mục con!");
        }
        throw new Error(err.message);
    }
};

module.exports = {
    createCategoryService,
    getAllCategoriesService,
    getCategoriesByStoreService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService
};