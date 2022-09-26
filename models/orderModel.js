const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name:String,
  email:String, 
  phoneNumber:String, 
  address:String,
  orderDate:Date, 
  total:Number,
  orderList:{
    type:Array,
    default:[]
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports.Order = Order;
