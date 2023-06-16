const { uploadFile } = require("../middleware/upload");
const express = require("express");
const fs = require("fs");
const os = require("os");
const { validateToken } = require("../middleware/validateToken");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const maxSize = 4 * 1024 * 1024;

router.post("/", [validateToken, uploadFile], async (req, res) => {
    try {
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
            url: "//" +req.headers.host + `/uploads/${req.file.originalname}`,
        });
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
})

router.get("/", async (req, res) => {
    const directoryPath = path.join(__dirname, "../uploads/");

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
                error: err,
                directoryPath: directoryPath
            });
        }

        let fileInfos = [];

        if (files) {
            files.forEach((file) => {
                fileInfos.push({
                    name: file,
                    url: "//" + req.headers.host + `/uploads/${file}`,
                });
            });
            res.status(200).send(fileInfos);
        }


        
    });
})

router.get("/:name", (req, res) => {
    const fileName = req.params.name;
    const directoryPath = path.join(__dirname, "../uploads/");

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });

        }
    });
})

router.get("/profile/:name", (req, res) => {
    const fileName = req.params.name;
    const directoryPath = path.join(__dirname, "../uploads/profile/");

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });

        }
    });
})

router.delete("/:name", validateToken, (req, res) => {
    const fileName = req.params.name;
    const directoryPath = path.join(__dirname, "../uploads/");

    fs.unlink(directoryPath + fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete the file. " + err,
            });
        }

        res.status(200).send({
            message: "Deleted the file successfully: " + fileName,
        });
    })
})

module.exports = router;