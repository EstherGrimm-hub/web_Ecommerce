const { poolPromise, sql } = require("../config/Sql");

// 1. Tạo đơn hàng (Có Transaction)
const createOrderService = async (userId, items) => {
    // Tính tổng tiền
    let total_amount = 0;
    items.forEach(item => {
        total_amount += item.price * item.quantity;
    });
    let final_amount = total_amount; // Chưa tính voucher (sẽ tính ở API khác hoặc update sau)

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    
    try {
        await transaction.begin();

        // A. Insert Order
        const orderRequest = new sql.Request(transaction);
        const orderResult = await orderRequest
            .input("user_id", sql.Int, userId)
            .input("total_amount", sql.Decimal(18, 2), total_amount)
            .input("final_amount", sql.Decimal(18, 2), final_amount)
            .query(`
                INSERT INTO Orders (user_id, total_amount, final_amount, status)
                OUTPUT INSERTED.id
                VALUES (@user_id, @total_amount, @final_amount, 'pending')
            `);
        
        const newOrderId = orderResult.recordset[0].id;

        // B. Insert Order Items & Trừ kho (Tùy chọn: Ở đây chỉ lưu item, trừ kho có thể làm trigger hoặc code riêng)
        // Trong code cũ bạn chưa trừ kho khi đặt, chỉ cộng kho khi hủy. 
        // Tốt nhất là TRỪ KHO ngay khi đặt.
        for (const item of items) {
            const itemRequest = new sql.Request(transaction);
            await itemRequest
                .input("order_id", sql.Int, newOrderId)
                .input("item_id", sql.Int, item.item_id)
                .input("variant_id", sql.Int, item.variant_id || null)
                .input("quantity", sql.Int, item.quantity)
                .input("price", sql.Decimal(18, 2), item.price)
                .input("subtotal", sql.Decimal(18, 2), item.price * item.quantity)
                .query(`
                    INSERT INTO OrderItems (order_id, item_id, variant_id, quantity, price, subtotal)
                    VALUES (@order_id, @item_id, @variant_id, @quantity, @price, @subtotal);

                    -- Trừ kho ItemVariants (nếu có)
                    IF @variant_id IS NOT NULL
                        UPDATE ItemVariants SET stock = stock - @quantity WHERE id = @variant_id;
                    
                    -- Trừ kho Items gốc
                    UPDATE Items SET stock = stock - @quantity WHERE id = @item_id;
                `);
        }

        await transaction.commit();
        return { order_id: newOrderId, total: total_amount };

    } catch (err) {
        await transaction.rollback();
        throw new Error(err.message);
    }
};

// 2. Lấy lịch sử mua hàng
const getOrdersByUserService = async (userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("user_id", sql.Int, userId)
            .query("SELECT * FROM Orders WHERE user_id = @user_id ORDER BY createdAt DESC");
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 3. Xem chi tiết đơn
const getOrderDetailService = async (orderId, userId) => { // userId để check quyền xem
    try {
        const pool = await poolPromise;
        
        // Lấy thông tin chung
        const orderResult = await pool.request()
            .input("id", sql.Int, orderId)
            .query("SELECT * FROM Orders WHERE id = @id");

        if (orderResult.recordset.length === 0) return null;
        const order = orderResult.recordset[0];

        // Check quyền (Chỉ chủ đơn hoặc Admin/Seller mới được xem - tạm thời check chủ đơn)
        // if (order.user_id !== userId) throw new Error("Forbidden"); 

        // Lấy chi tiết món
        const itemsResult = await pool.request()
            .input("order_id", sql.Int, orderId)
            .query(`
                SELECT oi.*, i.name as item_name, i.image as item_image 
                FROM OrderItems oi
                JOIN Items i ON oi.item_id = i.id
                WHERE oi.order_id = @order_id
            `);

        order.items = itemsResult.recordset;
        return order;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 4. Update Status
const updateOrderStatusService = async (id, status) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .input("status", sql.NVarChar, status)
            .query("UPDATE Orders SET status = @status, updatedAt = GETDATE() WHERE id = @id");
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
};

// 5. Hủy đơn (Hoàn kho)
const cancelOrderService = async (orderId) => {
    const pool = await poolPromise;
    
    // Check trạng thái trước
    const check = await pool.request().input("id", sql.Int, orderId).query("SELECT status FROM Orders WHERE id = @id");
    if (check.recordset.length === 0) throw new Error("Order not found");
    const status = check.recordset[0].status;
    if (status === 'cancelled' || status === 'shipped' || status === 'completed') {
        throw new Error(`Cannot cancel order with status: ${status}`);
    }

    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();

        // Lấy items để hoàn kho
        const itemsRequest = new sql.Request(transaction);
        const itemsResult = await itemsRequest
            .input("order_id", sql.Int, orderId)
            .query("SELECT * FROM OrderItems WHERE order_id = @order_id");
        
        for (const item of itemsResult.recordset) {
            // Hoàn kho Variant
            if (item.variant_id) {
                await new sql.Request(transaction)
                    .input("qty", sql.Int, item.quantity)
                    .input("id", sql.Int, item.variant_id)
                    .query("UPDATE ItemVariants SET stock = stock + @qty WHERE id = @id");
            }
            // Hoàn kho Item gốc
            await new sql.Request(transaction)
                .input("qty", sql.Int, item.quantity)
                .input("id", sql.Int, item.item_id)
                .query("UPDATE Items SET stock = stock + @qty WHERE id = @id");
        }

        // Update status
        await new sql.Request(transaction)
            .input("id", sql.Int, orderId)
            .query("UPDATE Orders SET status = 'cancelled', updatedAt = GETDATE() WHERE id = @id");

        await transaction.commit();
        return true;
    } catch (err) {
        await transaction.rollback();
        throw new Error(err.message);
    }
};
// 6. Lấy danh sách đơn hàng của 1 Store
const getOrdersByStoreService = async (storeId) => {
    try {
        const pool = await poolPromise;
        // Logic: Lấy các đơn hàng có chứa sản phẩm thuộc store_id này
        // Dùng DISTINCT để tránh trùng lặp nếu 1 đơn mua nhiều món của cùng 1 shop
        const result = await pool.request()
            .input("store_id", sql.Int, storeId)
            .query(`
                SELECT DISTINCT o.id, o.user_id, u.name as user_name, o.total_amount, o.status, o.createdAt
                FROM Orders o
                JOIN OrderItems oi ON o.id = oi.order_id
                JOIN Items i ON oi.item_id = i.id
                JOIN Users u ON o.user_id = u.id
                WHERE i.store_id = @store_id
                ORDER BY o.createdAt DESC
            `);
        return result.recordset;
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = {
    // ... export các hàm cũ
    createOrderService,
    getOrdersByUserService,
    getOrderDetailService,
    updateOrderStatusService,
    cancelOrderService,
    getOrdersByStoreService // <--- Thêm cái mới này vào
};