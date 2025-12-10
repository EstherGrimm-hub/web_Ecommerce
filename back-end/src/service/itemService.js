const { poolPromise, sql } = require("../config/Sql");

// =============================
//  HELPER FUNCTIONS
// =============================

// --- HELPER: Kiểm tra quyền sở hữu Store ---
const checkStoreOwnership = async (storeId, userId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, storeId)
        .query("SELECT owner_id FROM Stores WHERE id = @id");

    if (result.recordset.length === 0) return false;
    return result.recordset[0].owner_id === userId;
};

// --- HELPER: Kiểm tra quyền sở hữu Item ---
const checkItemOwnership = async (itemId, userId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, itemId)
        .query(`
            SELECT s.owner_id 
            FROM Items i
            JOIN Stores s ON i.store_id = s.id
            WHERE i.id = @id
        `);

    if (result.recordset.length === 0) return false;
    return result.recordset[0].owner_id === userId;
};

// =============================
//  ITEM SERVICES
// =============================

// 1. Tạo sản phẩm mới
const createItemService = async (data, userId) => {
    try {
        const { store_id, name, description, price, stock, category_id, image } = data;

        // Check quyền
        const isOwner = await checkStoreOwnership(store_id, userId);
        if (!isOwner) throw new Error("Forbidden: Bạn không phải chủ cửa hàng này!");

        const pool = await poolPromise;
        const result = await pool.request()
            .input("store_id", sql.Int, store_id)
            .input("name", sql.NVarChar, name)
            .input("description", sql.NVarChar, description)
            .input("price", sql.Decimal(18, 2), price)
            .input("stock", sql.Int, stock || 0)
            .input("category_id", sql.Int, category_id || null)
            .query(`
                INSERT INTO Items (store_id, name, description, price, stock, category_id)
                OUTPUT INSERTED.*
                VALUES (@store_id, @name, @description, @price, @stock, @category_id)
            `);

        const newItem = result.recordset[0];

        // Nếu có image, thêm vào ItemImages
        if (image) {
            await pool.request()
                .input("item_id", sql.Int, newItem.id)
                .input("image", sql.NVarChar, image)
                .query(`
                    INSERT INTO ItemImages (item_id, image)
                    VALUES (@item_id, @image)
                `);
        }

        return newItem;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 2. Lấy danh sách sản phẩm theo Store (FULL – có variants JSON)
const getItemsByStoreService = async (storeId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("store_id", sql.Int, storeId)
            .query(`
                SELECT 
                    I.*,
                    S.name as store_name,
                    (SELECT TOP 1 image FROM ItemImages WHERE item_id = I.id) AS image,
                    (
                        SELECT * FROM ItemVariants V
                        WHERE V.item_id = I.id
                        FOR JSON PATH
                    ) AS variants
                FROM Items I
                JOIN Stores S ON I.store_id = S.id
                WHERE I.store_id = @store_id
                ORDER BY I.id DESC
            `);

        return result.recordset.map(item => ({
            ...item,
            variants: item.variants ? JSON.parse(item.variants) : []
        }));
    } catch (err) {
        throw new Error(err.message);
    }
};

// 3. Lấy chi tiết Item (kèm Variants và Images)
const getItemDetailService = async (itemId) => {
    try {
        const pool = await poolPromise;

        const itemRes = await pool.request()
            .input("id", sql.Int, itemId)
            .query("SELECT * FROM Items WHERE id = @id");

        if (itemRes.recordset.length === 0) return null;

        const item = itemRes.recordset[0];

        const variantRes = await pool.request()
            .input("item_id", sql.Int, itemId)
            .query("SELECT * FROM ItemVariants WHERE item_id = @item_id");

        const imageRes = await pool.request()
            .input("item_id", sql.Int, itemId)
            .query("SELECT image FROM ItemImages WHERE item_id = @item_id");

        item.variants = variantRes.recordset;
        item.images = imageRes.recordset.map(r => r.image);
        item.image = imageRes.recordset.length > 0 ? imageRes.recordset[0].image : null;
        
        return item;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 4. Cập nhật Item
const updateItemService = async (id, data, userId) => {
    try {
        const isOwner = await checkItemOwnership(id, userId);
        if (!isOwner) throw new Error("Forbidden: Bạn không có quyền sửa sản phẩm này!");

        const { name, description, price, stock, category_id, image } = data;

        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .input("name", sql.NVarChar, name)
            .input("description", sql.NVarChar, description)
            .input("price", sql.Decimal(18, 2), price)
            .input("stock", sql.Int, stock)
            .input("category_id", sql.Int, category_id)
            .query(`
                UPDATE Items
                SET name = @name, description = @description, price = @price,
                    stock = @stock, category_id = @category_id, updatedAt = GETDATE()
                WHERE id = @id
            `);

        // Nếu có image, update hoặc insert vào ItemImages
        if (image) {
            // Xoá ảnh cũ
            await pool.request()
                .input("item_id", sql.Int, id)
                .query("DELETE FROM ItemImages WHERE item_id = @item_id");

            // Thêm ảnh mới
            await pool.request()
                .input("item_id", sql.Int, id)
                .input("image", sql.NVarChar, image)
                .query(`
                    INSERT INTO ItemImages (item_id, image)
                    VALUES (@item_id, @image)
                `);
        }

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 5. Xóa Item
const deleteItemService = async (id, userId) => {
    try {
        const isOwner = await checkItemOwnership(id, userId);
        if (!isOwner) throw new Error("Forbidden: Bạn không có quyền xóa sản phẩm này!");

        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Items WHERE id = @id");

        return true;
    } catch (err) {
        if (err.number === 547) {
            throw new Error("Không thể xóa: Sản phẩm này đã có trong đơn hàng hoặc có biến thể!");
        }
        throw new Error(err.message);
    }
};

// =============================
//  VARIANT SERVICES
// =============================

// 6. Thêm Variant
const addVariantService = async (data, userId) => {
    try {
        const { item_id, size, color, pattern, stock, image } = data;

        const isOwner = await checkItemOwnership(item_id, userId);
        if (!isOwner) throw new Error("Forbidden: Bạn không sở hữu sản phẩm gốc này!");

        const pool = await poolPromise;
        const result = await pool.request()
            .input("item_id", sql.Int, item_id)
            .input("size", sql.NVarChar, size)
            .input("color", sql.NVarChar, color)
            .input("pattern", sql.NVarChar, pattern)
            .input("stock", sql.Int, stock || 0)
            .input("image", sql.NVarChar, image)
            .query(`
                INSERT INTO ItemVariants (item_id, size, color, pattern, stock, image)
                OUTPUT INSERTED.*
                VALUES (@item_id, @size, @color, @pattern, @stock, @image)
            `);

        return result.recordset[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

// 7. Cập nhật Variant
const updateVariantService = async (variantId, data, userId) => {
    try {
        const pool = await poolPromise;

        const checkRes = await pool.request()
            .input("vid", sql.Int, variantId)
            .query(`
                SELECT s.owner_id 
                FROM ItemVariants v
                JOIN Items i ON v.item_id = i.id
                JOIN Stores s ON i.store_id = s.id
                WHERE v.id = @vid
            `);

        if (checkRes.recordset.length === 0) throw new Error("Variant not found");
        if (checkRes.recordset[0].owner_id !== userId) throw new Error("Forbidden");

        const { size, color, stock, image } = data;

        await pool.request()
            .input("id", sql.Int, variantId)
            .input("size", sql.NVarChar, size)
            .input("color", sql.NVarChar, color)
            .input("stock", sql.Int, stock)
            .input("image", sql.NVarChar, image)
            .query(`
                UPDATE ItemVariants
                SET size=@size, color=@color, stock=@stock, image=@image
                WHERE id=@id
            `);

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 8. Xóa Variant
const deleteVariantService = async (variantId, userId) => {
    try {
        const pool = await poolPromise;

        const checkRes = await pool.request()
            .input("vid", sql.Int, variantId)
            .query(`
                SELECT s.owner_id 
                FROM ItemVariants v
                JOIN Items i ON v.item_id = i.id
                JOIN Stores s ON i.store_id = s.id
                WHERE v.id = @vid
            `);

        if (checkRes.recordset.length === 0) throw new Error("Variant not found");
        if (checkRes.recordset[0].owner_id !== userId) throw new Error("Forbidden");

        await pool.request()
            .input("id", sql.Int, variantId)
            .query("DELETE FROM ItemVariants WHERE id=@id");

        return true;
    } catch (err) {
        if (err.number === 547) {
            throw new Error("Không thể xóa: Biến thể này đã có trong đơn hàng!");
        }
        throw new Error(err.message);
    }
};

// =============================
//  CATEGORY & ALL ITEMS
// =============================

// Lấy tất cả Items (có variants JSON)
const getAllItemsService = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                I.*,
                (SELECT TOP 1 image FROM ItemImages WHERE item_id = I.id) as image,
                S.name as store_name,
                (
                    SELECT * FROM ItemVariants V
                    WHERE V.item_id = I.id
                    FOR JSON PATH
                ) AS variants
            FROM Items I
            LEFT JOIN Stores S ON I.store_id = S.id
            ORDER BY I.id DESC
        `);

        return result.recordset.map(item => ({
            ...item,
            variants: item.variants ? JSON.parse(item.variants) : []
        }));
    } catch (err) {
        throw new Error(err.message);
    }
};

// Lấy danh sách Category mà store này đang kinh doanh
const getCategoriesByStoreService = async (storeId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("store_id", sql.Int, storeId)
            .query(`
                SELECT DISTINCT C.id, C.name, C.image
                FROM Categories C
                JOIN Items I ON I.category_id = C.id
                WHERE I.store_id = @store_id
            `);

        return result.recordset;
    } catch (err) {
        return [];
    }
};

// =============================
module.exports = {
    createItemService,
    getItemsByStoreService,
    getItemDetailService,
    updateItemService,
    deleteItemService,

    addVariantService,
    updateVariantService,
    deleteVariantService,

    getAllItemsService,
    getCategoriesByStoreService
};
