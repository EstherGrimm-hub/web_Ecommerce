const categoryService = require("../service/categoryService");

module.exports = {
    // 1. Tạo mới
    createCategory: async (req, res) => {
        try {
            const userId = req.user.id; // Lấy từ Token
            const { store_id, name } = req.body;

            if (!store_id || !name) {
                return res.status(400).json({ message: "Thiếu thông tin store_id hoặc tên danh mục" });
            }

            const newCategory = await categoryService.createCategoryService(req.body, userId);
            return res.status(201).json({ message: "Tạo danh mục thành công", category: newCategory });
        } catch (err) {
            console.error("Controller Error:", err);
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },

    // 2. Lấy tất cả
    getAllCategories: async (req, res) => {
        try {
            const categories = await categoryService.getAllCategoriesService();
            return res.status(200).json(categories);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // 3. Lấy theo Store
    getCategoriesByStore: async (req, res) => {
        try {
            const { storeId } = req.params;
            if (!storeId) return res.status(400).json({ message: "Thiếu storeId" });

            const categories = await categoryService.getCategoriesByStoreService(storeId);
            return res.status(200).json(categories);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // 4. Lấy chi tiết
    getCategoryById: async (req, res) => {
        try {
            const category = await categoryService.getCategoryByIdService(req.params.id);
            if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });
            return res.status(200).json(category);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // 5. Cập nhật
    updateCategory: async (req, res) => {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            await categoryService.updateCategoryService(id, req.body, userId);
            return res.status(200).json({ message: "Cập nhật thành công" });
        } catch (err) {
            console.error("Controller Error:", err);
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },

    // 6. Xóa
    deleteCategory: async (req, res) => {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            await categoryService.deleteCategoryService(id, userId);
            return res.status(200).json({ message: "Xóa thành công" });
        } catch (err) {
            console.error("Controller Error:", err);
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    }
};