const express = require("express");
const router = express.Router();
//const multer = require("multer");
//const fs = require("fs");
const { Blog } = require("../models/blogModel");
const auth = require("../middleware/auth");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const { User } = require("../models/userModel");


//Create Blog
router.post("/create", auth, upload.single("image"), async (req, res) => {
  const user = await User.findById(req.user);
  const result = await cloudinary.uploader.upload(req.file.path);
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    imageURL: result.secure_url,
    cloudinary_id: result.public_id,
    userId: req.user,
    userName: user.name,
  });
  await blog.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//Get Blog
router.get("/get", auth, async (req, res) => {
  await Blog.find({ userId: req.user }, (err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});
router.get("/getAll", auth, async (req, res) => {
  await Blog.find((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});
//Get Blog by id
router.get("/get/:id", auth, async (req, res) => {
  await Blog.findById(req.params.id).exec((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//Delete Blog by id
router.delete("/delete/:id", auth, async (req, res) => {
  const blog = await Blog.findByIdAndDelete({ _id: req.params.id });
  await cloudinary.uploader.destroy(blog.cloudinary_id);
  return res.send(blog);
});

//Update Blog by id
router.put("/update/:id", auth, upload.single("image"), async (req, res) => {
  const blog = await Blog.findByIdAndUpdate({ _id: req.params.id });
  if (req.body.cloudinary_id === "") {
    await cloudinary.uploader.destroy(blog.cloudinary_id);
    const result = await cloudinary.uploader.upload(req.file.path);
    (blog.imageURL = result.secure_url),
      (blog.cloudinary_id = result.public_id);
  }
  blog.title = req.body.title;
  blog.content = req.body.content;
  await blog.save();
  return res.send(blog);
});

module.exports = router;
