const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadImageControlle");

router.post(
  "/",
  uploadController.upload.single("image"),
  uploadController.uploadImage
);

module.exports = router;
