const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: { type: String },
  uploaderName: { type: String },
  description: { type: String },
  cloudinary_audio_id: { type: String },
  audioURL: { type: String },
  cloudinary_image_id: { type: String },
  imageURL: { type: String },
  uploaderId:{type:String}
});

const Meditation = mongoose.model("Meditation", userSchema);
module.exports.Meditation = Meditation;
