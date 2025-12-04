const { poolPromise, sql } = require("../config/Sql");

const createStoreService = async (data) => {
    try {
        const { name, description, store_address, store_phone, owner_id } = data;
        const pool = await poolPromise;

        // Check xem user đã có shop chưa (Logic 1 người 1 shop)
        const check = await pool.request()
            .input("owner_id", sql.Int, owner_id)
            .query("SELECT COUNT(*) as count FROM Stores WHERE owner_id = @owner_id");
        
        if (check.recordset[0].count > 0) throw new Error("User already has a store");

        const result = await pool.request()
            .input("name", sql.NVarChar, name)
            .input("description", sql.NVarChar, description)
            .input("store_address", sql.NVarChar, store_address)
            .input("store_phone", sql.NVarChar, store_phone)
            .input("owner_id", sql.Int, owner_id)
            .query(`
                INSERT INTO Stores (name, description, store_address, store_phone, owner_id)
                OUTPUT INSERTED.*
                VALUES (@name, @description, @store_address, @store_phone, @owner_id)
            `);
        return result.recordset[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

const getAllStoresService = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Stores");
    return result.recordset;
};

const getStoreByIdService = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM Stores WHERE id = @id");
    return result.recordset[0];
};

const getStoreByOwnerService = async (ownerId) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("owner_id", sql.Int, ownerId)
        .query("SELECT * FROM Stores WHERE owner_id = @owner_id");
    return result.recordset;
};

const updateStoreService = async (id, data) => {
    const { name, description, store_address, store_phone } = data;
    const pool = await poolPromise;
    await pool.request()
        .input("id", sql.Int, id)
        .input("name", sql.NVarChar, name)
        .input("description", sql.NVarChar, description)
        .input("store_address", sql.NVarChar, store_address)
        .input("store_phone", sql.NVarChar, store_phone)
        .query(`
            UPDATE Stores
            SET name = @name, description = @description, 
                store_address = @store_address, store_phone = @store_phone, updatedAt = GETDATE()
            WHERE id = @id
        `);
    return true;
};

const deleteStoreService = async (id) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Stores WHERE id = @id");
        return true;
    } catch (err) {
        if (err.number === 547) throw new Error("Cannot delete store (has products/orders)");
        throw new Error(err.message);
    }
};

// 7. Lấy thống kê Dashboard
const getDashboardStatsService = async (storeId) => {
    try {
        const pool = await poolPromise;
        
        // A. Đếm số sản phẩm
        const productRes = await pool.request()
            .input("sid1", sql.Int, storeId)
            .query("SELECT COUNT(*) as count FROM Items WHERE store_id = @sid1");
        
        // B. Đếm số đơn hàng & Tổng doanh thu
        // (Logic: Đơn hàng nào có chứa sản phẩm của Store này)
        const orderRes = await pool.request()
            .input("sid2", sql.Int, storeId)
            .query(`
                SELECT COUNT(DISTINCT o.id) as total_orders, 
                       SUM(oi.subtotal) as total_revenue
                FROM Orders o
                JOIN OrderItems oi ON o.id = oi.order_id
                JOIN Items i ON oi.item_id = i.id
                WHERE i.store_id = @sid2
            `);

        return {
            total_products: productRes.recordset[0].count,
            total_orders: orderRes.recordset[0].total_orders,
            total_revenue: orderRes.recordset[0].total_revenue || 0
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = {
    createStoreService, 
    getAllStoresService, 
    getStoreByIdService, 
    getStoreByOwnerService, 
    updateStoreService, 
    deleteStoreService,
    getDashboardStatsService
};