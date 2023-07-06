const multer = require("multer");
const path = require("path");
const { nanoid } = require("nanoid");
const fs = require("fs");
const util = require("util");
const maxSize = 4 * 1024 * 1024;

// Driver file upload
const driver_upload = multer.diskStorage({
  destination: (req, file, callback) => {
    fs.mkdirSync("./public/uploads/driver", { recursive: true });
    callback(null, "./public/uploads/driver");
  },
  filename: (req, file, callback) => {
    callback(null, nanoid(10) + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: driver_upload,
  limits: { fileSize: 1024 * 1024 },
}).single("file"); // file input name

// Joseph upload file
let uploadFile = multer({
  limits: { fileSize: maxSize },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync("./uploads/", { recursive: true });
      cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
}).single("file");

let uploadProfilePicture = multer({
  // Must have a email ID in the url
  limits: { fileSize: maxSize },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      fs.mkdirSync("./public/uploads/profile_picture", { recursive: true });
      cb(null, "./public/uploads/profile_picture");
    },
    filename: (req, file, cb) => {
      if (req.params.id) {
        cb(null, req.params.id + path.extname(file.originalname));
      } else {
        cb(null, req.user.email + path.extname(file.originalname));
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("profile_picture");

// Gregory upload file
const locationUpload = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/location_pictures");
  },
  filename: (req, file, callback) => {
    callback(null, nanoid(10) + path.extname(file.originalname));
  },
});
const uploadLocationPicture = multer({
  storage: locationUpload,
  limits: { fileSize: 1024 * 1024 },
}).single("file"); // file input name

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

// Products file upload
const uploadProductPicture = multer.diskStorage({
    destination: (req, file, callback) => {
        fs.mkdirSync("./public/uploads/products", { recursive: true });
        callback(null, './public/uploads/products');
    },
    filename: (req, file, callback) => {
        callback(null, nanoid(10) + path.extname(file.originalname));
    }
});

const upload_picture = multer({
    storage: uploadProductPicture,
    limits: { fileSize: 1024 * 1024 }
    }).single('file'); // file input name

uploadProfilePicture = util.promisify(uploadProfilePicture);

module.exports = {
  uploadFile,
  uploadProfilePicture,
  upload,
  uploadLocationPicture,
};
module.exports = { uploadFile, uploadProfilePicture, upload, upload_picture, uploadProductPicture};
