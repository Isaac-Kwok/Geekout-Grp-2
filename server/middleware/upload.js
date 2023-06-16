const multer = require("multer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const maxSize = 4 * 1024 * 1024;

let uploadFile = multer({
    limits: { fileSize: maxSize },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            fs.mkdirSync("./uploads/", { recursive: true });
            cb(null, "./uploads/");
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
}).single("file");


let uploadProfilePicture = multer({
    // Must have a email ID in the url
    limits: { fileSize: maxSize },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            fs.mkdirSync("./uploads/profile/", { recursive: true });
            cb(null, "./uploads/profile/");
        },
        filename: (req, file, cb) => {
            cb(null, req.params.id + path.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single("profile_picture");


function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(null, false);
    }
}

uploadProfilePicture = util.promisify(uploadProfilePicture);

module.exports = { uploadFile, uploadProfilePicture };
