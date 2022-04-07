const multer = require("multer");

// set to store in media
const storage = multer.diskStorage({
  destination: "./media",
  filename: (req, file, cb) => {
    cb(null, `${+new Date()}${file.originalname}`);
  },
});

// Initialize upload variable
const localupload = multer({
  storage,
});

module.exports = localupload;
