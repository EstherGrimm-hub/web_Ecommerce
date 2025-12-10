// Thin wrapper service for item variants. Delegates to existing itemService implementations.
const itemService = require("./itemService");




const addVariant =  async (data, userId) => {
        return await itemService.addVariantService(data, userId);
    };
const   updateVariant =  async (id, data, userId) => {
        return await itemService.updateVariantService(id, data, userId);
    };
const  deleteVariant =  async (id, userId) => {
        return await itemService.deleteVariantService(id, userId);
    };


module.exports = {
  addVariant,
  updateVariant,
  deleteVariant 
};