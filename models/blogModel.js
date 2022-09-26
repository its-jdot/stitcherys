const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  imageURL: { type: String },
  userId: { type: String },
  userName: { type: String },
  cloudinary_id: { type: String },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports.Blog = Blog;
