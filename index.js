process.env.TZ = "Asia/Jerusalem";

const express = require('express');

const port = 6127;
const app = express();
app.use(express.json());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const main_api_R = require("./Routers/main_api_R");
app.use("/api", main_api_R);

let db_M = require('./db');
global.db_pool = db_M.pool;

global.GenObj_Mid = require("./Middlewares/GenObj_Mid");

app.use(cors({
    origin: "http://localhost:5173", // Specify exact origin, not wildcard *
    credentials: true // Allow credentials
}));

const path = require('path');
 app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port (http://localhost:${port}`);
});