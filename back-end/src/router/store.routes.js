const express = require("express");
const router = express.Router();
const storeController = require("../controller/storeController"); // <-- Đã sửa đường dẫn
const { verifyToken, checkRole } = require('../middleware/verify_token');

router.post("/", storeController.createStore);              // Tạo shop
router.get("/", storeController.getAllStores);              // Lấy list shop
router.get("/:id", storeController.getStoreById);           // Xem chi tiết shop
router.get("/owner/:ownerId", storeController.getStoreByOwner); // Xem shop của user nào đó
router.put("/:id", storeController.updateStore);            // Sửa shop
router.delete("/:id", storeController.deleteStore);         // Xóa shop
router.get("/dashboard/:storeId", verifyToken, checkRole(['seller']), storeController.getDashboardStats);
module.exports = router;