const { poolPromise, sql } = require("../config/Sql");


const getItemsWithFeatures = async () => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT 
                i.id AS item_id, 
                i.name, 
                i.category_id, 
                i.price
            FROM Items i
        `);

        const itemsRaw = result.recordset;
        if (!itemsRaw.length) return [];

        const categories = [...new Set(itemsRaw.map(i => i.category_id))];
        const maxPrice = Math.max(...itemsRaw.map(i => i.price));

        const encodeItem = (item) => {
            const categoryVec = categories.map(c => (c === item.category_id ? 1 : 0));
            const priceNorm = [item.price / maxPrice];
            return [...categoryVec, ...priceNorm];
        };

        return itemsRaw.map(item => ({
            id: item.item_id,
            name: item.name,
            category_id: item.category_id,
            price: item.price,
            features: encodeItem(item)
        }));

    } catch (err) {
        console.error("Error getting items:", err);
        return [];
    }
};


// Lấy lịch sử user
const getUserHistory = async (userId) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query(`
                SELECT oi.item_id
                FROM Orders o
                JOIN OrderItems oi ON o.id = oi.order_id
                WHERE o.user_id = @userId
            `);
        return result.recordset.map(r => r.item_id);
    } catch (err) {
        console.error("Error getting user history:", err);
        return [];
    }
};

module.exports = { getItemsWithFeatures, getUserHistory };
