const express = require("express");
const router = express.Router();
const Confirmation = require("../controllers/Confirmation.js");

router.post("/get/check", Confirmation.getCheck);
router.post("/check", Confirmation.checkConfirm);
router.post("/not/scored", Confirmation.kiemTraChuaChamCong);
module.exports = router;
