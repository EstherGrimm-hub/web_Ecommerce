const itemVariantService = require("../service/itemVariantService");

module.exports = {
    addVariant: async (req, res) => {
        try {
            const userId = req.user.id;
            const variant = await itemVariantService.addVariant(req.body, userId);
            return res.status(201).json({ message: "Thêm biến thể thành công", variant });
        } catch (err) {
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },

    updateVariant: async (req, res) => {
        try {
            const userId = req.user.id;
            await itemVariantService.updateVariant(req.params.id, req.body, userId);
            return res.status(200).json({ message: "Cập nhật biến thể thành công" });
        } catch (err) {
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    },

    deleteVariant: async (req, res) => {
        try {
            const userId = req.user.id;
            await itemVariantService.deleteVariant(req.params.id, userId);
            return res.status(200).json({ message: "Xóa biến thể thành công" });
        } catch (err) {
            const status = err.message.includes("Forbidden") ? 403 : 500;
            return res.status(status).json({ message: err.message });
        }
    }
};