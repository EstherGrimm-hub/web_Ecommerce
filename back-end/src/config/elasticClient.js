const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  // Kết nối HTTP thường
  node: 'http://localhost:9200',
  
  // Bỏ qua xác thực (nếu server đã tắt security)
  auth: undefined,
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = client;