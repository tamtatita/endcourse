const express = require("express");
const router = express.Router();
const Member = require("../controllers/Member.js");

router.get("/getall/:classCode", Member.getALlMemberInClass);
router.delete("/delete/:classCode/:memberID", Member.deleteMemberInClass);
module.exports = router;
