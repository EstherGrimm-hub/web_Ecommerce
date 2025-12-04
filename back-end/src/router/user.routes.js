const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/", userController.getAll);
router.get("/:id", userController.getById);

router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
