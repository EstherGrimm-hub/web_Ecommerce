const { searchItemsService } = require('../service/elasticService');

const searchItems = async (req, res) => {
  const { keyword } = req.query;
  try {
    const results = await searchItemsService(keyword);
    // console.log("Search results check >>>>>>>>>>>>>>>>>>>>>>>>>:", results);
    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Search failed" });
  }
};

module.exports = { searchItems };
