const storeService = require("../service/storeService");

module.exports = {
    createStore: async (req, res) => {
        try {
            const { name, owner_id } = req.body;
            if (!name || !owner_id) return res.status(400).json({ error: "Missing name or owner_id" });

            const store = await storeService.createStoreService(req.body);
            res.json({ message: "Tạo cửa hàng thành công", store });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getAllStores: async (req, res) => {
        try {
            const stores = await storeService.getAllStoresService();
            res.json(stores);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getStoreById: async (req, res) => {
        try {
            const store = await storeService.getStoreByIdService(req.params.id);
            if (!store) return res.status(404).json({ message: "Store not found" });
            res.json(store);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getStoreByOwner: async (req, res) => {
        try {
            const stores = await storeService.getStoreByOwnerService(req.params.ownerId);
            res.json(stores);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateStore: async (req, res) => {
        try {
            await storeService.updateStoreService(req.params.id, req.body);
            res.json({ message: "Cập nhật thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deleteStore: async (req, res) => {
        try {
            await storeService.deleteStoreService(req.params.id);
            res.json({ message: "Xóa thành công" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getDashboardStats: async (req, res) => {
        try {
            const stats = await storeService.getDashboardStatsService(req.params.storeId);
            res.json(stats);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};