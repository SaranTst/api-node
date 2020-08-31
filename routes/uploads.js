const express = require("express");
const UploadsController = require("../controllers/UploadsController");

const router = express.Router();

router.post("/", UploadsController.uploadTempImages);
router.get("/movefile/:nameimg", UploadsController.moveFile)

module.exports = router;