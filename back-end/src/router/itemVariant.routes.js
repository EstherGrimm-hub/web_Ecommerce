const express = require("express");
const router = express.Router();
const itemVariantController = require("../controller/itemVariantController");
const { verifyToken, checkRole } = require('../middleware/verify_token');

// Dedicated item-variant routes (protected)
router.post("/", verifyToken, checkRole(['seller']), itemVariantController.addVariant);
router.put("/:id", verifyToken, checkRole(['seller']), itemVariantController.updateVariant);
router.delete("/:id", verifyToken, checkRole(['seller']), itemVariantController.deleteVariant);

module.exports = router;
