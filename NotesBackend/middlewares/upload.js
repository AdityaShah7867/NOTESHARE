const path = require("path");
const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/vnd.ms-powerpoint" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      file.mimetype === "application/zip" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only pdf, docx, zip, ppt, pptx formats are allowed"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 40,
  },
});

var Resumeupload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "text/plain" ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only TXT, PDF, DOC, DOCX, JPG, JPEG, PNG formats are allowed"
        )
      );
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB limit
  },
});

var profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/user_profiles");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

var profileUpload = multer({
  storage: profileStorage,
});

module.exports = {
  upload,
  profileUpload,
  Resumeupload,
};
