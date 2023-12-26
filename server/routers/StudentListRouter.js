const express = require("express");
const router = express.Router();
const StudentList = require("../controllers/StudentList.js");

router.post("/add", StudentList.addStudentList);
router.get("/getall/:classCode", StudentList.getAllStudentList);
module.exports = router;
