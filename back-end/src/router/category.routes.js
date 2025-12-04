const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const { verifyToken, checkRole } = require('../middleware/verify_token');

// Public: Xem danh mục thì không cần đăng nhập
router.get("/", categoryController.getAllCategories);
router.get("/store/:storeId", categoryController.getCategoriesByStore);
router.get("/:id", categoryController.getCategoryById);

// Protected: Tạo/Sửa/Xóa phải là Seller
router.post("/", verifyToken, checkRole(['seller']), categoryController.createCategory);
router.put("/:id", verifyToken, checkRole(['seller']), categoryController.updateCategory);
router.delete("/:id", verifyToken, checkRole(['seller']), categoryController.deleteCategory);

module.exports = router;