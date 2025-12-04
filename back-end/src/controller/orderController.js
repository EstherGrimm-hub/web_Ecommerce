const orderService = require("../service/orderService");

module.exports = {
    createOrder: async (req, res) => {
        try {
            const userId = req.user.id; // Lấy từ token
            const { items } = req.body;
            if (!items || items.length === 0) return res.status(400).json({ error: "Giỏ hàng trống" });

            const result = await orderService.createOrderService(userId, items);
            res.json({ message: "Đặt hàng thành công", ...result });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getOrdersByUser: async (req, res) => {
        try {
            const userId = req.user.id; // Lấy từ token (Bảo mật hơn lấy từ params)
            const orders = await orderService.getOrdersByUserService(userId);
            res.json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getOrderDetail: async (req, res) => {
        try {
            const userId = req.user.id;
            const order = await orderService.getOrderDetailService(req.params.id, userId);
            if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            res.json(order);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            await orderService.updateOrderStatusService(req.params.id, req.body.status);
            res.json({ message: "Cập nhật trạng thái thành công" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    cancelOrder: async (req, res) => {
        try {
            await orderService.cancelOrderService(req.params.id);
            res.json({ message: "Đã hủy đơn hàng và hoàn tiền kho" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    //Lấy đơn hàng theo Store (Dành cho Seller)
    getOrdersByStore: async (req, res) => {
        try {
            const { storeId } = req.params;
            const orders = await orderService.getOrdersByStoreService(storeId);
            res.json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
