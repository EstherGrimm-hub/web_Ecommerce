require('dotenv').config();
const { CreateStoreService , checkStoreService} = require('../service/sellerService');
const jwt = require("jsonwebtoken");

const createStore = async(req, res) => {
    console.log("Check request>>>>>>>>>>>> ", req.body);
    const { storeName, sellerId, description, storeAddress, storePhone} = req.body;
    const data =  await CreateStoreService(storeName, sellerId, description, storeAddress, storePhone)
    return res.status(201).json(data);
}


const checkStoreController = async (sellerId) => {
    try {
        const data = await checkStoreService(sellerId);
        return data;  
    } catch (err) {
        console.error(err);
        throw err;   
    }
}


module.exports = {createStore ,checkStoreController};
