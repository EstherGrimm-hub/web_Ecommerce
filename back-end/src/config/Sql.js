require('dotenv').config();
const sql = require('mssql')
// khi kết nối cần bật SQL Server lên và mở cái tcp/ip trong SQL Server Configuration Manager
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: 'localhost',
  pool: {
    max: 30,
    min: 3,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure 
    trustServerCertificate: true 
  }
}


const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then(pool => {
    console.log("Connected to DB successfully!");
    return pool;
  })
  .catch(err => {
    console.error("ERROR connecting to Database", err);
    process.exit(1); 
  });

module.exports = { sql, poolPromise };