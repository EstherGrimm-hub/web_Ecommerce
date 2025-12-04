const { poolPromise, sql } = require("../config/Sql");

// 1. Tạo đơn hàng (PHIÊN BẢN AN TOÀN & BẢO MẬT)
const createOrderService = async (userId, itemsPayload) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    
    try {
        await transaction.begin();

        // BƯỚC 1: Validate dữ liệu & Tính tổng tiền từ Database (KHÔNG TIN FRONTEND)
        let total_amount = 0;
        const validItems = [];

        for (const item of itemsPayload) {
            // Lấy thông tin giá và tồn kho thực tế từ DB
            let dbItem;
            
            if (item.variant_id) {
                // Trường hợp mua Biến thể (Size/Màu)
                const res = await new sql.Request(transaction)
                    .input("item_id", sql.Int, item.item_id)
                    .input("variant_id", sql.Int, item.variant_id)
                    .query(`
                        SELECT i.price, i.name, v.stock 
                        FROM Items i
                        JOIN ItemVariants v ON i.id = v.item_id
                        WHERE i.id = @item_id AND v.id = @variant_id
                    `);
                dbItem = res.recordset[0];
            } else {
                // Trường hợp mua Sản phẩm thường (Không biến thể)
                const res = await new sql.Request(transaction)
                    .input("item_id", sql.Int, item.item_id)
                    .query(`
                        SELECT price, name, stock 
                        FROM Items 
                        WHERE id = @item_id
                    `);
                dbItem = res.recordset[0];
            }

            // Kiểm tra sản phẩm có tồn tại không
            if (!dbItem) {
                throw new Error(`Sản phẩm ID ${item.item_id} (Variant: ${item.variant_id}) không tồn tại`);
            }

            // KIỂM TRA TỒN KHO
            if (dbItem.stock < item.quantity) {
                throw new Error(`Sản phẩm "${dbItem.name}" không đủ hàng (Còn: ${dbItem.stock})`);
            }

            // Tính tiền bằng giá trong DB (An toàn tuyệt đối)
            const lineTotal = dbItem.price * item.quantity;
            total_amount += lineTotal;

            // Lưu vào danh sách sạch để lát insert
            validItems.push({
                ...item,
                price: dbItem.price, // Ghi đè giá từ DB vào
                subtotal: lineTotal
            });
        }

        const final_amount = total_amount; // Nếu có logic voucher thì tính thêm ở đây

        // BƯỚC 2: Tạo Order
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

        // BƯỚC 3: Tạo OrderItems & Trừ kho
        for (const item of validItems) {
            const itemRequest = new sql.Request(transaction);
            await itemRequest
                .input("order_id", sql.Int, newOrderId)
                .input("item_id", sql.Int, item.item_id)
                .input("variant_id", sql.Int, item.variant_id || null)
                .input("quantity", sql.Int, item.quantity)
                .input("price", sql.Decimal(18, 2), item.price)
                .input("subtotal", sql.Decimal(18, 2), item.subtotal)
                .query(`
                    -- Lưu chi tiết đơn
                    INSERT INTO OrderItems (order_id, item_id, variant_id, quantity, price, subtotal)
                    VALUES (@order_id, @item_id, @variant_id, @quantity, @price, @subtotal);

                    -- Trừ kho (Logic: Nếu có variant thì trừ variant, không thì trừ item gốc)
                    IF @variant_id IS NOT NULL
                    BEGIN
                        UPDATE ItemVariants SET stock = stock - @quantity WHERE id = @variant_id;
                    END
                    ELSE
                    BEGIN
                        UPDATE Items SET stock = stock - @quantity WHERE id = @item_id;
                    END
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