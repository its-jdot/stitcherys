const express = require("express");
const { DietPlan } = require("../models/dietPlanModel");
const cloudinary = require("../utils/cloudinary");
const router = express.Router();
const upload = require("../utils/multer");
const { User } = require("../models/userModel");

//create Diet Plan
router.post("/create", upload.single("image"),async (req, res) => {
  const user = await User.findById(req.user);  
  const result = await cloudinary.uploader.upload(req.file.path);
  const dietPlan = new DietPlan({
    title: req.body.title,
    userType: req.body.userType,
    // dietType: req.body.dietType,
    // diet: req.body.diet,
    imageURL: result.secure_url,
    cloudinary_id: result.public_id,
    // userId: req.user,
    // userName: user.name,
  });
  await dietPlan.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//Add Diet List
router.post("/add/dietPlan/detail/:id", async (req, res) => {
  const dietPlan = await DietPlan.findById(req.params.id);
  let detail = [];
    req.body.map((data) => {
    detail.push(data);
  });
  dietPlan.dietList = detail;
  await dietPlan.save((err, doc) => {
    if (err) {
      return res.status(400).status.json({ msg: "Diet Plan List Added" });
    } else {
      return res.status(200).send(doc);
    }
  });
});

//get Diet Plan
router.get("/get", async (req, res) => {
  await DietPlan.find((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
}); 

//get diet plan by id
router.get("/get/:id", async (req, res) => {
  await DietPlan.findById(req.params.id).exec((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//delete Diet Plan
router.delete("/delete/:id", async (req, res) => {
  const dietPlan = await DietPlan.findByIdAndDelete({ _id: req.params.id });
  await cloudinary.uploader.destroy(dietPlan.cloudinary_id);
  return res.send(dietPlan);  
});

//update Diet Plan
router.put("/update/:id", async (req, res) => {
  const dietPlan = await DietPlan.findByIdAndUpdate({ _id: req.params.id });
  if (req.body.cloudinary_id === "") {
    await cloudinary.uploader.destroy(dietPlan.cloudinary_id);
    const result = await cloudinary.uploader.upload(req.file.path);
    (dietPlan.imageURL = result.secure_url),
      (dietPlan.cloudinary_id = result.public_id);
  }
dietPlan.title = req.body.title;
dietPlan.userType = req.body.userType;
dietPlan.diet = req.body.diet;
  await dietPlan.save();
    return res.send(dietPlan);
});

//Update Diet List
router.put("/update/dietPlan/:id/:index", async (req, res) => {
  const dietPlan = await DietPlan.findByIdAndUpdate({ _id: req.params.id });
  dietPlan.dietList[req.params.index] = req.body;
  dietPlan.markModified("dietList");
  await dietPlan.save();
  return res.send(dietPlan);
});

module.exports = router;
