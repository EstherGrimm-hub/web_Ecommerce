require('dotenv').config();
const express = require("express")
// const connectToDB = require("./config/Sql")

const {poolPromise} = require('./config/Sql');
const configViewsEngine = require('./config/configEngine')
const api = require('./router/API')
const cors = require("cors");

const { createIndex } = require('./model/elasticSearch_Item');
const { syncItems } = require('./service/elastic_Query');



const START_SERVER = ()=>{
    const app = express()

    const HOST = process.env.HOST 
    const PORT =process.env.PORT   

    app.use(cors())
    configViewsEngine(app) 
    app.use('/',api)
    //config body parser
    app.use(express.json()) 
    app.use(express.urlencoded({ extended: true })) 
    app.use("/api", api)


    app.listen( PORT, HOST, () => {
        console.log(`\n3. Server is running at http://${HOST}:${PORT}`)
    });
}

console.log("\n1.Connected to Sql Server\n")

poolPromise.then(async () => {
    console.log("\n2. Connected to SQL Database");
    await createIndex();
    await syncItems();
    START_SERVER();
}).catch(err => {
    console.log("Failed to connect to DB:", err);
    process.exit(0);
});

