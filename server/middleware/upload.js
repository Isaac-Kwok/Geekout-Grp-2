const multer = require("multer");
const path = require("path");
const maxSize = 4 * 1024 * 1024;

let uploadFile = multer({
    dest: "./uploads/",
    limits: { fileSize: maxSize },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./uploads/");
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
}).single("file");

module.exports = { uploadFile };
