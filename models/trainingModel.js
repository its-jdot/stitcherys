const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  programId: { type: Number },
  title: { type: String },
  targetArea: { type: String },
  equipment: { type: String },
  description: { type: String },
  exercise: { type: Array },
  workoutList: { type: Array },
  userId: { type: String },
  userName: { type: String },
  imageURL: { type: String },
  cloudinary_id: { type: String },
});

const Training = mongoose.model("Training", trainingSchema);
module.exports.Training = Training;
