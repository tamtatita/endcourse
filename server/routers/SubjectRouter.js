const express = require("express");
const router = express.Router();
const Subject = require("../controllers/Subject.js");

router.post("/get/group", Subject.getSubjectGroupBy);
router.post("/get/name", Subject.getSubjectName);
module.exports = router;
