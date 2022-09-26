const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".jpg"&& ext !== ".JPG" && ext !== ".webp"&& ext !== ".WEBP" && ext !== ".jpeg" && ext !== ".JPEG" && ext !== ".PNG"&& ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
  limits:{
      fileSize: 1024 * 1024 *10 }
});