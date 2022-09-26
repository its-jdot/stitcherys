const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".mp3"&& ext !== ".MP3" && ext !== ".M4A"&& ext !== ".ogg"&& ext !== ".OGG" && ext !== ".m4a"&& ext !== ".wav"&& ext !== ".WAV") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
//   limits:{
//       fileSize: 1024 * 1024 *10 }
});