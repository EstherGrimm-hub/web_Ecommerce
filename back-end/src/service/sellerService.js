require('dotenv').config();
const {poolPromise, sql} = require('../config/Sql');

const CreateStoreService = async (storeName, sellerId, description,storeAddress,storePhone) =>{
    try {
        const checkStore = await pool.request()
            .input('sellerId', sellerId)
            .query('SELECT * FROM Stores WHERE owner_id = @sellerId');

        if (checkStore.recordset.length > 0) {
            return { success: false, message: 'Seller đã có store rồi!' };
        }

        const result = await pool.request()
            .input('name', storeName)
            .input('owner_id', sellerId)
            .input('description', description || '')
            .input('store_address', storeAddress || '')
            .input('store_phone', storePhone || '')
            .query(`
                INSERT INTO Stores (name, owner_id, description, store_address, store_phone)
                VALUES (@name, @owner_id, @description, @store_address, @store_phone);
                SELECT SCOPE_IDENTITY() AS storeId;
            `);

        return { success: true, storeId: result.recordset[0].storeId };
    } catch (err) {
        console.error("SQL Error:", err);
        throw err;
    }
}


const checkStoreService = async (sellerId) => {
    try {
        if (!sellerId) throw new Error("Missing sellerId");

        const sellerIdInt = parseInt(sellerId.toString().trim(), 10);
        if (isNaN(sellerIdInt)) throw new Error("Invalid sellerId");

        const pool = await poolPromise;
        const result = await pool.request()
            .input('sellerId', sql.Int, sellerIdInt)
            .query('SELECT * FROM Stores WHERE owner_id = @sellerId');

        if (result.recordset.length === 0) return null; 
        return result.recordset[0]; 
    } catch (err) {
        console.error("SQL Error:", err);
        throw err;
    }
};



module.exports = {CreateStoreService , checkStoreService    };