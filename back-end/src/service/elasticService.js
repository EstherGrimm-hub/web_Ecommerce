require('dotenv').config();
const client = require('../config/elasticClient');

const INDEX_NAME = 'items';

// Search items
const searchItemsService = async (keyword) => {
  if (!keyword) return [];

  try {
    const result = await client.search({
      index: INDEX_NAME,
      query: {
        multi_match: {
          query: keyword,
          fields: ["name", "description"]
        }
      },
      size: 10 
    });

    return result.hits.hits.map(h => ({
      id: h._source.id,
      name: h._source.name,
      description: h._source.description,
      price: h._source.price,
      store_id: h._source.store_id,
      category_id: h._source.category_id
    }));
    
  } catch (err) {
    console.error("Elastic search error:", err);
    throw new Error("Elastic search failed");
  }
};

module.exports = { searchItemsService };
