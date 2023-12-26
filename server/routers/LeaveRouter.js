const express = require("express");
const router = express.Router();
const Leave = require("../controllers/Leave.js");

router.post("/find", Leave.findStatus);
router.patch("/update", Leave.confirmLeave);
router.post("/history", Leave.historyConfirmClass);
router.post("/create/calendar", Leave.createCalendar);
router.post("/reminder", Leave.RemiderCalendar);
router.patch("/reschedule", Leave.reschedule);
module.exports = router;
