process.env.TZ = "Asia/Jerusalem";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 6127;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const main_api_R = require("./Routers/main_api_R");
app.use("/api", main_api_R);

let db_M = require("./db");
global.db_pool = db_M.pool;

global.GenObj_Mid = require("./Middlewares/GenObj_Mid");

app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
});