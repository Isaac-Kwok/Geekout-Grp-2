const express = require("express");
const { validateToken } = require("../middleware/validateToken");
const path = require("path");
const router = express.Router();

router.get("/profile/:name", (req, res) => {
    const fileName = req.params.name;
    const directoryPath = path.join(__dirname, "../public/uploads/profile_picture/");

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            return res.status(500).send({
                message: "Could not download the file. " + err,
            });

        }
    });
})

module.exports = router;