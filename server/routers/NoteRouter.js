const express = require("express");
const router = express.Router();
const Note = require("../controllers/Note.js");

router.post("/getall/:classCode", Note.getAllNote);
router.delete("/delete/:classCode/:noteid", Note.deleteNote);
router.post("/add/:classCode", Note.createNote);
router.patch("/edit", Note.editNote);
module.exports = router;
