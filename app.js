const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan"); // logger การทำงานของ server(request)
const bodyParser = require('body-parser'); // ช่วยในเรื่องการ parsing request
require("dotenv").config();
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const apiResponse = require("./helpers/apiResponse");
const cors = require("cors"); // จัดการเรื่อง cross origin ของ HTTP

// DB connection
const MONGODB_URL = process.env.MONGODB_URL;
const mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    //don't show the log when it is test
    if (process.env.NODE_ENV !== "test") {
        console.log("Connected to %s", MONGODB_URL);
        console.log("App is running ... \n");
        console.log("Press CTRL + C to stop the process. \n");
    }
}).catch(err => {
    console.error("App starting error:", err.message);
    process.exit(1);  //ปิดการทำงานของ Node
});
const db = mongoose.connection;

const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
    app.use(logger("dev"));
}
// app.use(express.json()); //express.json() => แปลงข้อมูลที่มีรูปแบบ JSON String ให้อยู่ในรูป JSON Objext    
app.use(express.urlencoded({ extended: false })); // express.urlencoded() => แปลงข้อมูลจาก form ในรูปแบบ url encode เป็น Object
app.use(cookieParser()); //cookieParser() => เอาไว้สำหรับอ่าน header cookie ไม่อย่างนั้นมันจะหาไม่เจอและพังตลอดนั่นเอง
app.use(express.static(path.join(__dirname, "public"))); //express.static() => เรียกใช้งาน static file เช่น ไฟล์รูปภาพ ไฟล์ js ไฟล์ css เป็นต้น
app.use(bodyParser.json()) //bodyParser.json() => ช่วยในเรื่องการ parsing request
app.use(bodyParser.urlencoded({ extended: true }));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
    return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
    if (err.name == "UnauthorizedError") {
        return apiResponse.unauthorizedResponse(res, err.message);
    }
});

module.exports = app;