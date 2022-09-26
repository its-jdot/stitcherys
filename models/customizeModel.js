const mongoose = require("mongoose");

const customizeSchema = new mongoose.Schema({
  model: String,
  collar: String,
  cuff: String,
  sleeves: String,
  color: String,
});

const Customize = mongoose.model("Customize", customizeSchema);  
module.exports.Customize = Customize;
