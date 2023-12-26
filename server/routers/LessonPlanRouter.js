const express = require("express");
const router = express.Router();
const LessonPlan = require("../controllers/LessonPlan.js");

router.post("/add", LessonPlan.addLessonPlan);
router.post("/get/all", LessonPlan.getAllLessonPlan);
router.post("/get/all2", LessonPlan.getAllLessonPlan2);
router.post("/insert/part", LessonPlan.insertLessonPlan);
router.delete("/delete/:id", LessonPlan.deleteChapterIndex);
router.post("/add/chapterindex", LessonPlan.insertChapterProgress);
router.patch("/update/chapterindex", LessonPlan.updateChapterIndex);
router.patch("/edit/chapterprogress", LessonPlan.editChapterProgress);
router.delete("/delete/chapterprogress/:id", LessonPlan.deleteChapterProgress);
router.post("/check/exist", LessonPlan.checkExistClass);
router.patch("/unsubscript", LessonPlan.unSubscript);
router.patch("/subscript", LessonPlan.subscript);
module.exports = router;
