const itemService = require("../service/itemService");

module.exports = {
    // 1. Tạo SP
    createItem: async (req, res) => {
        try {
            const userId = req.user.id;
            const { store_id, name, price } = req.body;
            if (!store_id || !name || !price) return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

            const newItem = await itemService.createItemService(req.body, userId);
            return res.status(201).json({ message: "Tạo sản phẩm thành công", item: newItem });
        } catch (err) {
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },

    // 2. Lấy theo Store
    getItemsByStore: async (req, res) => {
        try {
            const items = await itemService.getItemsByStoreService(req.params.storeId);
            return res.status(200).json(items);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // 3. Chi tiết SP
    getItemDetail: async (req, res) => {
        try {
            const item = await itemService.getItemDetailService(req.params.id);
            if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            return res.status(200).json(item);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    // 4. Update SP
    updateItem: async (req, res) => {
        try {
            const userId = req.user.id;
            await itemService.updateItemService(req.params.id, req.body, userId);
            return res.status(200).json({ message: "Cập nhật thành công" });
        } catch (err) {
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },

    // 5. Delete SP
    deleteItem: async (req, res) => {
        try {
            const userId = req.user.id;
            await itemService.deleteItemService(req.params.id, userId);
            return res.status(200).json({ message: "Xóa thành công" });
        } catch (err) {
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },

    // --- VARIANT CONTROLLERS ---

    addVariant: async (req, res) => {
        try {
            const userId = req.user.id;
            const { item_id } = req.body;
            if (!item_id) return res.status(400).json({ message: "Thiếu item_id" });

            const variant = await itemService.addVariantService(req.body, userId);
            return res.status(201).json({ message: "Thêm biến thể thành công", variant });
        } catch (err) {
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },

    updateVariant: async (req, res) => {
        try {
            const userId = req.user.id;
            await itemService.updateVariantService(req.params.id, req.body, userId);
            return res.status(200).json({ message: "Cập nhật biến thể thành công" });
        } catch (err) {
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },

    deleteVariant: async (req, res) => {
        try {
            const userId = req.user.id;
            await itemService.deleteVariantService(req.params.id, userId);
            return res.status(200).json({ message: "Xóa biến thể thành công" });
        } catch (err) {
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },
    getAllItems: async (req, res) => {
        try {
            // Gọi qua Service chứ không gọi trực tiếp poolPromise nữa
            const items = await itemService.getAllItemsService();
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getCategoriesByStore: async (req, res) => {
        try {
            const categories = await itemService.getCategoriesByStoreService(req.params.storeId);
            return res.status(200).json(categories);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
};