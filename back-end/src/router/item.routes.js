const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemController");
const { verifyToken, checkRole } = require('../middleware/verify_token');

// Public: Ai cũng xem được
router.get("/", itemController.getAllItems); // GET /api/items -> Lấy tất cả
router.get("/store/:storeId", itemController.getItemsByStore);
router.get("/:id", itemController.getItemDetail);       
router.get("/store/:storeId/categories", itemController.getCategoriesByStore);
// Protected: Chỉ Seller mới được làm
router.post("/", verifyToken, checkRole(['seller']), itemController.createItem);            
router.put("/:id", verifyToken, checkRole(['seller']), itemController.updateItem);    
router.delete("/:id", verifyToken, checkRole(['seller']), itemController.deleteItem);

// Variant Routes (Protected)
router.post("/variant", verifyToken, checkRole(['seller']), itemController.addVariant);        
router.put("/variant/:id", verifyToken, checkRole(['seller']), itemController.updateVariant);  
router.delete("/variant/:id", verifyToken, checkRole(['seller']), itemController.deleteVariant); 

module.exports = router;