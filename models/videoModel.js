const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: { type: String, required: true },
  uploaderName: { type: String, required: true },
  description: { type: String, required: true },
  cloudinary_id: { type: String, required: true },
  videoURL: { type: String, required: true },
  targetArea: { type: String, required: true },
  equipment: { type: String, required: true },
  exercise: { type: Array },
  workoutList: { type: Array },
  userId: { type: String },
  userName: { type: String },
});

const Video = mongoose.model("Video", userSchema);
module.exports.Video = Video;
