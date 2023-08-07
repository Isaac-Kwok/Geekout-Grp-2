const express = require("express");
const { validateToken } = require("../middleware/validateToken");
const path = require("path");
const router = express.Router();

router.get("/profile/:name", (req, res) => {
    const fileName = req.params.name;
    const directoryPath = path.join(__dirname, "../public/uploads/profile_picture/");

    res.sendFile(directoryPath + fileName, fileName);
})

module.exports = router;