const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  gender: { type: String },
  phoneNumber: { type: Number, required: true, unique: true },
  address: { type: String, required: true },
  role: { type: String, default: "user" },
  resetToken: { type: String },
  expireToken: { type: Date },
  cart: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("User", userSchema);
module.exports.User = User;
