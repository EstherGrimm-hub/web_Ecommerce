const client = require('../config/elasticClient');

const INDEX_NAME = 'items';

async function createIndex() {
  try {
    // 1. Kiểm tra index tồn tại
    const exists = await client.indices.exists({ index: INDEX_NAME });

    // 2. Sửa đoạn này: Bỏ ".body" đi
    if (!exists) { 
      await client.indices.create({
        index: INDEX_NAME,
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: { type: 'text' },
              description: { type: 'text' },
              price: { type: 'float' },
              store_id: { type: 'integer' },
              category_id: { type: 'integer' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' }
            }
          }
        }
      });
      console.log('Elasticsearch: Index "items" created successfully.');
    } else {
      console.log('Elasticsearch: Index "items" already exists. Skipping...');
    }
  } catch (err) {
    console.error('Error checking/creating index:', err);
  }
}

module.exports = { createIndex };