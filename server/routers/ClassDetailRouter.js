const express = require("express");
const router = express.Router();
const ClassDetail = require("../controllers/ClassDetail.js");

router.get("/:classCode", ClassDetail.getNameSubject);
// router.get('/total/member/:classCode', ClassDetail.totalMemberInGroup)
module.exports = router;
