const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  data:{
      type:Object,
      default:{}
  }
});

const History = mongoose.model("History", historySchema);
module.exports.History = History;
