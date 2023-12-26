const express = require("express");
const router = express.Router();
const Progress = require("../controllers/Progress.js");

router.post("/get/all", Progress.getAllClass);
router.post("/delay", Progress.caculateProgress);
router.post("/get/progress", Progress.getALLProgress);
router.post("/test", Progress.test);
module.exports = router;
