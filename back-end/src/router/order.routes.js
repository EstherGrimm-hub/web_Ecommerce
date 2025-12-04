const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const { verifyToken, checkRole } = require('../middleware/verify_token');

// User routes
router.post("/", verifyToken, orderController.createOrder); // Phải đăng nhập mới đặt được
router.get("/user/history", verifyToken, orderController.getOrdersByUser); // Lấy lịch sử của chính mình
router.post("/:id/cancel", verifyToken, orderController.cancelOrder);
router.get("/:id", verifyToken, orderController.getOrderDetail);

// Admin/Seller routes
router.put("/:id/status", verifyToken, checkRole(['admin', 'seller']), orderController.updateOrderStatus);
router.get("/store/:storeId", verifyToken, checkRole(['seller']), orderController.getOrdersByStore);

module.exports = router;