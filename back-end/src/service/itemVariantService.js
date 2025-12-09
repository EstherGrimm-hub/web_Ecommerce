// Thin wrapper service for item variants. Delegates to existing itemService implementations.
const itemService = require("./itemService");

module.exports = {
    addVariant: async (data, userId) => {
        return await itemService.addVariantService(data, userId);
    },
    updateVariant: async (id, data, userId) => {
        return await itemService.updateVariantService(id, data, userId);
    },
    deleteVariant: async (id, userId) => {
        return await itemService.deleteVariantService(id, userId);
    }
};
