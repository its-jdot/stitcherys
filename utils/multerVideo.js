const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".mkv"&& ext !== ".mp4" && ext !== ".MP4" && ext !== ".MKV") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
//   limits:{
//       fileSize: 1024 * 1024 *10 }
});