const express = require("express");
const router = express.Router();
const Practices = require("../controllers/Practices.js");

router.post("/add", Practices.createPractice);
router.post("/getall", Practices.getAllPractice);
router.post("/get/analyst", Practices.getAnalystPractice);
router.post("/get/totalmember", Practices.getMemberInClass);
router.post("/get/history", Practices.getHistorySubmit);
router.post("/home/practice", Practices.HomeGetPractice);
router.post("/get/member/:classCode", Practices.getPracticeForMember);
router.post("/page/all", Practices.pagePracticeTeacher);
module.exports = router;
