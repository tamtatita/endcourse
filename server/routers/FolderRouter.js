const express = require("express");
const router = express.Router();
const Folder = require("../controllers/Folder.js");


router.post('/get/name', Folder.getFolder)

module.exports = router