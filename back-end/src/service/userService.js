require('dotenv').config();
const {poolPromise, sql} = require('../config/Sql');



const bcrypt = require('bcrypt');

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const createUserService = async (name,email, phone, address, password,role) =>{
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const pool = await poolPromise;
    const result = await pool.request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("phone", sql.Int, phone)
      .input("address", sql.NVarChar, address)
      .input("password", sql.NVarChar, hashedPassword)
      .input("role", sql.NVarChar, role)
      .query(`
        INSERT INTO Users (name, email, phone, address, password,role)
        VALUES (@name, @email, @phone, @address, @password, @role)
      `);

    return result;
  } catch (err) {
    console.error("SQL Error:", err);
    throw err;
  }
};

const loginUserService = async (email, password) =>{
  try {
    const pool = await poolPromise;
    const userResult = await pool.request()
      .input("email", sql.NVarChar, email)
      .query(`
        select * from Users where email=@email
      `);
    if (userResult.recordset.length === 0) {
      throw new Error("User not found");
    }
    const user = userResult.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid name or password " );
    }

    return { success: true, user };
  } catch (err) {
    console.error("SQL Error:", err);
    throw err;
  }
};


const GetAllUsersService = async () => {
  try {
    const pool = await poolPromise;
    const userResult = await pool.request().query(`select * from Users where role = 'user'`);
     

    return userResult.recordset;
  }catch (err) {
    console.error("SQL Error:", err);
    throw err;
  }
};
const GetAllSellersService = async () => {
  try {
    const pool = await poolPromise;
    const sellersResult = await pool.request().query(`select * from Users where role = 'seller'`);
     
    return sellersResult.recordset;
  }catch (err) {
    console.error("SQL Error:", err);
    throw err;
  }
};

module.exports = { createUserService, loginUserService, GetAllUsersService, GetAllSellersService };