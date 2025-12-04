require('dotenv').config();
const client = require('../config/elasticClient');
const { poolPromise } = require('../config/Sql');

const INDEX_NAME = 'items';

async function syncItems() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Items');

    for (let item of result.recordset) {
      await client.index({
        index: INDEX_NAME,
        id: item.id,
        body: {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          store_id: item.storeId,
          category_id: item.category,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }
      });
    }

    console.log('All items synced to Elasticsearch!');
  } catch (err) {
    console.error('Error syncing items:', err);
  }
}

module.exports = { syncItems };
