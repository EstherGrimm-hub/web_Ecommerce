const express = require("express");
const routerAPI = require("express").Router();
const { poolPromise, sql } = require("../config/Sql");
const { verifyToken, checkRole } = require('../middleware/verify_token');
const {createUser, loginUser, GetAllUsers,GetAllsellers } = require("../controller/userController");
const { checkStore, checkStoreController } = require("../controller/sellerController");
const { searchItems } = require("../controller/elasticSearchController");


routerAPI.get("/", async (req, res) => {
    return res.status(200).json( { message: "API is working" } );
} );

routerAPI.post("/register", createUser);   

routerAPI.post('/login',loginUser);


routerAPI.get('/users', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const users = await GetAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "controller error" });
    }
});

routerAPI.get('/sellers', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const sellers = await GetAllsellers();
        res.json(sellers);
    } catch (err) {
        res.status(500).json({ message: "controller error " });
    }
});




routerAPI.get('/seller/store/:userId', verifyToken, checkRole(['seller']), async (req, res) => {
    try {
        const sellerId = req.params.userId;
        console.log("Raw sellerId from params:", sellerId);

        if (!sellerId) return res.status(400).json({ message: "Missing sellerId" });

        const hasStore = await checkStoreController(sellerId); 
        return res.status(200).json({ hasStore }); 
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
});

routerAPI.get('/seller/store/:owner_id', verifyToken, checkRole(['seller']), async (req, res) => {
    try {
        const sellerId = req.params.userId;
        console.log("Raw sellerId from params:", sellerId);

        if (!sellerId) return res.status(400).json({ message: "Missing sellerId" });

        const hasStore = await checkStoreController(sellerId); 
        return res.status(200).json({ hasStore }); 
    } catch (err) {
        console.error(err);c
        return res.status(500).json({ message: err.message });
    }
});

routerAPI.get('/search', searchItems);




routerAPI.use("/items", require("./item.routes"));
routerAPI.use("/categories", require("./category.routes"));

routerAPI.use("/articles", require("./article.routes"));
routerAPI.use("/stores", require("./store.routes"));
routerAPI.use("/orders", require("./order.routes"));



module.exports = routerAPI;

 