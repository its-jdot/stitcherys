const {User}=require("../models/userModel");

const admin = async (req, res, next) => {
  try{
  const user=await User.findById(req.user);
  if (user.role != "admin")
    return res.status(403).send("You are not authorized.");
  next();
  }catch(err){
    console.log(err);
  }
};

module.exports = admin;
