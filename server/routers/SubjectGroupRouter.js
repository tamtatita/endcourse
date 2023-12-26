const express = require("express");
const router = express.Router();
const SubjectGroup = require("../controllers/SubjectGroup.js");

router.post("/getall", SubjectGroup.getAllListSubjectGroup);
router.post("/add", SubjectGroup.addSubjectGroup);
router.post("/search", SubjectGroup.SearchClassCodeForStudent);
router.post("/join/:classCode", SubjectGroup.JoinClassForStudent);
router.post("/get/allclassid", SubjectGroup.getListClassID);
router.delete("/leave/:classCode", SubjectGroup.outGroup);
router.post("/all/listgroup", SubjectGroup.getAllSubjectGroup);
router.post("/hand/:teacherID", SubjectGroup.createClassHand);
router.post("/info/:classCode", SubjectGroup.getInformationClass);
router.patch("/update/info", SubjectGroup.updateSubjectGroup);
router.patch("/ngungday", SubjectGroup.ngungDayLop);
router.patch("/delete", SubjectGroup.xoaLopHoc);

module.exports = router;
