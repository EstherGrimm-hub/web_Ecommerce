const { poolPromise, sql } = require("../config/Sql");

const createVoucherService = async (data) => {
    try {
        const { code, description, discount_type, discount_value, min_order_value, quantity, start_date, end_date } = data;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("code", sql.NVarChar, code.toUpperCase())
            .input("description", sql.NVarChar, description)
            .input("discount_type", sql.NVarChar, discount_type)
            .input("discount_value", sql.Decimal(18, 2), discount_value)
            .input("min_order_value", sql.Decimal(18, 2), min_order_value || 0)
            .input("quantity", sql.Int, quantity || 100)
            .input("start_date", sql.DateTime, start_date || new Date())
            .input("end_date", sql.DateTime, end_date)
            .query(`
                INSERT INTO Vouchers (code, description, discount_type, discount_value, min_order_value, quantity, start_date, end_date)
                OUTPUT INSERTED.*
                VALUES (@code, @description, @discount_type, @discount_value, @min_order_value, @quantity, @start_date, @end_date)
            `);
        return result.recordset[0];
    } catch (err) {
        throw new Error(err.message);
    }
};

const checkVoucherService = async (code, orderTotal) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input("code", sql.NVarChar, code)
        .query("SELECT * FROM Vouchers WHERE code = @code");

    if (result.recordset.length === 0) throw new Error("Voucher not found");
    const voucher = result.recordset[0];

    if (voucher.quantity <= 0) throw new Error("Voucher is out of stock");
    
    const now = new Date();
    if (now < voucher.start_date || now > voucher.end_date) throw new Error("Voucher expired");
    if (orderTotal < voucher.min_order_value) throw new Error(`Order must be at least ${voucher.min_order_value}`);

    let discountAmount = 0;
    if (voucher.discount_type === 'fixed') {
        discountAmount = voucher.discount_value;
    } else {
        discountAmount = (orderTotal * voucher.discount_value) / 100;
    }

    return { 
        valid: true, 
        voucher_id: voucher.id,
        discount_amount: discountAmount,
        final_total: orderTotal - discountAmount 
    };
};

const getAllVouchersService = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Vouchers");
    return result.recordset;
};

// --- BỔ SUNG CÁC HÀM CÒN THIẾU ---

const updateVoucherService = async (id, data) => {
    const { description, min_order_value, quantity, end_date } = data;
    const pool = await poolPromise;
    await pool.request()
        .input("id", sql.Int, id)
        .input("description", sql.NVarChar, description)
        .input("min_order_value", sql.Decimal(18, 2), min_order_value)
        .input("quantity", sql.Int, quantity)
        .input("end_date", sql.DateTime, end_date)
        .query(`
            UPDATE Vouchers
            SET description = @description,
                min_order_value = @min_order_value,
                quantity = @quantity,
                end_date = @end_date,
                updatedAt = GETDATE()
            WHERE id = @id
        `);
    return true;
};

const deleteVoucherService = async (id) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Vouchers WHERE id = @id");
        return true;
    } catch (err) {
        if (err.number === 547) throw new Error("Cannot delete voucher. It has been used in orders.");
        throw new Error(err.message);
    }
};

module.exports = { 
    createVoucherService, 
    checkVoucherService, 
    getAllVouchersService,
    updateVoucherService, // Nhớ export
    deleteVoucherService  // Nhớ export
};