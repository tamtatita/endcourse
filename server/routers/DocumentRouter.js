const express = require("express");
const router = express.Router();
const Document = require("../controllers/Document.js");

router.post("/add", Document.createDocument);
router.post("/getall", Document.getAllDocument);
router.post("/add/store", Document.addDocumentStore);
router.post("/get/store", Document.getStoreDocument);
router.delete("/folder", Document.deleteFolder);
router.delete("/document", Document.deleteDocument);
router.post("/share", Document.shareFileToClass);
router.post("/add/folder", Document.createFolder);

module.exports = router;
