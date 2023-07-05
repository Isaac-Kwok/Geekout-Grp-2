const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateToken");
const { uploadLocationPicture } = require("../middleware/upload");

router.post("/upload", validateToken, uploadLocationPicture, (req, res) => {
  res.json({ filename: req.file.filename });
});

module.exports = router;
