const mongoose = require("mongoose");

const productSchema = {
  name: String,
  brand: String,
  price: Number,
  quantity: Number,
  deliveryDays: Number,
  deliveryCharges: Number,
  description: String,
  category: String,
  imageURL:String,
  cloudinary_id:String
};

const Product = mongoose.model("Product", productSchema);

module.exports.Product = Product;
