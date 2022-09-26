const mongoose = require("mongoose");

const recipeSchema = {
  name: String,
  type: String,
  ingredients: String,
  description: String,
  method: String,
  category: String,
  userId: String,
  userName: String,
  imageURL:String,
  cloudinary_id:String,
};

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports.Recipe = Recipe;
