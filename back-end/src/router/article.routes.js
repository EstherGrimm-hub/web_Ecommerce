const express = require("express");
const router = express.Router();
const articleController = require("../controller/articleController");
const { verifyToken } = require('../middleware/verify_token');
// Định nghĩa các đường dẫn - Gọi sang Controller
router.post("/", articleController.createArticle);             
router.get("/", articleController.getAllArticles);             
router.get("/store/:storeId", articleController.getArticlesByStore); 
router.get("/:id", articleController.getArticleById);          
router.put("/:id", articleController.updateArticle);           
router.delete("/:id", articleController.deleteArticle);        
router.put("/:id/like", verifyToken, articleController.likeArticle);
module.exports = router;