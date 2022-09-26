const mongoose = require("mongoose");

const dietPlanSchema = {
  title: String,
  userType: String,
  dietList:Array,
  userId: String ,
  userName: String ,
  imageURL:String,
  cloudinary_id:String
};

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);

module.exports.DietPlan = DietPlan;
