const express = require("express");
const router = express.Router();
const Analyst = require("../controllers/Analyst.js");

router.post("/progress", Analyst.analystProgress);

module.exports = router;
