const itemService = require("../service/itemService");
const { poolPromise } = require("../config/Sql");


async function createItem(req, res) {
    try {
        const userId = req.user.id;
        const { store_id, name, price } = req.body;

        if (!store_id || !name || !price)
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

        const newItem = await itemService.createItemService(req.body, userId);
        return res.status(201).json({ message: "Tạo sản phẩm thành công", item: newItem });
    } catch (err) {
        const status = err.message.includes("Forbidden") ? 403 : 500;
        return res.status(status).json({ message: err.message });
    }
}


async function getItemsByStore(req, res) {
    try {
        const items = await itemService.getItemsByStoreService(req.params.storeId);
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


async function getItemDetail(req, res) {
    try {
        const item = await itemService.getItemDetailService(req.params.id);
        if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        return res.status(200).json(item);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


async function updateItem(req, res) {
    try {
        const userId = req.user.id;
        await itemService.updateItemService(req.params.id, req.body, userId);
        return res.status(200).json({ message: "Cập nhật thành công" });
    } catch (err) {
        const status = err.message.includes("Forbidden") ? 403 : 500;
        return res.status(status).json({ message: err.message });
    }
}


async function deleteItem(req, res) {
    try {
        const userId = req.user.id;
        await itemService.deleteItemService(req.params.id, userId);
        return res.status(200).json({ message: "Xóa thành công" });
    } catch (err) {
        const status = err.message.includes("Forbidden") ? 403 : 500;
        return res.status(status).json({ message: err.message });
    }
}


async function addVariant(req, res) {
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
}

async function updateVariant(req, res) {
    try {
        const userId = req.user.id;
        await itemService.updateVariantService(req.params.id, req.body, userId);
        return res.status(200).json({ message: "Cập nhật biến thể thành công" });
    } catch (err) {
        const status = err.message.includes("Forbidden") ? 403 : 500;
        return res.status(status).json({ message: err.message });
    }
}

async function deleteVariant(req, res) {
    try {
        const userId = req.user.id;
        await itemService.deleteVariantService(req.params.id, userId);
        return res.status(200).json({ message: "Xóa biến thể thành công" });
    } catch (err) {
        const status = err.message.includes("Forbidden") ? 403 : 500;
        return res.status(status).json({ message: err.message });
    }
}


async function getAllItems(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Items ");
        return res.json(result.recordset);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports = {
    createItem,
    getItemsByStore,
    getItemDetail,
    updateItem,
    deleteItem,

    addVariant,
    updateVariant,
    deleteVariant,

    getAllItems,
};
