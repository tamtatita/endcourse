const express = require("express");
const router = express.Router();
const StudyGroup = require("../controllers/StudyGroup.js");

router.post("/getall/:classCode", StudyGroup.getAllStudyGroup);
router.post("/add/:classCode", StudyGroup.addStudyGroup);

module.exports = router;
