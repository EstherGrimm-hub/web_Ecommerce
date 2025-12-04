const articleService = require("../service/articleService"); // Import Service

module.exports = {
    // 1. Create (Đã sửa để item_id là tùy chọn)
    createArticle: async (req, res) => {
        try {
            const { store_id, item_id, title } = req.body;
            
            // SỬA 1: Chỉ bắt buộc store_id và title, bỏ item_id ra khỏi điều kiện
            if (!store_id || !title) {
                return res.status(400).json({ error: "Missing required fields (store_id or title)" });
            }

            // SỬA 2: Nếu item_id rỗng hoặc undefined thì gán bằng null để lưu vào DB
            req.body.item_id = item_id ? item_id : null;

            const newArticle = await articleService.createArticleService(req.body);
            return res.status(201).json({ message: "Article created", article: newArticle });
        } catch (err) {
            console.error("Controller Error:", err); // Log lỗi
            return res.status(500).json({ error: err.message });
        }
    },

    // 2. Get All
    getAllArticles: async (req, res) => {
        try {
            const articles = await articleService.getAllArticlesService();
            return res.status(200).json(articles);
        } catch (err) {
            console.error("Controller Error:", err);
            return res.status(500).json({ error: err.message });
        }
    },

    // 3. Get by Store
    getArticlesByStore: async (req, res) => {
        try {
            const articles = await articleService.getArticlesByStoreService(req.params.storeId);
            return res.status(200).json(articles);
        } catch (err) {
            console.error("Controller Error:", err);
            return res.status(500).json({ error: err.message });
        }
    },

    // 4. Get Detail
    getArticleById: async (req, res) => {
        try {
            const article = await articleService.getArticleByIdService(req.params.id);
            if (!article) {
                return res.status(404).json({ message: "Article not found" });
            }
            return res.status(200).json(article);
        } catch (err) {
            console.error("Controller Error:", err);
            return res.status(500).json({ error: err.message });
        }
    },

    // 5. Update
    updateArticle: async (req, res) => {
        try {
            // Logic cập nhật cũng nên cho phép item_id là null nếu muốn gỡ sản phẩm
            const { item_id } = req.body;
            if (item_id === "") req.body.item_id = null;

            await articleService.updateArticleService(req.params.id, req.body);
            return res.status(200).json({ message: "Article updated" });
        } catch (err) {
            console.error("Controller Error:", err);
            return res.status(500).json({ error: err.message });
        }
    },

    // 6. Delete
    deleteArticle: async (req, res) => {
        try {
            await articleService.deleteArticleService(req.params.id);
            return res.status(200).json({ message: "Article deleted" });
        } catch (err) {
            console.error("Controller Error:", err);
            return res.status(500).json({ error: err.message });
        }
    },

    likeArticle: async (req, res) => {
        try {
            await articleService.likeArticleService(req.params.id);
            res.json({ message: "Đã thích bài viết" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};