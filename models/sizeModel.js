const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  userId: String,
  chest: String,
  collar: String,
  neck: String,
  shoulderWidth: String,
  armLength: String,
  Inseam: String,
});

const Size = mongoose.model("Size", sizeSchema);  
module.exports.Size = Size;
