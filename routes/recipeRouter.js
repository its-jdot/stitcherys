const express = require("express");
const { Recipe } = require("../models/recipeModel");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const { User } = require("../models/userModel");

//create recipe
router.post("/create", upload.single("image"), async (req, res) => {
  const user = await User.findById(req.user);  
  const result= await cloudinary.uploader.upload(req.file.path);
  const recipe = new Recipe({
      name: req.body.name,
      type: req.body.type,
      ingredients: req.body.ingredients,
      category: req.body.category,
      method: req.body.method,
      description: req.body.description,
      imageURL: result.secure_url,
      cloudinary_id: result.public_id,
      // userId: req.user,
      // userName: user.name,
  });
  await recipe.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});


//get Recipe
router.get("/get", async (req, res) => {
  await Recipe.find({ userId: req.user },(err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});
 
// get recipe by id
router.get("/get/:id", async (req, res) => {
  await Recipe.findById(req.params.id).exec((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//delete recipe
router.delete("/delete/:id", async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete({ _id: req.params.id });
  await cloudinary.uploader.destroy(recipe.cloudinary_id);
  return res.send(recipe);
});

//update Recipe
router.put("/update/:id", upload.single("image"), async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate({ _id: req.params.id });
  if (req.body.cloudinary_id === "") {
    await cloudinary.uploader.destroy(recipe.cloudinary_id);
    const result = await cloudinary.uploader.upload(req.file.path);
    (recipe.imageURL = result.secure_url),
      (recipe.cloudinary_id = result.public_id);
  }
  recipe.name = req.body.name;
  recipe.type = req.body.type;
  recipe.ingredients = req.body.ingredients;
  recipe.category = req.body.category;
  recipe.method = req.body.method;
  recipe.description = req.body.description;
  await recipe.save();
  return res.send(recipe);
});

module.exports = router;
