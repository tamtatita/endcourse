const express = require("express");
const router = express.Router();
const AnalyticalOverview = require("../controllers/AnalyticalOverview.js");

router.post("/subject", AnalyticalOverview.tongSoMonDay);
router.post("/subjectgroup", AnalyticalOverview.tongSoNhomDay);
router.post("/leave", AnalyticalOverview.tongSoThanhVien);

module.exports = router;
